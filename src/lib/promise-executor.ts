export class PromiseExecutor {
  private promises: { key: string; promise: Promise<any> }[] = [];

  add(key: string, promise: Promise<any>) {
    this.promises.push({ key, promise });
  }

  async execute(): Promise<{ [key: string]: any }> {
    const promisesToExecute = [...this.promises];
    const results = await Promise.all(promisesToExecute.map((p) => p.promise));
    this.promises = [];
    return results.reduce((acc, result, index) => {
      acc[promisesToExecute[index].key] = result;
      return acc;
    }, {});
  }
}
