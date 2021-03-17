import { IQuestion } from '../../Questions';
import { EVENTNAME_SELECT, EVENTNAME_UNSELECT } from './StepOption';
import { StepQuestion } from './StepQuestion'

export const PREFIX__ID__QUESTION = 'step_question_'

export class StepForm extends HTMLElement {
  static get observedAttributes() { return ['show-footer', 'show-button'] }
  
  callbackResult(arg: any): any {}
  
  getResult() {
    return this.callbackResult(this.questions)
  }

  $root: ShadowRoot;

  $questions: StepQuestion[]

  questions: IQuestion[]
  title: string

  constructor() {
    super()
    this.$root = this.attachShadow({ mode: 'open' })
    this.$root.innerHTML = /* html */`
      <style>
        * {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        html, :host, :host() {
          scroll-behavior: smooth;
        }
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 2em;
          overflow: hidden;
        }
        #container {
          --space: 2em;
          display: inline-grid;
          grid-template-columns: 1fr;
          grid-gap: var(--space);
          padding: var(--space) 0;
          border-radius: .25em;
        }
        #title {
          text-align: center;
          font-size: 24px;
        }
        #button {
          padding: .5em 2.25em;
          background: rgb(0, 191, 111);
          color: white;
          border: none;
          cursor: pointer;
          border-radius: .25em;
        }
        :host(:not([show-button])) #button {
          display: none;
        }
        :host(:not([show-button])) #footer {
          display: none;
        }
      </style>
      <h1 id="title"></h1>
      <div id="container">
      </div>
      <button id="button">
        LISTO!
      </button>
      <step-footer id="footer" all="" quantity=""></step-footer>
    `
  }
  
  calcQuantity() {
    const me = this
    me.$footer.setAttribute('quantity', ''+me.questions.filter(e=>e.optionSelected).length)
  }

  connectedCallback() {
    if(this.isConnected) {
      this.$questions = this.questions.map(question => {
        const $question = document.createElement('step-question') as StepQuestion
        $question.data = question
        
        this.$container.appendChild($question)
        return $question
      })
      this.$title.textContent = this.title
      this.$footer.setAttribute('all', ''+this.$questions.length)
      const me = this
      window.addEventListener(EVENTNAME_SELECT, function() {
        me.calcQuantity()
      })
      window.addEventListener(EVENTNAME_UNSELECT, function() {
        me.calcQuantity()
      })
      me.calcQuantity()
      this.$button.addEventListener('click', () => {
        me.callbackResult(me.questions)
      })
    }
  }

  attributeChangedCallback(name: string, oldValue, newValue) {
    if(newValue !== oldValue) {
      switch(name) {
        case 'show-footer':
          break
        case 'show-button':
          break
      }
    }
  }
  get $title() { return this.$root.getElementById('title') }
  get $button() { return this.$root.getElementById('button') }
  get $footer() { return this.$root.getElementById('footer') }
  get $container() { return this.$root.getElementById('container') }
}

window.customElements.define('step-form', StepForm)