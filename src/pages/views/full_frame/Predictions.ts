import {html, css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { apiContext, APIService } from '../../../services/APIService';
import { GraphData, GraphTypes } from '../../../services/GraphController';
import { consume } from '@lit/context';
import { Graph } from '../../../components/advanced/Graph';

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
    @consume({context: apiContext})
    public APIService!: APIService;

    private graphData?: GraphData;

    firstUpdated(): void {
        // ensure we have the latest trendline and update graph whenever store changes
        this.APIService.predictedTrend.subscribe((arr) => {
            const values = arr ?? [];
            console.log('h', values);
            // build line dataset: x in hours, step 0.25 (15 minutes)
            const dataset = values.map((v, i) => ({ x: i * 0.25, y: v }));
            const maxY = Math.max(...values, 1);
            this.graphData = {
                graphs: new Map([[0, { type: GraphTypes.LineGraph, color: '#3f9062', graph: dataset }]]),
                x_range: { start: 0, end: 24, step: 0.25 },
                y_range: { start: 0, end: Math.ceil(maxY * 1.2), step: 0.25 },
                x_label: 'Hours',
                y_label: 'kWh'
            };
            this.requestUpdate();
        });
    }

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
                        <adv-graph .graph=${this.graphData as GraphData}></adv-graph>
                    </gl-surface>
                    <gl-surface style="gap: 15px;" class="detail_box" width="auto" height="auto">
                        <gl-data-tile color="#e1b400" style="flex: 1 1 auto;" width="auto">
                            <md-richtext>Buitentemperatuur</md-richtext>
                            <md-title>${this.APIService.outerTemp.value} °C</md-title>
                            <md-richtext style="color: #e1b400!important; text-size: 10px;">huidig</md-richtext>
                        </gl-data-tile>
                        <gl-data-tile color="#005ec3" style="flex: 1 1 auto;" width="auto">
                            <md-richtext>Luchtvochtigheid</md-richtext>
                            <md-title>${this.APIService.humidity.value}%</md-title>
                            <md-richtext style="color: #005ec3!important; text-size: 10px;" width="auto">huidig</md-richtext>
                        </gl-data-tile>
                        <gl-data-tile color="#3f9062" style="flex: 1 1 auto;" width="auto">
                            <md-richtext>Tijd</md-richtext>
                            <md-title>${new Date(Date.now()).toLocaleString("nl-NL", {
                                hour: '2-digit',
                                minute:'2-digit'
                            })}</md-title>
                        </gl-data-tile>
                        <gl-data-tile color="#c30000" style="flex: 1 1 auto;" width="auto">
                            <md-richtext>Energieverbruik</md-richtext>
                            <md-title>${
                                Object.entries(this.APIService.devices.value).reduce((acc, device) => acc + Number(device[1].huidig_verbruik), 0).toFixed(2)
                            } kWh</md-title>
                            <md-richtext style="color: #c30000!important; text-size: 10px;">/ uur</md-richtext>
                        </gl-data-tile>
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