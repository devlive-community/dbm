import { InjectionToken } from '@angular/core';
import { ConfigInterface } from "@renderer/interfaces/config.interface";

export const BuilderToken = new InjectionToken<ConfigInterface>('');
