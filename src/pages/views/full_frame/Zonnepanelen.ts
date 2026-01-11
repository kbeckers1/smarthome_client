import { html, css, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { GraphData, GraphTypes, GraphWrapper, Point } from '../../../services/GraphController';
import { StoreConsumer } from '../../../services/GlobalState';
import { apiContext, APIService } from '../../../services/APIService';
import { authContext, AuthService } from '../../../services/AuthService';
import { notificationContext, NotificationController } from '../../../services/NotificationController';
import { popupContext, PopupController } from '../../../services/PopupController';
import { consume } from '@lit/context';

// our graph
const graph1: GraphWrapper<GraphTypes.ColumnGraph> = {
    type: GraphTypes.ColumnGraph,
    color: "#e1b400",
    graph: [
        { x: 0.5, y: 1, width: 0.8 },
        { x: 1.5, y: 1.2, width: 0.8 },
        { x: 2.5, y: 1.2, width: 0.8 },
        { x: 3.5, y: 1.3, width: 0.8 },
        { x: 4.5, y: 1.4, width: 0.8 },
        { x: 5.5, y: 1.4, width: 0.8 },
        { x: 6.5, y: 1.4, width: 0.8 },
        { x: 7.5, y: 1.5, width: 0.8 },
        { x: 8.5, y: 1.5, width: 0.8 },
        { x: 9.5, y: 1.5, width: 0.8 },
        { x: 10.5, y: 1.5, width: 0.8 },
        { x: 11.5, y: 1.4, width: 0.8 },
        { x: 12.5, y: 1.4, width: 0.8 },
        { x: 13.5, y: 1.3, width: 0.8 },
        { x: 14.5, y: 1.4, width: 0.8 },
        { x: 15.5, y: 1.5, width: 0.8 },
        { x: 16.5, y: 1.7, width: 0.8 },
        { x: 17.5, y: 1.8, width: 0.8 },
        { x: 18.5, y: 1.9, width: 0.8 },
        { x: 19.5, y: 2.0, width: 0.8 },
        { x: 20.5, y: 1.7, width: 0.8 },
        { x: 21.5, y: 1.5, width: 0.8 },
        { x: 22.5, y: 1.3, width: 0.8 },
        { x: 23.5, y: 1.2, width: 0.8 }
    ]
}
const graph2: GraphWrapper<GraphTypes.ColumnGraph> = {
    type: GraphTypes.ColumnGraph,
    color: "#005ec3",
    graph: [
        { x: 0.5, y: 0.2, width: 0.8 },
        { x: 1.5, y: 0.2, width: 0.8 },
        { x: 2.5, y: 0.2, width: 0.8 },
        { x: 3.5, y: 0.3, width: 0.8 },
        { x: 4.5, y: 0.4, width: 0.8 },
        { x: 5.5, y: 0.4, width: 0.8 },
        { x: 6.5, y: 0.4, width: 0.8 },
        { x: 7.5, y: 0.5, width: 0.8 },
        { x: 8.5, y: 0.6, width: 0.8 },
        { x: 9.5, y: 0.7, width: 0.8 },
        { x: 10.5, y: 0.8, width: 0.8 },
        { x: 11.5, y: 0.9, width: 0.8 },
        { x: 12.5, y: 1.3, width: 0.8 },
        { x: 13.5, y: 1.4, width: 0.8 },
        { x: 14.5, y: 1.5, width: 0.8 },
        { x: 15.5, y: 1.3, width: 0.8 },
        { x: 16.5, y: 1.1, width: 0.8 },
        { x: 17.5, y: 1.0, width: 0.8 },
        { x: 18.5, y: 0.9, width: 0.8 },
        { x: 19.5, y: 0.8, width: 0.8 },
        { x: 20.5, y: 0.7, width: 0.8 },
        { x: 21.5, y: 0.5, width: 0.8 },
        { x: 22.5, y: 0.3, width: 0.8 },
        { x: 23.5, y: 0.2, width: 0.8 }
    ]
}
const kwhGraph: GraphData = {
    x_range: {
        start: 0,
        end: 24,
        step: 0.25,
    },
    y_range: {
        start: 0,
        end: 5,
        step: 1
    },
    x_label: 'Tijd in uren (vandaag)',
    y_label: 'Energieverbruik & opwekking in kWh',
    graphs: new Map<number, GraphWrapper<GraphTypes>>([
        [0, graph1],
        [1, graph2]
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
        .content {
            flex: 1 1 auto; /* take remaining space */
            overflow: auto; /* scroll if needed */
        }
        .container > * + * {
            border-top: solid 1px #a2a2a2;
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
`;

@customElement('ly-solar')
export class Zonnepanelen extends LitElement {
    @property({type: Object, attribute:false}) graph!: GraphData;
    @consume({context: popupContext})
    public PopupController!: PopupController;

    @consume({context: notificationContext})
    public NotificationController!: NotificationController;

    @consume({context: authContext})
    public AuthService!: AuthService;

    @consume({context: apiContext})
    public APIService!: APIService;

    public DeviceConsumer?: StoreConsumer;
    // optional unsubscribe/cleanup handle if StboreConsumer provides one
    @property({attribute: false }) disabledTableButtons: Set<number> = new Set([]);
    

    constructor() {
        super();

    }

    render() {
        return html`
            ${base_style}
            <div class="inner">
                <md-title>
                    Zonnepanelen
                </md-title>
                <div class="grid">
                    <gl-surface style="gap: 15px; overflow: hidden;" class="detail_box" width="auto" height="auto">
                        <gl-data-tile height="200px" color="#005ec3" style="flex: 1 1 auto;">
                            <md-richtext>Energieopwek</md-richtext>
                            <md-title>15.2 kW</md-title>
                            <md-richtext style="color: #005ec3!important; text-size: 10px;">huidig</md-richtext>
                        </gl-data-tile>
                        <gl-data-tile height="200px" color="#3f9062" style="flex: 1 1 auto;">
                            <md-richtext>Energieverbruik vandaag</md-richtext>
                            <md-title>${
                                Object.entries(graph2.graph).reduce((acc, node) => acc + node[1].y, 0)
                            }</md-title>
                            <md-richtext style="color: #3f9062!important; text-size: 10px;">kWh</md-richtext>
                        </gl-data-tile>
                        <gl-data-tile height="200px" color="#c30000" style="flex: 1 1 auto;">
                            <md-richtext>Energieverbruik</md-richtext>
                            <md-title>${
                                Object.entries(this.APIService.devices.value).reduce((acc, device) => acc + Number(device[1].huidig_verbruik), 0).toFixed(2)
                            }</md-title>
                            <md-richtext style="color: #c30000!important; text-size: 10px;">watt</md-richtext>
                        </gl-data-tile>
                    </gl-surface>
                    <gl-surface class="graph_box" width="auto" height="auto">
                        <adv-graph .graph=${kwhGraph}>
                        </adv-graph>
                    </gl-surface>
                </div>
                <br/>
            </div>
    `}
}

declare global { interface HTMLElementTagNameMap { 'ly-solar': Zonnepanelen } }
