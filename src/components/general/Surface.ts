import {html, css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { Styles } from '../../components/forms/Button'

const base_style = html`
    <style>
        :root { 

        }
        :host {
            display: flex;
            border: solid 1px #a2a2a2;
            width: 500px;
            height: 300px;
            border-radius: 15px;
            background-color: #ffffff;
            padding: 15px;
        }
    </style>    
`

// WebComponent
@customElement('gl-surface')
export class Surface extends LitElement {
    @property({type: String}) width: String
    @property({type: String}) height: String
    @property() text: string;

    constructor() {
        super();
        this.text = 'Continue';
        this.width = "300px";
        this.height = "300px";
    }

    render() {
        return html`
            ${base_style}
            <style>
                :host {
                    width: ${this.width};
                    height: ${this.height};
                }
            </style>
            <p style="margin: 0px;">${this.text}</p>
        `;
    }
}

// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "gl-surface": Surface;
    }
}
