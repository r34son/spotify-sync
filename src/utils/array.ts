export const chunkArray = (arr: Array<any>, chunkSize: number) =>
  [...Array(Math.ceil(arr.length / chunkSize))].map((_) =>
    arr.splice(0, chunkSize)
  );
