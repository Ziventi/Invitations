import { Dimensions } from 'constants/types';

export async function pdfFileTest(payload: RequestInit): Promise<void> {
  const res = await fetch('api/test/pdf', payload);
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

export async function pngFileTest(
  payload: RequestInit,
  canvasDimensions: Dimensions,
): Promise<void> {
  const res = await fetch('api/test/png', payload);
  if (!res.ok) throw new Error('Could not download image.');
  const data = await res.text();

  const img = new Image();
  img.src = data;
  img.height = canvasDimensions.height;
  img.width = canvasDimensions.width;
  const w = window.open(data);
  w?.document.write(img.outerHTML);
}

export async function pngArchive(payload: RequestInit): Promise<void> {
  const res = await fetch('api/png', payload);
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
