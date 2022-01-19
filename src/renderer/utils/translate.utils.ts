import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TranslateUtils {
  private static translateService: TranslateService;

  public static init(translateService: TranslateService): void {
    this.translateService = translateService;
  }

  public static getValue(key: string): string {
    return this.translateService.instant(key);
  }
}
