export function bufferedRequests<T>(
  promises: Promise<any>[],
  parallel: boolean = false
): Promise<T[]> {
  const maxParallelPromises: number = 8;
  const batchTimeout: number = 300;

  return new Promise<T[]>(async (resolve, reject) => {
    try {
      let promiseBuffer = [];
      const responsesBuffer: T[] = [];

      while (promises.length) {
        promiseBuffer = promises.splice(0, maxParallelPromises);

        if (parallel) {
          responsesBuffer.push(...(await Promise.all(promiseBuffer)));
        } else {
          while (promiseBuffer.length) {
            responsesBuffer.push(await promiseBuffer.shift());
          }
        }

        if (promises.length) {
          await sleep(batchTimeout);
        }
      }

      resolve(responsesBuffer);
    } catch (error) {
      reject(error);
    }
  });
}

export async function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
