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
 * @param canvasDimensions The dimensions of the canvas.
 * @param imageDimensions The dimensions of the image.
 */
export async function singlePNGImage(
  payload: RequestInit,
  canvasDimensions: Dimensions,
  imageDimensions: Dimensions,
): Promise<void> {
  const res = await fetch('api/test', payload);
  if (!res.ok) throw new Error('Could not download image.');
  const data = await res.text();

  const img = new Image();
  img.src = data;
  img.height = imageDimensions.height;
  img.width = imageDimensions.width;
  img.style.height = '100%';
  img.style.width = '100%';

  const main = document.createElement('main');
  main.style.height = `${canvasDimensions.height}px`;
  main.style.width = `${canvasDimensions.width}px`;
  main.append(img);

  const w = window.open(data);
  w?.document.write(main.outerHTML);
}
