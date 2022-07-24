import { Inject, Injectable } from '@angular/core';
import { DatabaseEnum } from '@renderer/enum/database.enum';
import { PluginInterface } from '@renderer/interfaces/plugin.interface';
import { PluginToken } from '@renderer/token/plugin.token';

@Injectable()
export class PluginFactory {
  constructor(@Inject(PluginToken) private services: PluginInterface[]) {
  }

  /**
   * Get plugin by type
   * @param name DatabaseEnum plugin type
   * @returns plugin instance
   */
  createService(name: DatabaseEnum): PluginInterface {
    return this.services.filter(item => item.getName() === name)[0];
  }
}
