import { Pipe, PipeTransform } from '@angular/core';
import { PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS } from '../models/pre-sales.types';

const STATUS_TAG_TRANSLATIONS = new Map<PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS, string>([
  [PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.PROCESSING, 'pre-sales.import-history-vehicle-status.processing'],
  [PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, 'pre-sales.import-history-vehicle-status.success'],
  [PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.ERROR, 'pre-sales.import-history-vehicle-status.error'],
  [PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.STARTED, 'pre-sales.import-history-vehicle-status.started'],
]);

@Pipe({
  name: 'importHistoryVehicleStatus',
})
export class ImportHistoryVehicleStatusPipe implements PipeTransform {
  transform(status: PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS | string): string {
    return STATUS_TAG_TRANSLATIONS.get(status as PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS) ?? status;
  }
}
