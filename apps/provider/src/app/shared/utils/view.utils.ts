import { Injectable } from '@angular/core';

/**
 * View Utilities
 */
@Injectable()
export class ViewUtils {
  abs(value: number) {
    return Math.abs(value);
  }

  avg(array: Array<number>): number {
    return array.reduce((p, c) => p + c, 0) / array.length;
  }

  formatNumber(v: number) {
    // TODO add localized decimals transform
    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  isArray(value: any): boolean {
    return value instanceof Array;
  }

  move(array: Array<any>, moveIndex: number, toIndex: number): Array<any> {
    const item = array[moveIndex];
    const length = array.length;
    const diff = moveIndex - toIndex;

    if (diff > 0) {
      // move left
      return [
        ...array.slice(0, toIndex),
        item,
        ...array.slice(toIndex, moveIndex),
        ...array.slice(moveIndex + 1, length)
      ];
    } else if (diff < 0) {
      // move right
      const targetIndex = toIndex + 1;
      return [
        ...array.slice(0, moveIndex),
        ...array.slice(moveIndex + 1, targetIndex),
        item,
        ...array.slice(targetIndex, length)
      ];
    }

    return array;
  }
}
