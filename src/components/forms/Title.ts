import {html, css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';

const base_style = html`
    <style>
        :root { 
            --border-width: 5px;
        }
        .inner {
            display: block;
            border-radius: 100px;
            width: calc(100% - (5px / 2));
            justify-content: center;
            align-items: center;
            cursor: inherit;
            color: black;
            margin: 0px;
            height: 13px;
            box-sizing: border-box;
            transition: 0.3s;
        }
        h2 {
            margin-top: 0px;
            margin-bottom: 0px;
            padding: 0;
            font-family: "Funnel Display", sans-serif;
            font-weight: 900;
        }
    </style>    
`

// WebComponent
@customElement('md-title')
export class Title extends LitElement {
    @property({type: Boolean, reflect: true}) margined: Boolean
    @property({type: String}) size: string
    
    constructor() {
        super()
        this.margined = true;
        this.size = "24px"
    }

    render() {
        const margins = this.margined === true ? 
            html`
                <style>
                    h2 {
                        margin-top: 5px;
                        margin-bottom: 3px;
                    }
                </style>
            `: 
            html`
                <style>
                    h2 {
                        margin-top: 0px;
                        margin-bottom: 0px;
                    }
                </style>
            `

        return html`
            ${base_style}
            ${margins}
            <h2 style="font-size: ${this.size};">
                <slot></slot>
            </h2>
        `;
    }
}

// Webcomponent Factory


// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "md-title": Title;
    }
}
