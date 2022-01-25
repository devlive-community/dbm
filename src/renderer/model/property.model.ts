export class PropertyModel {
  name: any;
  label: string;
  placeholder: string;
  tooltip: string;
  value: any;
  origin: string;

  public static builder(name: any, label: string, placeholder: string, tooltip: string, origin?: string): PropertyModel {
    const property = new PropertyModel();
    property.name = name;
    property.label = label;
    property.placeholder = placeholder;
    property.tooltip = tooltip;
    property.origin = origin;
    return property;
  }
}
