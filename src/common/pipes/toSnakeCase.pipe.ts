import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SnakeCasePipe implements PipeTransform {
  transform(value: {}) {
    const snakeCaseObj = {};
    for (const key in value) {
      const snakeCaseKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`,
      );
      snakeCaseObj[snakeCaseKey] = value[key];
    }
    return snakeCaseObj;
  }
}
