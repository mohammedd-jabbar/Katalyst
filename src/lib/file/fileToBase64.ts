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
export function toRawBase64(dataUrl: string): string {
  return dataUrl.split(",")[1] ?? dataUrl;
}

// Validate file type
export function isValidImageType(file: File): boolean {
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  return validTypes.includes(file.type);
}

// Validate file meets requirements (size and type)
export function validateFile(file: File, maxSizeMB: number = 5): void {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    const actualSizeMB = (file.size / 1024 / 1024).toFixed(2);
    throw new Error(
      `File is too large (${actualSizeMB}MB). Maximum size is ${maxSizeMB}MB.`,
    );
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Unsupported file type. Please upload JPG, PNG, WebP, or GIF.",
    );
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
