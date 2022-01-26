export class Factory {
  static create<T>(type: (new () => T)): T {
    return new type();
  }
}
