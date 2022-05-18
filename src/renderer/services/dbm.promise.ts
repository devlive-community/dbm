export class DbmPromise extends Promise<any> {
  constructor(timeout, callback) {
    // We need to support being called with no milliseconds
    // value, because the various Promise methods (`then` and
    // such) correctly call the subclass constructor when
    // building the new promises they return.
    const haveTimeout = typeof timeout === "number";
    const init = haveTimeout ? callback : timeout;
    super((resolve, reject) => {
      if (haveTimeout) {
        const timer = setTimeout(() => {
          reject(new Error(`Promise timed out after ${timeout}ms`));
        }, timeout);
        init(
          (value) => {
            clearTimeout(timer);
            resolve(value);
          },
          (error) => {
            clearTimeout(timer);
            reject(error);
          }
        );
      } else {
        init(resolve, reject);
      }
    });
  }

  // Pick your own name of course. (You could even override `resolve` itself
  // if you liked; just be sure to do the same arguments detection we do
  // above in the constructor, since you need to support the standard use of
  // `resolve`.)
  static resolveWithTimeout(timeout, x) {
    if (!x || typeof x.then !== "function") {
      // `x` isn't a thenable, no need for the timeout,
      // fulfill immediately
      return this.resolve(x);
    }
    return new this(timeout, x.then.bind(x));
  }
}
