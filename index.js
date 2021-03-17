(() => {
  // src/Templates/Stepper/StepOption.ts
  var EVENTNAME_SELECT = "step-option:select";
  var EVENTNAME_UNSELECT = "step-option:unselect";
  var StepOption = class extends HTMLElement {
    constructor() {
      super();
      this.value = "";
      this.text = "";
      this.selected = false;
      this.$root = this.attachShadow({mode: "closed"});
      this.$root.innerHTML = `
      <style>
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
    `;
    }
    static get observedAttributes() {
      return ["text", "selected"];
    }
    select() {
      this.data.selected = true;
      this.setAttribute("selected", "true");
      const event = new CustomEvent(EVENTNAME_SELECT, {
        detail: {
          $option: this
        }
      });
      window.dispatchEvent(event);
    }
    unselect() {
      this.data.selected = false;
      this.removeAttribute("selected");
      const event = new CustomEvent(EVENTNAME_UNSELECT, {
        detail: {
          $option: this
        }
      });
      window.dispatchEvent(event);
    }
    connectedCallback() {
      if (this.isConnected) {
        this.$root.addEventListener("click", (e) => {
          e.stopPropagation();
          if (this.getAttribute("selected")) {
            this.unselect();
          } else {
            this.select();
          }
        });
        const me = this;
        window.addEventListener(EVENTNAME_SELECT, function(e) {
          if (e.detail.$option !== me && e.detail.$option.$question === me.$question) {
            me.unselect();
          }
        });
      }
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (newValue !== oldValue) {
        switch (name) {
          case "text":
            this.$text.innerText = newValue;
            break;
          case "selected":
            break;
        }
      }
    }
    get $text() {
      return this.$root.getElementById("text");
    }
    get $circle() {
      return this.$root.getElementById("circle");
    }
  };
  window.customElements.define("step-option", StepOption);

  // src/Templates/Stepper/StepForm.ts
  var PREFIX__ID__QUESTION = "step_question_";
  var StepForm = class extends HTMLElement {
    static get observedAttributes() {
      return ["text", "selected"];
    }
    callbackResult(arg) {
    }
    constructor() {
      super();
      this.$root = this.attachShadow({mode: "open"});
      this.$root.innerHTML = `
      <style>
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
      </style>
      <h1 id="title">Formulario (ac\xE1 ir\xE1 el t\xEDtulo)</h1>
      <div id="container">
      </div>
      <button id="button">
        LISTO!
      </button>
      <step-footer id="footer" all="" quantity=""></step-footer>
    `;
    }
    calcQuantity() {
      const me = this;
      me.$footer.setAttribute("quantity", "" + me.questions.filter((e) => e.optionSelected).length);
    }
    connectedCallback() {
      if (this.isConnected) {
        this.$questions = this.questions.map((question) => {
          const $question = document.createElement("step-question");
          $question.data = question;
          this.$container.appendChild($question);
          return $question;
        });
        this.$title.textContent = this.title;
        this.$footer.setAttribute("all", "" + this.$questions.length);
        const me = this;
        window.addEventListener(EVENTNAME_SELECT, function() {
          me.calcQuantity();
        });
        window.addEventListener(EVENTNAME_UNSELECT, function() {
          me.calcQuantity();
        });
        me.calcQuantity();
        this.$button.addEventListener("click", () => {
          me.callbackResult(me.questions);
        });
      }
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (newValue !== oldValue) {
        switch (name) {
          case "text":
            break;
        }
      }
    }
    get $title() {
      return this.$root.getElementById("title");
    }
    get $button() {
      return this.$root.getElementById("button");
    }
    get $footer() {
      return this.$root.getElementById("footer");
    }
    get $container() {
      return this.$root.getElementById("container");
    }
  };
  window.customElements.define("step-form", StepForm);

  // src/Templates/Stepper/StepQuestion.ts
  var StepQuestion = class extends HTMLElement {
    constructor() {
      super();
      this.execWhenIsSelected = function() {
      };
      this.$root = this.attachShadow({mode: "closed"});
      this.$root.innerHTML = `
    <style>
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
    `;
    }
    static get observedAttributes() {
      return [
        "question",
        "numbered",
        "random",
        "value",
        "options",
        "required",
        "selected"
      ];
    }
    select($opt) {
      console.log($opt);
      this.$nodeSelected = $opt;
      this.data.optionSelected = $opt.data;
      this.execWhenIsSelected(this);
    }
    selectionExecuted(callback) {
      callback(this);
    }
    get value() {
      return this.$nodeSelected.getAttribute("value");
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (newValue !== oldValue) {
        switch (name) {
          case "":
            break;
        }
      }
    }
    connectedCallback() {
      if (this.isConnected) {
        this.render();
      }
    }
    render() {
      if (this.data.numbered) {
        this.$question.textContent = this.data.number + ") " + this.data.question;
      } else {
        this.$question.textContent = this.data.question;
      }
      this.id = PREFIX__ID__QUESTION + this.data.number;
      this.data.options.map((_opt) => {
        const _$opt = document.createElement("step-option");
        _$opt.setAttribute("text", _opt.text);
        _$opt.data = _opt;
        _$opt.$question = this;
        this.$optionsContainer.appendChild(_$opt);
      });
      const me = this;
      window.addEventListener(EVENTNAME_SELECT, function(e) {
        const $option = e.detail.$option;
        if ($option.$question === me) {
          me.data.optionSelected = $option.data;
        }
        const height = Number(window.getComputedStyle(me).height.split("px")[0]);
        const marginTop = Number(window.getComputedStyle(me).marginTop.split("px")[0]);
        const scrollY = height + marginTop;
        window.scrollBy({
          top: scrollY,
          behavior: "smooth"
        });
      });
      window.addEventListener(EVENTNAME_UNSELECT, function(e) {
        const $option = e.detail.$option;
        if ($option.$question === me) {
          me.data.optionSelected = void 0;
        }
      });
    }
    get $question() {
      return this.$root.getElementById("question");
    }
    get $optionsContainer() {
      return this.$root.getElementById("options");
    }
  };
  window.customElements.define("step-question", StepQuestion);

  // src/Templates/Stepper/StepFooter.ts
  var StepFooter = class extends HTMLElement {
    static get observedAttributes() {
      return ["all", "quantity"];
    }
    constructor() {
      super();
      this.$root = this.attachShadow({mode: "closed"});
      this.$root.innerHTML = `
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
    `;
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (newValue !== oldValue) {
        switch (name) {
          case "all":
            this.$all.textContent = newValue;
            break;
          case "quantity":
            this.$quantity.textContent = newValue;
            break;
        }
      }
    }
    get $quantity() {
      return this.$root.getElementById("quantity");
    }
    get $all() {
      return this.$root.getElementById("all");
    }
  };
  window.customElements.define("step-footer", StepFooter);

  // src/Questions/index.ts
  var normalizeQuestions = (questions, _defaults) => {
    const defaultOptions = _defaults.options.map((_opt, _index) => {
      if (typeof _opt === "string") {
        return {
          text: _opt,
          value: _index
        };
      } else if (typeof _opt === "object") {
        return {..._opt, value: "value" in _opt ? _opt.value : _index + 1};
      }
    });
    const defaults = {
      ..._defaults,
      options: defaultOptions,
      random: "random" in _defaults ? _defaults.random : false,
      numbered: "numbered" in _defaults ? _defaults.numbered : true,
      required: "required" in _defaults ? _defaults.required : false
    };
    return questions.map((question, index) => {
      if (typeof question === "string") {
        return {
          ...defaults,
          question,
          number: index + 1
        };
      } else {
        if (typeof question?.question === "string") {
          return {
            ...defaults,
            ...question,
            numbered: !!question.numbered,
            question: question.question,
            required: !!question.required,
            number: index + 1
          };
        } else {
          throw new Error("La pregunta del \xEDndice " + index + ": " + JSON.stringify(question, null, 3) + ". No tiene una pregunta correcta");
        }
      }
    });
  };
})();
