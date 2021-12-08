export class BaseComponent {
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
