import {
  IOption,
  IProtoOption,
  IProtoQuestion,
  IQuestion,
  IDefaults,
  IProtoDefaults,
} from './types'

export * from './types'

export const normalizeQuestions = (questions: IProtoQuestion[], _defaults: IProtoDefaults): IQuestion[] => {
  
  const defaultOptions: IOption[] = _defaults.options.map((_opt: IProtoOption, _index) => {
    if(typeof _opt === 'string') {
      return {
        text: _opt,
        value: _index
      }
    } else if(typeof _opt === 'object') {
      return {..._opt, value: ('value' in _opt) ? _opt.value : _index+1 }
    }
  })

  const defaults: IDefaults = {
    ..._defaults, 
    options: defaultOptions,
    random: 'random' in _defaults ? _defaults.random : false,
    numbered: 'numbered' in _defaults ? _defaults.numbered : true,
    required: 'required' in _defaults ? _defaults.required : false,
  }

  return questions.map((question: IProtoQuestion, index: number) => {

    if(typeof question === 'string') {
      return {
        ...defaults,
        question,
        number: index + 1,
      }
    }

    else {
      if(typeof question?.question === 'string') {
        return {
          ...defaults,
          ...question,
          numbered: !!question.numbered,
          question: question.question,
          required: !!question.required,
          number: index + 1,
        }
      } else {
        throw new Error("La pregunta del índice " + index + ": " + JSON.stringify(question, null ,3) + ". No tiene una pregunta correcta")
      }
    }

  })
}