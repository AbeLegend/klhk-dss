export interface OptionsType {
  label: string;
  value: string;
  withCheckbox?: boolean;
}

export interface LegendsType {
  contentType: string,
  height: number,
  imageData: string,
  label: string,
  url: string,
  values: string[],
  width: number
}

export interface PropertiesType {
  Key: string;
  Value: string;
  Index: number;
}