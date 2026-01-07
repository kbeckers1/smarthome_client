import {html, css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { Styles } from '../../components/forms/Button'

const base_style = html`
    <style>
        :root { 

        }
        :host {
            display: flex;
            width: 500px;
            height: 300px;
            border-radius: 15px;
            padding: 15px;
            min-width: 0;
            min-height: 0;
            flex-shrink: 1;
            overflow: auto;
            color: white;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }
    </style>    
`

// WebComponent
@customElement('gl-data-tile')
export class DataTile extends LitElement {
    @property({type: String}) width: String
    @property({type: String}) height: String
    @property({type: String}) color: String
    @property({type: String}) border_color: String

    constructor() {
        super();
        this.width = "fit-content";
        this.height = "auto";
        this.color = "#ffffff";
        this.border_color = "#ffffff";
    }

    render() {
        return html`
            ${base_style}
            <style>
                :host {
                    width: ${this.width};
                    height: ${this.height};
                    color: ${this.color};
                    border: solid 2px ${this.color};
                }
            </style>
            <slot></slot>
        `;
    }
}

// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "gl-data-tile": DataTile;
    }
}
