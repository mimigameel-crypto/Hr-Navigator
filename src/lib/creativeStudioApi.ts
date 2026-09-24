/**
 * Client-side API client for HR Navigator Creative AI Studio (Veo & Gemini)
 */

export interface VideoGenParams {
  mode: 'text_to_video' | 'image_to_video';
  prompt?: string;
  image?: string; // base64 string or data URL
  mimeType?: string;
  model?: string;
  aspectRatio?: '16:9' | '9:16';
  resolution?: '720p' | '1080p';
}

export interface VideoGenResponse {
  operationName: string;
  model: string;
  aspectRatio: string;
  resolution: string;
}

export interface VideoStatusResponse {
  done: boolean;
  error?: { message?: string; code?: number } | null;
  hasVideo?: boolean;
}

export interface ImageGenParams {
  prompt: string;
  image?: string; // for editing existing image
  mimeType?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '4:1';
  imageSize?: '512px' | '1K' | '2K';
  model?: string;
}

export interface ImageGenResponse {
  imageUrl: string;
  text: string;
  model: string;
  aspectRatio: string;
}

export const CreativeStudioApi = {
  /**
   * Start video generation via Veo
   */
  async startVideoGeneration(params: VideoGenParams): Promise<VideoGenResponse> {
    const res = await fetch('/api/generate-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}: Failed to start video generation`);
    }

    return res.json();
  },

  /**
   * Poll video status
   */
  async checkVideoStatus(operationName: string): Promise<VideoStatusResponse> {
    const res = await fetch('/api/video-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operationName }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${res.status}: Failed to check video status`);
    }

    return res.json();
  },

  /**
   * Download video as Blob and return blob URL
   */
  async fetchVideoBlobUrl(operationName: string): Promise<{ blobUrl: string; blob: Blob }> {
    const res = await fetch('/api/video-download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operationName }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${res.status}: Failed to download generated video`);
    }

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    return { blobUrl, blob };
  },

  /**
   * Generate or Edit image with Gemini 3.1 Flash Image
   */
  async generateOrEditImage(params: ImageGenParams): Promise<ImageGenResponse> {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}: Failed to generate/edit image`);
    }

    return res.json();
  },
};
