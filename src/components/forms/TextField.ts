import {html, css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';

const base_style = html`
    <style>
        :root { 

        }
        :host {
        }
        input {
            border-radius: 15px;
            height: 30px;
            width: 100%;
            border: solid 1px #000;
            padding: 5px;
            padding-left: 15px;
            font-family:"Funnel Display", Helvetica;
        }
    </style>    
`

// WebComponent
@customElement('md-textfield')
export class TextField extends LitElement {
    @property() text: string;
    @property({type: Boolean}) password: boolean;
    @property({attribute: false}) callback: Function;

    constructor() {
        super();
        this.text = 'Continue';
        this.password = false;
        this.callback = () => {};
    }

    render() {
        const type = this.password === true ? "password" : "text"
        return html`
            ${base_style}
            <input type="${type}" @input=${(e: Event) => this.callback(e)}></input>
            <slot></slot>
        `;
    }
}

// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "md-textfield": TextField;
    }
}
