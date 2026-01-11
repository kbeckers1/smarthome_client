import {html, css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { consume } from '@lit/context';
import { GraphData, GraphTypes, GraphWrapper } from '../../../services/GraphController';
import { apiContext, APIService } from '../../../services/APIService';
import { StoreConsumer } from '../../../services/GlobalState';

// Graph wrappers will be assembled dynamically in the component render

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
            grid-template-columns: 2fr 2fr 2fr;
            grid-auto-rows: 10%;
            height: 100%;
            width: 100%;
            gap: 15px;
        }
        .box_1 {
            grid-column-start: 1;
            grid-column-end: 1;
            grid-row-start: 6;
            grid-row-end: 9;
        }
        .box_2 {
            grid-column-start: 2;
            grid-column-end: 2;
            grid-row-start: 6;
            grid-row-end: 9;
        }
        .box_3 {
            grid-column-start: 3;
            grid-column-end: 3;
            grid-row-start: 6;
            grid-row-end: 9;
        }
        .graph_box {
            grid-column-start: 1;
            grid-column-end: 4;
            grid-row-start: 1;
            grid-row-end: 6;
        }
    </style>    
`

// WebComponent
@customElement('ly-sensors')
export class SensorLayout extends LitElement {
    @consume({context: apiContext})
    public APIService!: APIService;

    public ServoConsumer?: StoreConsumer<any>;
    public MotionConsumer?: StoreConsumer<any>;
    public TempConsumer?: StoreConsumer<any>;

    constructor() {
        super();
    }

    firstUpdated(): void {
        if (this.APIService && !this.ServoConsumer) {
            this.ServoConsumer = new StoreConsumer(this, this.APIService.servo);
            this.MotionConsumer = new StoreConsumer(this, this.APIService.motion);
            this.TempConsumer = new StoreConsumer(this, this.APIService.temperature);
        }
    }

    updated(): void {
        if (this.APIService && !this.ServoConsumer) {
            this.ServoConsumer = new StoreConsumer(this, this.APIService.servo);
            this.MotionConsumer = new StoreConsumer(this, this.APIService.motion);
            this.TempConsumer = new StoreConsumer(this, this.APIService.temperature);
        }
    }

    // normalize store value (Map<Date,number> or number[])
    private toArray(v: any): number[] {
        if (!v) return [];
        if (v instanceof Map) return Array.from(v.values()) as number[];
        if (Array.isArray(v)) return v as number[];
        // if object-ish, try Object.values
        if (typeof v === 'object') return Object.values(v).map((x: any) => Number(x));
        return [];
    }

    render() {
        const servoVals = this.toArray(this.APIService?.servo?.value);
        const motionVals = this.toArray(this.APIService?.motion?.value);
        const tempVals = this.toArray(this.APIService?.temperature?.value);
        
        const maxLen = Math.max(servoVals.length, motionVals.length, tempVals.length, 1);

        const buildColumns = (vals: number[], color: string) => {
            const graph: GraphWrapper<GraphTypes.ColumnGraph> = {
                type: GraphTypes.ColumnGraph,
                color,
                graph: vals.map((v, i) => ({ x: i + 0.5, y: Number(v) || 0, width: 0.8 }))
            } as unknown as GraphWrapper<GraphTypes.ColumnGraph>;
            return graph;
        }

        const allValues = [...servoVals, ...motionVals, ...tempVals].map(v => Number(v) || 0);
        const minVal = allValues.length ? Math.min(...allValues) : 0;
        const maxVal = allValues.length ? Math.max(...allValues) : 10;
        const padding = Math.max(1, Math.ceil((maxVal - minVal) * 0.1));

        const graphData: GraphData = {
            x_range: { start: 0, end: maxLen, step: 1 },
            y_range: { start: Math.floor(minVal - padding), end: Math.ceil(maxVal + padding), step: 0.1 },
            x_label: 'Moment',
            y_label: 'Sensorwaarden',
            graphs: new Map<number, GraphWrapper<GraphTypes>>([
                [0, buildColumns(servoVals, '#3f9062')],
                [1, buildColumns(tempVals, '#005ec3')],
                [2, buildColumns(motionVals, '#e1b400')],
            ])
        };

        const latest = (vals: number[]) => vals.length ? vals[vals.length - 1] : null;
        const fmt = (v: number | null, decimals = 1) => v == null ? '—' : (Number(v).toFixed(decimals));

        return html`
            ${base_style}
            <div class="inner">
                <md-title>
                    Sensoren
                </md-title>
                <div class="grid">
                    <gl-surface width="auto" height="auto" class="box_1">
                            <gl-data-tile width="100%" height="auto" color="#3f9062">
                                <md-richtext>Servo</md-richtext>
                                <md-title>${fmt(latest(servoVals), 0)}%</md-title>
                                <md-richtext style="color: #3f9062!important; text-size: 10px;">huidig</md-richtext>
                            </gl-data-tile>
                    </gl-surface>
                    <gl-surface width="auto" height="auto" class="box_2">
                        <gl-data-tile width="100%" height="auto" color="#005ec3">
                            <md-richtext>Temperatuur</md-richtext>
                            <md-title>${fmt(latest(tempVals), 1)} °C</md-title>
                            <md-richtext style="color: #005ec3!important; text-size: 10px;">huidig</md-richtext>
                        </gl-data-tile>
                    </gl-surface>
                    <gl-surface width="auto" height="auto" class="box_3">
                        <gl-data-tile width="100%" height="auto" color="#e1b400">
                            <md-richtext>Motion</md-richtext>
                            <md-title>${latest(motionVals) == null ? '—' : String(latest(motionVals))}</md-title>
                            <md-richtext style="color: #e1b400!important; text-size: 10px;">huidig</md-richtext>
                        </gl-data-tile>
                    </gl-surface>
                    <gl-surface width="auto" height="auto" class="graph_box">
                        <adv-graph .graph=${graphData}>
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