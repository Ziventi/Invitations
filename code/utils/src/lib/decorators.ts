import { logger } from './logger';

/**
 * Times a class method.
 */
export function Timed(
  _: any,
  __: string,
  descriptor: TypedPropertyDescriptor<any>
): TypedPropertyDescriptor<any> {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any) {
    const startTime = Date.now();
    const result = await originalMethod.apply(this, args);
    const endTime = Date.now();
    const difference = (endTime - startTime) / 1000;
    logger.info(`Finished in ${difference.toFixed(2)}s.`);
    return result;
  };

  return descriptor;
}
