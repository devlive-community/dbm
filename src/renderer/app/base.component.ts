import { DatabaseEnum } from "@renderer/enum/database.enum";

export class BaseComponent {
  keys = Object.keys;

  dataSourceType = DatabaseEnum;

  loading = {
    button: false
  };
  disabled = {
    button: true,
    dialog: false
  };
  dialog = {
    create: false,
    delete: false,
    update: false,
    select: false,
    stop: false
  };
}
