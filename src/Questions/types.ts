interface IPseudoProtoOption {
  text: string
  value?: any
}
export interface IOption extends IPseudoProtoOption {
  value: any
  selected?: boolean
}
export type IProtoOption = IPseudoProtoOption | string
// *******
export interface IQuestion extends IDefaults {
  question: string
  number: number
  optionSelected?: IOption //
}
export type IProtoQuestion = Partial<IQuestion> | string
// *******
export interface IProtoDefaults {
  options: IProtoOption[]
  random?: boolean
  numbered?: boolean
  required?: boolean
}
export interface IDefaults extends IProtoDefaults {
  options: IOption[]
}