export class QueryHelper {
  constructor(private obj?: any) {}

  setObj(obj: any) {
    this.obj = obj;
  }

  toColumns() {
    return `(${Object.keys(this.obj).join(',')})`;
  }

  toValues() {
    return Object.values(this.obj);
  }

  toPlaceholders = () => {
    return `(${Object.values(this.obj)
      .map((value) => '?')
      .join(',')})`;
  };
}
