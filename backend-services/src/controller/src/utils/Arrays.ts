export const divideArrayEachOfToBatches = (array: number[], batchSize: number): number[][] => {
  const result = [];
  while (array.length) {
    result.push(array.splice(0, batchSize));
  }
  return result;
};
