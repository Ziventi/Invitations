import Ziventi, { ZLoader } from '@ziventi/utils';
import AdmZip from 'adm-zip';

import fs from 'fs';
import path from 'path';

import { TEST_PROJECT_ROOT } from '../constants';
import * as API from '../project/controller/api';

const cwd = TEST_PROJECT_ROOT;
const outDir = `${cwd}/.out`;
const htmlOutDir = `${outDir}/html`;

jest.setTimeout(15000);

describe('Generation', () => {
  test('Generates correct number of files on specified limit', async () => {
    const limit = '3';
    await API.generate({ limit });
    const numberOfFiles = fs.readdirSync(htmlOutDir).length;
    expect(numberOfFiles).toBe(Number(limit));
  });

  test('Generates correct file for specified name', async () => {
    const name = 'Abidemi Ajayi';
    await API.generate({ name });
    const [file] = fs.readdirSync(htmlOutDir);
    const filename = path.parse(file).name;
    expect(filename).toBe(name);
  });

  test('Generates ZIP file', async () => {
    const format = 'pdf';
    await API.generate({ limit: 1, format, zip: true });

    const testProjectZip = `${outDir}/Test Project.zip`;
    const zipExists = fs.existsSync(testProjectZip);
    expect(zipExists).toBe(true);

    const zip = new AdmZip(testProjectZip);
    const file = zip.getEntries().shift();
    expect(file).toBeDefined();
    expect(file!.entryName).toBe('Abidemi Ajayi.pdf');
  });

  test.each([true, false])(
    'Refreshes cache when flag is %s',
    async (shouldRefresh) => {
      const spy = jest.spyOn(ZLoader.prototype, 'execute');
      await API.generate({ refreshCache: shouldRefresh });
      expect(spy).toBeCalledWith(shouldRefresh);
    }
  );

  test.each(['PDF', 'PNG'])('Generate %s files', async (fileType) => {
    const format = fileType.toLowerCase() as Ziventi.FileFormat;
    await API.generate({ limit: 1, format });

    const formatOutDir = `${outDir}/${format}`;
    expect(fs.existsSync(formatOutDir)).toBe(true);

    const [file] = fs.readdirSync(formatOutDir);
    expect(file).toBeDefined();

    const filename = path.parse(file).ext;
    expect(filename).toBe(`.${format}`);
  });
});
