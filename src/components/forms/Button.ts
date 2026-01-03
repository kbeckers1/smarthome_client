import {html, css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';

// Styles
const base_style = html`
    <style>
        :root { 
            --border-width: 5px;
        }
        :host {
            display: inline-flex;
            height: 40px;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            margin-right: 5px;
        }
        .inner {
            display: inline-flex;
            font-family: "Funnel Display", Helvetica;
            font-size: 14px;
            border-radius: 15px;
            width: calc(100% - (5px / 2));
            justify-content: center;
            align-items: center;
            cursor: inherit;
            vertical-align: middle;
            margin: 0px !important;
            height: calc(100% - (5px / 2));
            box-sizing: border-box;
            transition: 0.3s;
            padding-left: 25px;
            padding-right: 25px;
            min-width: 90px;
            white-space: nowrap;
        }
        p {
            margin: 30px;
            padding: 0;
            text-align: center;
        }
    </style>
`;

const red = html`
    <style>
        .inner {
            border: solid 1px #c30000;
            background: #c30000;
            color: white;
        }
        .inner:hover {
            border: solid 1px #a70000;
            background-color: #a70000;
        }
    </style>
`;

const yellow = html`
    <style>
        .inner {
            border: solid 1px #e1b400;
            background: #e1b400;
            color: white;
        }
        .inner:hover {
            border: solid 1px #c49c00;
            background-color: #c49c00;
        }
    </style>
`;

const secondary = html`
    <style>
        .inner {
            background-color: #f9fff9;
            color: black;
            border: solid 1px #a2a2a2;
        }
        .inner:hover {
            background-color: #def4e4;
            border: solid 1px #8d8d8d;
        }
    </style>
`;

const primary = html`
    <style>
        .inner {
            border: solid 1px #008905;
            background: #008905;
            color: white;
        }
        .inner:hover {
            border: solid 1px #007604;
            background-color: #007604;
        }
    </style>
`;

// Style Definitions
export const Styles: Record<string, TemplateResult> = {
    "Red": red,
    "Primary": primary,
    "Secondary": secondary,
    "Yellow": yellow
}


// WebComponent
@customElement('md-button')
export class Button extends LitElement {

    // Use an accessor-backed property to avoid class-field shadowing.
    @property({type: Object}) type: TemplateResult;
    @property({type: String}) icon: string;
    @property({attribute: false}) callback: Function;

    constructor() {
        super();
        this.type = red;
        this.icon = "";
        this.callback = () => {};
    }

    _handleClick(e: any) {
        this.callback()
    }

    render() {
        let icon: any
        if (this.icon !== "") {
            icon = html`<img src=${this.icon} style="margin-right: 5px; color: white;" height="17px;" />`
        }

        return html`
            ${base_style}
            ${this.type}
            <button class="inner" @click=${(e: Event) => this._handleClick(e)}>
                ${icon}
                <slot></slot>
            </button>
        `;
    }
}

// Webcomponent Factory


// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "md-button": Button;
    }
}
