/**
 * Camera and Image Processing Utility for 5S Inspections
 */

export interface ProcessedImage {
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
}

export class CameraService {
  /**
   * Resizes an image File to a standard maximum dimension and quality
   * Stamps inspection metadata watermark if requested
   */
  static async processImageFile(
    file: File,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
      watermarkText?: string;
    } = {}
  ): Promise<ProcessedImage> {
    const {
      maxWidth = 1024,
      maxHeight = 1024,
      quality = 0.8,
      watermarkText,
    } = options;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;

          // Maintain aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Canvas context could not be created'));
            return;
          }

          // Draw original resized
          ctx.drawImage(img, 0, 0, width, height);

          // Optional 5S timestamp watermark on bottom-left
          if (watermarkText) {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
            ctx.fillRect(0, height - 32, width, 32);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px "JetBrains Mono", monospace';
            ctx.fillText(watermarkText, 12, height - 12);
          }

          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve({
            dataUrl,
            width,
            height,
            sizeBytes: Math.round((dataUrl.length * 3) / 4),
          });
        };
        img.onerror = () => reject(new Error('Gagal memuat gambar'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Gagal membaca file foto'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Takes a snapshot from an active HTMLVideoElement stream
   */
  static captureVideoFrame(
    video: HTMLVideoElement,
    watermarkText?: string
  ): ProcessedImage {
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // Draw video frame
    ctx.drawImage(video, 0, 0, width, height);

    // Add watermark bar
    if (watermarkText) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(0, height - 36, width, 36);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px "JetBrains Mono", monospace';
      ctx.fillText(watermarkText, 14, height - 13);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
    return {
      dataUrl,
      width,
      height,
      sizeBytes: Math.round((dataUrl.length * 3) / 4),
    };
  }

  /**
   * Request user media with rear camera priority
   */
  static async startCameraStream(facingMode: 'environment' | 'user' = 'environment'): Promise<MediaStream> {
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
    } catch {
      // Fallback without facingMode constraint
      return await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
    }
  }

  /**
   * Stop all stream tracks safely
   */
  static stopStream(stream: MediaStream | null): void {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }
}
