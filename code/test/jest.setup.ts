import { beforeAll, afterAll, jest } from '@jest/globals';
import { Utils } from '@ziventi/utils';

beforeAll(() => {
  jest.spyOn(Utils, 'error').mockImplementation((err) => {
    throw new Error(err);
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});
