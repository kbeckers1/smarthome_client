import {html, css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';

const base_style = html`
    <style>
        :root { 
            --border-width: 5px;
        }
        .inner {
            padding: 10px;
            padding-top: 0px;
            height: 100%;
            width: calc(100% - 15px);
            overflow: auto;
            display: flex;
            flex-direction: column;
            gap: 10px; /* Space between all children */
        }
        .grid {
            display: grid;
            grid-template-columns: 2fr 2fr;
            grid-auto-rows: 10%;
            height: 100%;
            width: 100%;
            gap: 15px;
        }
        .graph_box {
            grid-column-start: 2;
            grid-column-end: 2;
            grid-row-start: 4;
            grid-row-end: 9;
            flex-direction: column;
        }
        .detail_box {
            grid-column-start: 1;
            grid-column-end: 3;
            grid-row-start: 1;
            grid-row-end: 4;
        }
    </style>    
`

// WebComponent
@customElement('ly-sensors')
export class SensorLayout extends LitElement {
    constructor() {
        super();
    }

    render() {
        return html`
            ${base_style}
            <div class="inner">
                <md-title>
                    Sensoren
                </md-title>
                <div class="grid">
                    
                </div>
            </div>
        `;
    }
}

// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "ly-sensors": SensorLayout;
    }
}