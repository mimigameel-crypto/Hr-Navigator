/**
 * Google Calendar Workspace Integration Service
 * Configured with OAuth Scopes:
 * - https://www.googleapis.com/auth/calendar.events
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { defaultApp } from '../lib/firebaseInit';
import firebaseConfig from '../../firebase-applet-config.json';

export const GOOGLE_CALENDAR_SCOPES = [
  'https://www.googleapis.com/auth/calendar.events'
];

// Initialize Firebase App safely (always guaranteed [DEFAULT] exists)
const app = getApps().find(a => a.name === '[DEFAULT]') || defaultApp || initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar.events');
// Also add Drive scopes if already enabled
provider.addScope('https://www.googleapis.com/auth/drive.file');

// In-memory token cache (DO NOT store in localStorage per security guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface CalendarEventPayload {
  summary: string;
  description: string;
  startDateTime: string; // ISO 8601
  endDateTime: string;   // ISO 8601
  timeZone?: string;
  attendeeEmail?: string;
  consultantName?: string;
  meetingTopic?: string;
}

export interface CreatedCalendarEvent {
  id: string;
  summary: string;
  htmlLink: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  status: string;
}

/**
 * Listen for auth state changes
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Sign in with Google to get Calendar permissions
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth credential');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign In error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

/**
 * Book discovery call directly on Google Calendar API
 */
export const createDiscoveryCallEvent = async (
  token: string,
  payload: CalendarEventPayload
): Promise<CreatedCalendarEvent> => {
  const timeZone = payload.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Cairo';

  const eventBody: any = {
    summary: payload.summary,
    description: payload.description,
    start: {
      dateTime: payload.startDateTime,
      timeZone: timeZone
    },
    end: {
      dateTime: payload.endDateTime,
      timeZone: timeZone
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 60 },
        { method: 'popup', minutes: 15 }
      ]
    },
    conferenceData: {
      createRequest: {
        requestId: `hrn-meet-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  };

  if (payload.attendeeEmail) {
    eventBody.attendees = [
      { email: payload.attendeeEmail, displayName: payload.consultantName || 'HR Client' }
    ];
  }

  // Call Google Calendar API primary calendar
  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventBody)
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || response.statusText;
    throw new Error(`Google Calendar API error: ${message}`);
  }

  const createdEvent = await response.json();
  return createdEvent as CreatedCalendarEvent;
};

/**
 * List upcoming primary events for conflict checking or preview
 */
export const listUpcomingEvents = async (token: string, maxResults = 5) => {
  const now = new Date().toISOString();
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(now)}&maxResults=${maxResults}&singleEvents=true&orderBy=startTime`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to retrieve upcoming events');
  }

  const data = await response.json();
  return data.items || [];
};
