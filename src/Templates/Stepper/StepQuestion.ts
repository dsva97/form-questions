import { IQuestion } from '../../Questions'
import { PREFIX__ID__QUESTION } from './StepForm'
import { EVENTNAME_SELECT, EVENTNAME_UNSELECT, StepOption } from './StepOption'

export class StepQuestion extends HTMLElement {
  static get observedAttributes() { return [
    'question',
    'numbered',
    'random',
    'value',
    'options',

    'required', // Para evaluar si es requerido
    'selected', // Para evaluar si ya fue seleccionado
  ] }

  data: IQuestion

  $root: ShadowRoot
  $nodeSelected: StepOption
  $options: StepOption[]

  execWhenIsSelected: Function = function () {}

  select($opt) {
    console.log($opt)

    this.$nodeSelected = $opt
    this.data.optionSelected = $opt.data
    this.execWhenIsSelected(this)
  }

  public selectionExecuted (callback: Function) {
    callback(this)
  }

  get value() {
    return this.$nodeSelected.getAttribute('value')
  }

  constructor() {
    super()
    this.$root = this.attachShadow({ mode: 'closed' })
    this.$root.innerHTML = /*html*/`
    <style>
      * {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      #container {
        display: grid;
        grid-gap: 1em;
      }
      #options {
        display: flex;
        flex-direction: column;
      }
      @media (min-width: 640px) {
        #options {
        flex-direction: row;
        }
      }
    </style>
    <div id="container">
      <div id="question"></div>
      <div id="options"></div>
    </div>
    `
  }
  attributeChangedCallback(name: string, oldValue, newValue) {
    if(newValue !== oldValue) {
      switch(name) {
        case '':
          break
      }
    }
  }
  connectedCallback() {
    if(this.isConnected) {
      this.render()
    }
  }
  private render() {
    if(this.data.numbered) {
      this.$question.textContent = this.data.number + ') ' + this.data.question
    } else {
      this.$question.textContent = this.data.question
    }
    this.id = PREFIX__ID__QUESTION + this.data.number
    this.data.options.map(_opt => {
      const _$opt = document.createElement('step-option') as StepOption
      _$opt.setAttribute('text', _opt.text)
      _$opt.data = _opt
      _$opt.$question = this
      this.$optionsContainer.appendChild(_$opt)
    })

    const me = this
    window.addEventListener(EVENTNAME_SELECT, (function(e: CustomEvent) {
      const $option = e.detail.$option
      if($option.$question === me) {
        me.data.optionSelected = $option.data
      }
      const height = Number(window.getComputedStyle(me).height.split('px')[0])
      const marginTop = Number(window.getComputedStyle(me).marginTop.split('px')[0])
      const scrollY = height + marginTop
      window.scrollBy({ 
        top: scrollY,
        behavior: 'smooth' 
      });
    }) as EventListener)
    window.addEventListener(EVENTNAME_UNSELECT, (function(e: CustomEvent) {
      const $option = e.detail.$option
      if($option.$question === me) {
        me.data.optionSelected = undefined
      }
    }) as EventListener)
  }
  get $question() {
    return this.$root.getElementById('question')
  }
  get $optionsContainer() {
    return this.$root.getElementById('options')
  }
}

window.customElements.define('step-question', StepQuestion)