import { Injectable } from '@angular/core';
import { isArray } from 'lodash';

/**
 * View Utilities
 */
@Injectable()
export class ViewUtils {
  /**
   * Absolute Value
   */
  abs(value: number) {
    return Math.abs(value);
  }

  /**
   * Average
   */
  avg(array: Array<number>): number {
    return array.reduce((p, c) => p + c, 0) / array.length;
  }

  /**
   * Format Number
   */
  formatNumber(v: number) {
    // TODO add configured i18n localized decimals
    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * Array Type Check
   */
  isArray(value: any): boolean {
    return isArray(value);
  }

  /**
   * Move from one index to other in array
   */
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
