import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, setDoc, getDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { defaultApp } from './firebaseInit';
import defaultConfig from '../../firebase-applet-config.json';

export interface FirebaseConnectionConfig {
  id: string;
  nameAr: string;
  nameEn: string;
  accountEmail: string;
  projectId: string;
  apiKey: string;
  authDomain: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  isDefault?: boolean;
  notes?: string;
}

const STORAGE_KEY_CONNECTIONS = 'hrn_firebase_cloud_connections';
const STORAGE_KEY_ACTIVE_ID = 'hrn_firebase_active_cloud_id';

// Default initial accounts pre-configured for the user
export const DEFAULT_CONNECTIONS: FirebaseConnectionConfig[] = [
  {
    id: 'cloud_mimigameel',
    nameAr: 'السحابة الأساسية (Mimi Gameel)',
    nameEn: 'Primary Cloud (Mimi Gameel)',
    accountEmail: 'mimigameel@gmail.com',
    projectId: defaultConfig.projectId || 'gen-lang-client-0161932012',
    apiKey: defaultConfig.apiKey,
    authDomain: defaultConfig.authDomain,
    storageBucket: defaultConfig.storageBucket,
    messagingSenderId: defaultConfig.messagingSenderId,
    appId: defaultConfig.appId,
    isDefault: true,
    notes: 'السحابة الرئيسية الافتراضية المرتبطة بـ Google Cloud Platform'
  },
  {
    id: 'cloud_mimigameel82',
    nameAr: 'السحابة الإضافية (Mimigameel82)',
    nameEn: 'Secondary Cloud (Mimigameel82)',
    accountEmail: 'Mimigameel82@gmail.com',
    projectId: 'hr-navigator-cloud-82',
    apiKey: defaultConfig.apiKey, // Can be updated by the user in settings
    authDomain: 'hr-navigator-cloud-82.firebaseapp.com',
    storageBucket: 'hr-navigator-cloud-82.firebasestorage.app',
    messagingSenderId: '495042743337',
    appId: '1:495042743337:web:82secondaryapplet',
    isDefault: false,
    notes: 'سحابة الحساب الثاني الاحتياطية والتنظيمية'
  }
];

class CloudServiceManager {
  private activeApp: FirebaseApp | null = null;
  private activeAuth: Auth | null = null;
  private activeDb: Firestore | null = null;
  private activeConnection: FirebaseConnectionConfig;
  private listeners: Array<(conn: FirebaseConnectionConfig) => void> = [];

  constructor() {
    // Always ensure the standard [DEFAULT] Firebase app is initialized first with defaultConfig
    if (!getApps().some(a => a.name === '[DEFAULT]')) {
      try {
        initializeApp(defaultConfig);
      } catch (e) {
        console.warn('Default Firebase app initialization note:', e);
      }
    }

    const savedConnections = this.getConnections();
    const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    const found = savedConnections.find(c => c.id === activeId) || savedConnections[0];
    this.activeConnection = found;
    this.initFirebaseInstance(this.activeConnection);
  }

  public getConnections(): FirebaseConnectionConfig[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONNECTIONS);
      if (stored) {
        const parsed: FirebaseConnectionConfig[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Verify that secondary cloud exists, if not append it
          const hasSecondary = parsed.some(c => c.accountEmail.toLowerCase().includes('mimigameel82'));
          if (!hasSecondary) {
            const updated = [...parsed, DEFAULT_CONNECTIONS[1]];
            this.saveConnections(updated);
            return updated;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored cloud connections', e);
    }
    // Save defaults
    this.saveConnections(DEFAULT_CONNECTIONS);
    return DEFAULT_CONNECTIONS;
  }

  public saveConnections(connections: FirebaseConnectionConfig[]) {
    try {
      localStorage.setItem(STORAGE_KEY_CONNECTIONS, JSON.stringify(connections));
    } catch (e) {
      console.error('Failed to save cloud connections to localStorage', e);
    }
  }

  public getActiveConnection(): FirebaseConnectionConfig {
    return this.activeConnection;
  }

  public getDb(): Firestore | null {
    if (!this.activeDb) {
      this.initFirebaseInstance(this.activeConnection);
    }
    return this.activeDb;
  }

  public getAuth(): Auth | null {
    if (!this.activeAuth) {
      this.initFirebaseInstance(this.activeConnection);
    }
    return this.activeAuth;
  }

  public getApp(): FirebaseApp | null {
    if (!this.activeApp) {
      this.initFirebaseInstance(this.activeConnection);
    }
    return this.activeApp;
  }

  public subscribe(callback: (conn: FirebaseConnectionConfig) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(cb => {
      try {
        cb(this.activeConnection);
      } catch (e) {
        console.error('Error in cloud connection listener', e);
      }
    });
  }

  public switchConnection(connectionId: string): boolean {
    const connections = this.getConnections();
    const target = connections.find(c => c.id === connectionId);
    if (!target) {
      console.error(`Connection ${connectionId} not found`);
      return false;
    }

    this.activeConnection = target;
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, target.id);
    this.initFirebaseInstance(target);
    this.notify();
    return true;
  }

