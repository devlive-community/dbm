import { Inject, Injectable } from "@angular/core";
import { BuilderToken } from "@renderer/token/builder.token";
import { BuilderInterface } from "@renderer/interfaces/builder.interface";
import { DatabaseEnum } from "@renderer/enum/database.enum";

@Injectable()
export class BuilderFactory {
  constructor(@Inject(BuilderToken) private builders: BuilderInterface[]) {
  }

  createBuilder(name: DatabaseEnum) {
    return this.builders.filter(item => item.getName() === name)[0];
  }
}
