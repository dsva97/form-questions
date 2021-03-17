import { StepForm } from "./StepForm";

export class StepFooter extends HTMLElement  {
  static get observedAttributes() { return ['all','quantity'] }
  $root: ShadowRoot;
  $form: StepForm;
  
  constructor() {
    super()
    this.$root = this.attachShadow({ mode: 'closed' })
    this.$root.innerHTML = /* html */`
      <style>
        :host {
          --size: 36px;
          margin-top: var(--size);
          width: 100%;
          height: var(--size);
        }
        footer {
          position: fixed;
          width: 100%;
          height: var(--size);
          bottom: 0;
          left: 0;

          --color: rgb(0, 191, 111);
          background: var(--color);
          color: white;
          
          display: flex;
          justify-content: center;
          align-items: center;
        }
      </style>
      <footer>
        <span>
          <i id="quantity"></i> de <i id="all"></i> respondidas
        </span>
      </footer>
    `
  }

  attributeChangedCallback(name: string, oldValue, newValue) {
    if(newValue !== oldValue) {
      switch(name) {
        case 'all':
          this.$all.textContent = newValue
          break
        case 'quantity':
          this.$quantity.textContent = newValue
          break
      }
    }
  }
  get $quantity() { return this.$root.getElementById('quantity') }
  get $all() { return this.$root.getElementById('all') }
}

window.customElements.define('step-footer', StepFooter)