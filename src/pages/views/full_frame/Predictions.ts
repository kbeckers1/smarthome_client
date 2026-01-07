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
            grid-template-columns: 2fr 2fr 2fr 2fr;
            grid-auto-rows: 10%;
            height: 100%;
            width: 100%;
            gap: 15px;
        }
        .graph_box {
            grid-column-start: 1;
            grid-column-end: 4;
            grid-row-start: 1;
            grid-row-end: 7;
        }
        .detail_box {
            grid-column-start: 4;
            grid-column-end: 4;
            grid-row-start: 1;
            grid-row-end: 9;
            display: flex;
            flex-direction: column;
        }
        .controller_box {
            grid-column-start: 1;
            grid-column-end: 4;
            grid-row-start: 7;
            grid-row-end: 8;
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
                <div class="grid">
                    <gl-surface class="graph_box" width="auto" height="auto">
                        <adv-graph>

                        </adv-graph>
                    </gl-surface>
                    <gl-surface style="gap: 15px;" class="detail_box" width="auto" height="auto">
                        <gl-data-tile color="#e1b400" style="flex: 1 1 auto;" width="auto">
                            <md-richtext>Buitentemperatuur</md-richtext>
                            <md-title>17 °C</md-title>
                            <md-richtext style="color: #e1b400!important; text-size: 10px;">huidig</md-richtext>
                        </gl-data-tile>
                        <gl-data-tile color="#005ec3" style="flex: 1 1 auto;" width="auto">
                            <md-richtext>Luchtvochtigheid</md-richtext>
                            <md-title>67%</md-title>
                            <md-richtext style="color: #005ec3!important; text-size: 10px;" width="auto">huidig</md-richtext>
                        </gl-data-tile>
                        <gl-data-tile color="#3f9062" style="flex: 1 1 auto;" width="auto">
                            <md-richtext>Netwerk</md-richtext>
                            <md-title>Online</md-title>
                        </gl-data-tile>
                        <gl-data-tile color="#c30000" style="flex: 1 1 auto;" width="auto">
                            <md-richtext>Energieverbruik</md-richtext>
                            <md-title>2.5 kW</md-title>
                            <md-richtext style="color: #c30000!important; text-size: 10px;">/ uur</md-richtext>
                        </gl-data-tile>
                    </gl-surface>
                    <gl-surface width="auto" height="auto" class="controller_box">

                    </gl-surface>
                </div>
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