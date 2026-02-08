/* eslint-disable @typescript-eslint/no-explicit-any */

// Convert a File object to Base64 data URL string
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (!result || typeof result !== "string") {
        reject(new Error("Failed to read file"));
        return;
      }
      resolve(result);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// Extract just the Base64 string without the data URL prefix
export function toRawBase64(dataUrl: string) {
  return dataUrl.split(",")[1] ?? dataUrl;
}

// Validate file type
export function isValidImageType(file: File): boolean | Error {
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (!isValidImageType(file)) {
    return Error("Unsupported file type. Please upload JPG/PNG/GIF/WebP.");
  }

  return validTypes.includes(file.type);
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

export function assertValidAttachment(file: File) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) throw new Error("File too large (max 5MB)");
  if (!ALLOWED_TYPES.includes(file.type as any)) {
    throw new Error("Only JPG/PNG/WebP/PDF allowed");
  }
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
