import {html, css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';

const base_style = html`
    <style>
        :root { 

        }
        :host {

        }
    </style>    
`

// WebComponent
@customElement('tag-name')
export class ComponentName extends LitElement {
    @property() text: string;

    constructor() {
        super();
        this.text = 'Continue';
    }

    render() {
        return html`
            ${base_style}
            <p>${this.text}</p>
        `;
    }
}

// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "tag-name": ComponentName;
    }
}
