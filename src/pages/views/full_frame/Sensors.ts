import {html, css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { GraphData, GraphTypes, GraphWrapper } from '../../../services/GraphController';

const motion_graph: GraphWrapper<GraphTypes.ColumnGraph> = {
    type: GraphTypes.ColumnGraph,
    color: "#e1b400",
    graph: []
}
const temp_graph: GraphWrapper<GraphTypes.ColumnGraph> = {
    type: GraphTypes.ColumnGraph,
    color: "#e1b400",
    graph: []
}
const servo_graph: GraphWrapper<GraphTypes.ColumnGraph> = {
    type: GraphTypes.ColumnGraph,
    color: "#e1b400",
    graph: []
}
const kwh_graph: GraphData = {
    x_range: {
        start: 0,
        end: 24,
        step: 0.25,
    },
    y_range: {
        start: 0,
        end: 30,
        step: 1
    },
    x_label: 'Tijd in uren (vandaag)',
    y_label: 'Sensorwaarden',
    graphs: new Map<number, GraphWrapper<GraphTypes>>([
        [0, servo_graph],
        [1, motion_graph],
        [2, temp_graph]
    ])
}

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
            grid-column-start: 1;
            grid-column-end: 3;
            grid-row-start: 1;
            grid-row-end: 6;
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
                    <gl-surface width="auto" height="auto" class="graph_box">
                        <adv-graph .graph=${}>

                        </adv-graph>
                    </gl-surface>
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