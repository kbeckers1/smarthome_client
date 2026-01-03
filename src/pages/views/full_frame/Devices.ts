import {html, css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';

const base_style = html`
    <style>
        :root { 
            --border-width: 5px;
        }
        .inner {
            display: flex;
            padding: 10px;
            padding-top: 0px;
            height: 100%;
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
            overflow: auto;
        }
    </style>    
`

// WebComponent
@customElement('ly-devices')
export class DeviceLayout extends LitElement {
    constructor() {
        super();
    }

    render() {
        return html`
            ${base_style}
            <div class="inner">
                <md-title>
                    Apparaten
                </md-title>
            </div>
        `;
    }
}

// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "ly-devices": DeviceLayout;
    }
}