export class BaseComponent {
  keys = Object.keys;

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
    select: false
  };
}
