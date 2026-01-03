import {html, css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';

const base_style = html`
    <style>
        :root { 
            --border-width: 5px;
        }
        .inner {
            display: inline-flex;
            border-radius: 100px;
            width: calc(100% - (5px / 2));
            justify-content: center;
            align-items: center;
            cursor: inherit;
            color: black;
            vertical-align: middle;
            margin: 0px;
            height: 13px;
            box-sizing: border-box;
            transition: 0.3s;
        }
        slot {
            padding: 0;
            font-size: 15px!important;
            font-family: "Funnel Display", Helvetica;
            line-height: 20px;
            white-space: normal;
            margin-block-start: 0!important;
            margin-block-end: 0!important;
            margin-block: 0!important;
        }
    </style>    
`

// WebComponent
@customElement('md-richtext')
export class RichText extends LitElement {
    @property() text: string;

    constructor() {
        super();
        this.text = 'Continue';
    }

    render() {
        return html`
            ${base_style}
            <slot></slot>
        `;
    }
}

// Webcomponent Factory


// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "md-richtext": RichText;
    }
}
