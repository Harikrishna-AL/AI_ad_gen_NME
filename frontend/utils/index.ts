// @ts-nocheck

import Pica from "pica";

export function downloadImage(uri: string, name: string) {
  const link = document.createElement("a");
  link.href = uri;
  link.download = name;

  // this is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    // window.URL.revokeObjectURL(base64)
    link.remove();
  }, 100);
}

export function getImage(file: File): Promise<HTMLImageElement> {
  const reader = new FileReader();
  const image = new Image();
  return new Promise((resolve, reject) => {
    if (!file.type.match(/image.*/)) {
      reject(new Error("Not an image"));
      return;
    }
    reader.onload = (readerEvent: any) => {
      image.onload = () => resolve(image);
      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export function dataURItoBlob(dataURI: string) {
  const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const binary = atob(dataURI.split(",")[1]);
  const array = [];
  for (let i = 0; i < binary.length; i += 1) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: mime });
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = "image/png" as "image/jpeg" | "image/png",
  quality?: number
): Promise<Blob | null> {
  return new Promise((res) => {
    canvas.toBlob((blob) => res(blob), type, quality);
  });
}

export function blobToCanvas(blob: Blob): Promise<HTMLCanvasElement> {
  return new Promise((res, rej) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const image = new Image();

    image.onload = function blobToCanvasImageLoad() {
      ctx.canvas.width = image.naturalWidth;
      ctx.canvas.height = image.naturalHeight;
      ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

      res(ctx.canvas);
    };
    image.onerror = function blobToCanvasImageError(event) {
      rej(event);
    };

    image.src = URL.createObjectURL(blob);
  });
}

export const getBase64FromUrl = async (url: string): Promise<string> => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      resolve(base64data);
    };
  });
};

export async function scaleDownImage(base64URL) {
  const pica = new Pica();

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = async function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width / 2;
      canvas.height = img.height / 2;
      const ctx = canvas.getContext("2d");

      try {
        await pica.resize(img, canvas, {
          unsharpAmount: 150, // Adjusted unsharpAmount for increased sharpness
          unsharpRadius: 0.8, // Adjusted unsharpRadius for increased sharpness
          unsharpThreshold: 3, // Adjusted unsharpThreshold for increased sharpness
        });
        canvas.toBlob(
          function (blob) {
            const reader = new FileReader();
            reader.onload = function () {
              const scaledBase64 = reader.result.split(",")[1];
              resolve(scaledBase64);
            };
            reader.readAsDataURL(blob);
          },
          "image/png",
          1.0
        );
      } catch (error) {
        reject(error);
      }
    };
    img.src = base64URL;
  });
}
