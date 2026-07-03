import { Pipe, PipeTransform } from '@angular/core';
import { PRE_SALE_QUERY_CATEGORY, PRE_SALE_QUERY_TYPE } from '../models/pre-sales.types';

const CATEGORIES_TRANSLATIONS = new Map<PRE_SALE_QUERY_TYPE, string>([
  [PRE_SALE_QUERY_TYPE.PRE_SALES, 'pre-sales.query-type.pre-sales'],
  [PRE_SALE_QUERY_TYPE.QUARTERLY, 'pre-sales.query-type.quarterly'],
  [PRE_SALE_QUERY_TYPE.SPECIAL, 'pre-sales.query-type.special'],
]);

@Pipe({
  name: 'queryType',
})
export class QueryTypePipe implements PipeTransform {
  transform(status: PRE_SALE_QUERY_TYPE | string): string {
    return CATEGORIES_TRANSLATIONS.get(status as PRE_SALE_QUERY_TYPE) ?? status;
  }
}
