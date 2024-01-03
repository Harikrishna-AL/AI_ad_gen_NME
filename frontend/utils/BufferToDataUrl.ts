export const  arrayBufferToDataURL =  (buffer: ArrayBuffer): string  =>{
  const blob = new Blob([buffer], { type: 'image/png' });
  return URL.createObjectURL(blob);
  }

 export async function dataURLtoFile(dataURL: string, filename: string):Promise<File>{
    const response = await fetch(dataURL);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
  }



  export  function arrayBufferToDataURLNew(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach((byte) => binary += String.fromCharCode(byte));
    return `data:image/png;base64,${window.btoa(binary)}`;
  }