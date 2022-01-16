import { Utils } from '@ziventi/utils';

import { beforeAll, afterAll, jest } from '@jest/globals';

beforeAll(() => {
  jest.spyOn(Utils, 'error').mockImplementation((err) => {
    throw new Error(err);
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});
