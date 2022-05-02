import { Dimensions } from 'constants/types';

/**
 * Downloads a PNG or PDF archive of all the generated file.
 * @param payload The request payload.
 */
export async function archive(payload: RequestInit): Promise<void> {
  const res = await fetch('/api', payload);
  if (!res.ok) throw new Error('Could not download archive.');
  const archive = await res.blob();
  const url = URL.createObjectURL(archive);

  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.download = 'ziventi.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Downloads a single PDF file of the canvas and opens it in the
 * browser. For test purposes only.
 * @param payload The request payload.
 */
export async function singlePDFFile(payload: RequestInit): Promise<void> {
  const res = await fetch('api/test', payload);
  if (!res.ok) throw new Error('Could not download PDF.');
  const image = await res.blob();

  const url = URL.createObjectURL(image);
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Downloads a single PNG image of the canvas and opens it in the browser. For
 * test purposes only.
 * @param payload The request payload.
 * @param dimensions The dimensions of the canvas.
 */
export async function singlePNGImage(
  payload: RequestInit,
  dimensions: Dimensions,
): Promise<void> {
  const res = await fetch('api/test', payload);
  if (!res.ok) throw new Error('Could not download image.');
  const data = await res.text();

  const img = new Image();
  img.src = data;
  img.height = dimensions.height;
  img.width = dimensions.width;
  const w = window.open(data);
  w?.document.write(img.outerHTML);
}
