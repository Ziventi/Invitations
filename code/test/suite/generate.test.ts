import { FileFormat, Utils, ZLoader } from '@ziventi/utils';

import fs from 'fs';
import path from 'path';

import main from '../project/controller/main';

const cwd = path.resolve(process.cwd(), 'test/project');
const outDir = `${cwd}/.out`;
const htmlOutDir = `${outDir}/html`;

beforeAll(() => {
  jest.spyOn(Utils, 'error').mockImplementation((err) => {
    throw new Error(err);
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Generation', () => {
  test('Generates correct number of files on specified limit', async () => {
    const limit = '3';
    await main({ limit });
    const numberOfFiles = fs.readdirSync(htmlOutDir).length;
    expect(numberOfFiles).toBe(Number(limit));
  });

  test('Generates correct file for specified name', async () => {
    const name = 'Abidemi Ajayi';
    await main({ name });
    const [file] = fs.readdirSync(htmlOutDir);
    const filename = path.parse(file).name;
    expect(filename).toBe(name);
  });

  test.each([true, false])(
    'Refreshes cache when flag is %s',
    async (shouldRefresh) => {
      const spy = jest.spyOn(ZLoader.prototype, 'execute');
      await main({ refreshCache: shouldRefresh });
      expect(spy).toBeCalledWith(shouldRefresh);
    }
  );

  test.each(['PDF', 'PNG'])('Generate %s files', async (fileType) => {
    const format = fileType.toLowerCase() as FileFormat;
    await main({ limit: 1, format });

    const pdfOutDir = `${outDir}/${format}`;
    expect(fs.existsSync(pdfOutDir)).toBe(true);

    const [file] = fs.readdirSync(pdfOutDir);
    expect(file).toBeDefined();

    const filename = path.parse(file).ext;
    expect(filename).toBe(`.${format}`);
  });
});
