export class PropertyModel {
  name: any;
  label: string;
  placeholder: string;
  tooltip: string;
  value: any;

  public static builder(name: any, label: string, placeholder: string, tooltip: string): PropertyModel {
    const property = new PropertyModel();
    property.name = name;
    property.label = label;
    property.placeholder = placeholder;
    property.tooltip = tooltip;
    return property;
  }
}
