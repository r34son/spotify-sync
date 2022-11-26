export const promiseSequence = <T, R>(array: T[], fn: (x: T) => Promise<R>) =>
  array.reduce(
    (chainingPromise, item) =>
      chainingPromise.then((result) =>
        fn(item).then(Array.prototype.concat.bind(result))
      ),
    Promise.resolve<R[]>([])
  );
