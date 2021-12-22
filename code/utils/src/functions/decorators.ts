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
    console.time('Time');
    const result = await originalMethod.apply(this, args);
    console.timeEnd('Time');
    return result;
  };

  return descriptor;
}
