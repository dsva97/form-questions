import { IOption } from '../../Questions'
import { StepQuestion } from './StepQuestion'

export const EVENTNAME_SELECT = 'step-option:select'
export const EVENTNAME_UNSELECT = 'step-option:unselect'

export class StepOption extends HTMLElement implements IOption {
  static get observedAttributes() { return ['text', 'selected'] }
  $question: StepQuestion
  select() {
    this.data.selected = true
    this.setAttribute('selected', 'true')
    
    const event = new CustomEvent(EVENTNAME_SELECT, {
      detail: {
        $option: this
      }
    })
    window.dispatchEvent(event)
  }
  unselect() {
    this.data.selected = false
    this.removeAttribute('selected')
    
    const event = new CustomEvent(EVENTNAME_UNSELECT, {
      detail: {
        $option: this
      }
    })
    window.dispatchEvent(event)
  }

  value: any = '';
  text: string = '';
  selected: boolean = false;

  data: IOption;
  
  $root: ShadowRoot;

  constructor() {
    super()
    this.$root = this.attachShadow({ mode: 'closed' })
    this.$root.innerHTML = /* html */`
      <style>
        * {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        :host {
          --size: 20px;
          --space: .5em;
          --color: rgb(51, 51, 51);
          cursor: pointer;
        }
        #container {
          display: inline-grid;
          grid-template-columns: auto 1fr;
          grid-gap: var(--space);
          padding: var(--space);
          border-radius: .25em;
        }
        #circle {
          width: var(--size);
          height: var(--size);
          border-radius: 50%;
          display: inline-block;
          position: relative;
          background: var(--color);
          border: 1px solid var(--color);
        }
        #check {
          border: 2px solid #fff;
          border-top: none;
          border-left: none;
          width: 5px;
          height: 10px;
          position: absolute;
          top: 3px;
          left: 7px;
          transform: rotate(45deg);
          opacity: 1;
        }
        #text {
          margin-left: .2em;
        }
        :host([selected]) #container {
          background: rgb(153, 153, 153);
        }
        :host(:not([selected])) #circle {
          background: white;
        }
        :host(:not([selected])) #container:hover {
          background: rgb(229, 229, 229);
        }
      </style>
      <div id="container">
        <div id="circle">
          <i id="check"></i>
        </div>
        <span id="text"></span>
      </div>
    `
  }
  
  connectedCallback() {
    if(this.isConnected) {

      this.$root.addEventListener('click', (e) => {
        e.stopPropagation()
        if(this.getAttribute('selected')) {
          this.unselect()
        } else {
          this.select()
        }
      })
      const me = this
      window.addEventListener(EVENTNAME_SELECT, (function (e: CustomEvent){
        if(e.detail.$option !== me && e.detail.$option.$question === me.$question) {
          me.unselect()
        }
      }) as EventListener)
    }
  }

  attributeChangedCallback(name: string, oldValue, newValue) {
    if(newValue !== oldValue) {
      switch(name) {
        case 'text':
          this.$text.innerText = newValue
          break
        case 'selected':
          break
      }
    }
  }
  get $text () {
    return this.$root.getElementById('text')
  }
  get $circle () {
    return this.$root.getElementById('circle')
  }
}

window.customElements.define('step-option', StepOption)