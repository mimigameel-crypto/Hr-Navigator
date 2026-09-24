import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // JSON and URL-encoded body parsing with generous payload limit for base64 media
  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ extended: true, limit: '60mb' }));

  // Helper to get GoogleGenAI client
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[Gemini Server] Warning: GEMINI_API_KEY is not defined in environment variables.');
    }
    return new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // -------------------------------------------------------------
  // API: Video Generation (Text-to-Video & Image-to-Video via Veo)
  // -------------------------------------------------------------
  app.post('/api/generate-video', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: 'GEMINI_API_KEY_MISSING',
          message: 'مفتاح Gemini API غير متاح في بيئة التشغيل. يرجى تفعيله من إعدادات المفاتيح.',
        });
      }

      const {
        mode = 'text_to_video', // 'text_to_video' | 'image_to_video'
        prompt = '',
        image = '',
        mimeType = 'image/jpeg',
        model,
        aspectRatio = '16:9', // '16:9' | '9:16'
        resolution = '720p',  // '720p' | '1080p'
      } = req.body;

      const ai = getAiClient();

      // Clean image base64 if provided
      let cleanImageBytes = '';
      let resolvedMimeType = mimeType || 'image/jpeg';

      if (image && typeof image === 'string') {
        if (image.startsWith('data:')) {
          const commaIdx = image.indexOf(',');
          if (commaIdx !== -1) {
            const meta = image.substring(0, commaIdx);
            const m = meta.match(/data:([^;]+);base64/);
            if (m) resolvedMimeType = m[1];
            cleanImageBytes = image.substring(commaIdx + 1);
          } else {
            cleanImageBytes = image;
          }
        } else {
          cleanImageBytes = image;
        }
      }

      // Determine model candidates
      // For image-to-video: prompt specifies model: veo-3.1
      // For text-to-video: prompt specifies model: veo-3.1-fast-generate-preview
      let modelCandidates: string[] = [];
      if (mode === 'image_to_video') {
        if (model) {
          modelCandidates = [model, 'veo-3.1', 'veo-3.1-generate-preview', 'veo-3.1-lite-generate-preview'];
        } else {
          modelCandidates = ['veo-3.1', 'veo-3.1-generate-preview', 'veo-3.1-lite-generate-preview'];
        }
      } else {
        if (model) {
          modelCandidates = [model, 'veo-3.1-fast-generate-preview', 'veo-3.1-lite-generate-preview', 'veo-3.1-generate-preview'];
        } else {
          modelCandidates = ['veo-3.1-fast-generate-preview', 'veo-3.1-lite-generate-preview', 'veo-3.1-generate-preview'];
        }
      }

      // Valid aspect ratio is 16:9 or 9:16
      const validAspectRatio = aspectRatio === '9:16' ? '9:16' : '16:9';
      const validResolution = resolution === '1080p' ? '1080p' : '720p';

      let lastError: any = null;
      let operation: any = null;
      let usedModel = '';

      for (const candidateModel of modelCandidates) {
        try {
          const videoConfig: any = {
            numberOfVideos: 1,
            resolution: validResolution,
            aspectRatio: validAspectRatio,
          };

          const params: any = {
            model: candidateModel,
            config: videoConfig,
          };

          if (prompt && prompt.trim()) {
            params.prompt = prompt.trim();
          }

          if (cleanImageBytes) {
            params.image = {
              imageBytes: cleanImageBytes,
              mimeType: resolvedMimeType,
            };
          }

          console.log(`[Veo] Attempting video generation with model "${candidateModel}" (mode: ${mode}, ratio: ${validAspectRatio})...`);
          operation = await ai.models.generateVideos(params);
          usedModel = candidateModel;
          break; // Success
        } catch (err: any) {
          console.warn(`[Veo] Failed with model "${candidateModel}":`, err?.message || err);
          lastError = err;
        }
      }

      if (!operation || !operation.name) {
        throw lastError || new Error('فشل في بدء عملية توليد الفيديو عبر نموذج Veo.');
      }

      console.log(`[Veo] Operation created: ${operation.name} using ${usedModel}`);
      return res.json({
        operationName: operation.name,
        model: usedModel,
        aspectRatio: validAspectRatio,
        resolution: validResolution,
      });
    } catch (error: any) {
      console.error('[Veo Generate Error]:', error);
      return res.status(500).json({
        error: error.message || 'حدث خطأ أثناء إرسال طلب توليد الفيديو.',
        details: error?.statusText || error?.toString(),
      });
    }
  });

  // -------------------------------------------------------------
  // API: Video Polling Status
  // -------------------------------------------------------------
  app.post('/api/video-status', async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ error: 'operationName is required' });
      }

      const ai = getAiClient();
      const op = new GenerateVideosOperation();
      op.name = operationName;

      const updated = await ai.operations.getVideosOperation({ operation: op });

      return res.json({
        done: !!updated.done,
        error: updated.error || null,
        metadata: updated.metadata || null,
        hasVideo: !!updated.response?.generatedVideos?.[0]?.video?.uri,
      });
    } catch (error: any) {
      console.error('[Veo Status Error]:', error);
      return res.status(500).json({
        error: error.message || 'حدث خطأ أثناء فحص حالة الفيديو.',
      });
    }
  });

  // -------------------------------------------------------------
  // API: Video Download & Stream
  // -------------------------------------------------------------
  app.all('/api/video-download', async (req, res) => {
    try {
      const operationName = (req.body?.operationName || req.query?.operationName) as string;
      if (!operationName) {
        return res.status(400).json({ error: 'operationName is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: 'GEMINI_API_KEY missing' });
      }

      const ai = getAiClient();
      const op = new GenerateVideosOperation();
      op.name = operationName;

      const updated = await ai.operations.getVideosOperation({ operation: op });
      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

      if (!uri) {
        return res.status(404).json({ error: 'Video URI not available or generation incomplete' });
      }

      // Fetch video binary using Gemini API key
      const videoRes = await fetch(uri, {
        headers: { 'x-goog-api-key': apiKey },
      });

      if (!videoRes.ok) {
        return res.status(videoRes.status).json({
          error: `Failed to fetch video stream from Google storage: ${videoRes.statusText}`,
        });
      }

      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', 'inline; filename="hr-navigator-veo.mp4"');
      res.setHeader('Cache-Control', 'public, max-age=3600');

      const arrayBuffer = await videoRes.arrayBuffer();
      return res.send(Buffer.from(arrayBuffer));
    } catch (error: any) {
      console.error('[Veo Download Error]:', error);
      return res.status(500).json({
        error: error.message || 'حدث خطأ أثناء تنزيل الفيديو.',
      });
    }
  });

  // -------------------------------------------------------------
  // API: Image Generation & Editing (Gemini 3.1 Flash Image)
  // -------------------------------------------------------------
  app.post('/api/generate-image', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: 'GEMINI_API_KEY_MISSING',
          message: 'مفتاح Gemini API غير متاح في بيئة التشغيل.',
        });
      }

      const {
        prompt = '',
        image = '',
        mimeType = 'image/jpeg',
        aspectRatio = '1:1', // '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '4:1'
        imageSize = '1K',    // '512px' | '1K' | '2K'
        model = 'gemini-3.1-flash-image',
      } = req.body;

      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ error: 'prompt is required' });
      }

      const ai = getAiClient();

      // Clean image base64 if editing
      let cleanImageBytes = '';
      let resolvedMimeType = mimeType || 'image/jpeg';

      if (image && typeof image === 'string') {
        if (image.startsWith('data:')) {
          const commaIdx = image.indexOf(',');
          if (commaIdx !== -1) {
            const meta = image.substring(0, commaIdx);
            const m = meta.match(/data:([^;]+);base64/);
            if (m) resolvedMimeType = m[1];
            cleanImageBytes = image.substring(commaIdx + 1);
          } else {
            cleanImageBytes = image;
          }
        } else {
          cleanImageBytes = image;
        }
      }

      const modelCandidates = [
        model,
        'gemini-3.1-flash-image',
        'gemini-3.1-flash-lite-image',
      ];

      let lastError: any = null;
      let generatedImageUrl: string | null = null;
      let textOutput = '';
      let usedModel = '';

      for (const candidateModel of modelCandidates) {
        try {
          const parts: any[] = [];
          if (cleanImageBytes) {
            parts.push({
              inlineData: {
                data: cleanImageBytes,
                mimeType: resolvedMimeType,
              },
            });
          }
          parts.push({ text: prompt.trim() });

          const imageConfig: any = {
            aspectRatio: aspectRatio || '1:1',
          };
          if (candidateModel === 'gemini-3.1-flash-image') {
            imageConfig.imageSize = imageSize || '1K';
          }

          console.log(`[Gemini Image] Calling ${candidateModel} with ratio ${aspectRatio}...`);
          const response = await ai.models.generateContent({
            model: candidateModel,
            contents: { parts },
            config: {
              imageConfig,
            },
          });

          if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData?.data) {
                const mime = part.inlineData.mimeType || 'image/png';
                generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
              } else if (part.text) {
                textOutput += part.text;
              }
            }
          }

          if (generatedImageUrl) {
            usedModel = candidateModel;
            break;
          }
        } catch (err: any) {
          console.warn(`[Gemini Image] Error with ${candidateModel}:`, err?.message || err);
          lastError = err;
        }
      }

      if (!generatedImageUrl) {
        throw lastError || new Error('لم يتم استرجاع صورة مولدة من النموذج.');
      }

      return res.json({
        imageUrl: generatedImageUrl,
        text: textOutput,
        model: usedModel,
        aspectRatio,
      });
    } catch (error: any) {
      console.error('[Gemini Image Error]:', error);
      return res.status(500).json({
        error: error.message || 'حدث خطأ أثناء معالجة الصورة بالذكاء الاصطناعي.',
      });
    }
  });

  // -------------------------------------------------------------
  // Static Files & Vite Integration
  // -------------------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Vite middleware for fast development & SPA hot reload
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HR Navigator Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal: Server startup failed', err);
  process.exit(1);
});
