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
            width: 100%;
            overflow: auto;
            display: block;
        }
    </style>    
`

// WebComponent
@customElement('ly-predictions')
export class PredictionLayout extends LitElement {
    constructor() {
        super();
    }

    render() {
        return html`
            ${base_style}
            <div class="inner">
                <md-title>
                    Weersvoorspellingen
                </md-title>
                <gl-surface width="400px;" height="300px;">
                    <adv-graph>

                    </adv-graph>
                </gl-surface>
            </div>
        `;
    }
}

// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "ly-predictions": PredictionLayout;
    }
}