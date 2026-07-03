import { Pipe, PipeTransform } from '@angular/core';
import { PRE_SALE_QUERY_CATEGORY } from '../models/pre-sales.types';

const CATEGORIES_TRANSLATIONS = new Map<PRE_SALE_QUERY_CATEGORY, string>([
  [PRE_SALE_QUERY_CATEGORY.FLEET, 'pre-sales.query-category.fleet'],
  [PRE_SALE_QUERY_CATEGORY.RAC, 'pre-sales.query-category.rac'],
  [PRE_SALE_QUERY_CATEGORY.FREE, 'pre-sales.query-category.free'],
]);

@Pipe({
  name: 'queryCategory',
})
export class QueryCategoryPipe implements PipeTransform {
  transform(status: PRE_SALE_QUERY_CATEGORY | string): string {
    return CATEGORIES_TRANSLATIONS.get(status as PRE_SALE_QUERY_CATEGORY) ?? status;
  }
}
