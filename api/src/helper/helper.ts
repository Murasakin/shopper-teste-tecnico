function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

export default class Helper {
  static convertKeysToCamelCase<T>(row: any): T {
    const newRow: any = {};
    for (const key in row) {
      if (row.hasOwnProperty(key)) {
        newRow[toCamelCase(key)] = row[key];
      }
    }
    return newRow as T;
  }

  static decimalNumberToString(n?: number): string {
    return n ? n.toFixed(2) : "0.00";
  }
}
