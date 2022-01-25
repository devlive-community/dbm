export class PropertyModel {
  name: any;
  label: string;
  placeholder: string;
  tooltip: string;
  value: any;
  origin: string;
  isSetting: boolean;

  public static builder(name: any, label: string, placeholder: string, tooltip: string, origin?: string, isSetting?: boolean): PropertyModel {
    const property = new PropertyModel();
    property.name = name;
    property.label = label;
    property.placeholder = placeholder;
    property.tooltip = tooltip;
    property.origin = origin;
    property.isSetting = isSetting;
    return property;
  }
}