  public addOrUpdateConnection(config: FirebaseConnectionConfig): boolean {
    const connections = this.getConnections();
    const existingIndex = connections.findIndex(c => c.id === config.id);

    if (existingIndex >= 0) {
      connections[existingIndex] = config;
    } else {
      connections.push(config);
    }

    this.saveConnections(connections);

    if (this.activeConnection.id === config.id) {
      this.activeConnection = config;
      this.initFirebaseInstance(config);
      this.notify();
    }
    return true;
  }

  public removeConnection(connectionId: string): boolean {
    let connections = this.getConnections();
    if (connections.length <= 1) {
      console.warn('Cannot delete the last remaining cloud connection');
      return false;
    }

    connections = connections.filter(c => c.id !== connectionId);
    this.saveConnections(connections);

    if (this.activeConnection.id === connectionId) {
      this.switchConnection(connections[0].id);
    }
    return true;
  }

  public resetToDefaults(): void {
    this.saveConnections(DEFAULT_CONNECTIONS);
    this.switchConnection(DEFAULT_CONNECTIONS[0].id);
  }

  private initFirebaseInstance(config: FirebaseConnectionConfig) {
    try {
      const appName = `hrn_cloud_${config.id.replace(/[^a-zA-Z0-9_]/g, '_')}`;
      const existingApps = getApps();
      const existing = existingApps.find(a => a.name === appName);

      if (existing) {
        this.activeApp = existing;
      } else {
        const fbConfig = {
          apiKey: config.apiKey || defaultConfig.apiKey,
          authDomain: config.authDomain || defaultConfig.authDomain,
          projectId: config.projectId || defaultConfig.projectId,
          storageBucket: config.storageBucket || defaultConfig.storageBucket,
          messagingSenderId: config.messagingSenderId || defaultConfig.messagingSenderId,
          appId: config.appId || defaultConfig.appId
        };
        this.activeApp = initializeApp(fbConfig, appName);
      }

      this.activeAuth = getAuth(this.activeApp);
      this.activeDb = getFirestore(this.activeApp);
    } catch (err) {
      console.error(`Failed to initialize Firebase app for connection ${config.id}:`, err);
      // Fallback to default [DEFAULT] instance
      const fallbackApp = getApps().find(a => a.name === '[DEFAULT]') || defaultApp || initializeApp(defaultConfig);
      this.activeApp = fallbackApp;
      this.activeAuth = getAuth(fallbackApp);
      this.activeDb = getFirestore(fallbackApp);
    }
  }

  /**
   * Sync a dataset document to Firestore
   */
  public async syncDoc(collectionName: string, docId: string, data: any): Promise<boolean> {
    try {
      const db = this.getDb();
      if (!db) return false;
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
        syncedViaAccount: this.activeConnection.accountEmail
      }, { merge: true });
      return true;
    } catch (err) {
      console.warn(`[CloudService:${this.activeConnection.accountEmail}] syncDoc error:`, err);
      return false;
    }
  }

  /**
   * Read document from current active cloud
   */
  public async readDoc(collectionName: string, docId: string): Promise<any | null> {
    try {
      const db = this.getDb();
      if (!db) return null;
      const docRef = doc(db, collectionName, docId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data();
      }
      return null;
    } catch (err) {
      console.warn(`[CloudService:${this.activeConnection.accountEmail}] readDoc error:`, err);
      return null;
    }
  }

  /**
   * Listen to real-time changes on a document
   */
  public onDocSnapshot(collectionName: string, docId: string, onUpdate: (data: any) => void) {
    const db = this.getDb();
    if (!db) return () => {};
    const docRef = doc(db, collectionName, docId);
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data());
      }
    }, (error) => {
      console.warn(`[CloudService] Snapshot listener notice:`, error.message);
    });
  }
}

// Global Singleton Instance
export const CloudService = new CloudServiceManager();
