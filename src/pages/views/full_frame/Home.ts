import {html, css, LitElement, TemplateResult, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { Title, Button, ButtonBar, Popup } from '../../../components/general/Popup';
import { Styles } from '../../../components/forms/Button';
import { LogOut } from '../../../services/micro/LogOut';
import { popupContext, PopupController } from '../../../services/PopupController';
import { consume } from '@lit/context';
import { notificationContext, NotificationController } from '../../../services/NotificationController';
import { Router, Routes } from '../../../services/RouterService';
import { authContext, AuthService } from '../../../services/AuthService';
import { RenderNames, Sheet } from '../../../components/advanced/Table';
import { StoreConsumer } from '../../../services/GlobalState';
import { apiContext, APIService, Device } from '../../../services/APIService';
import { Wrap } from '../../../directives/Wrap';
import { Sleep } from '../../../directives/Sleep';
import { ToggleDevice } from '../../../services/micro/ToggleDevice';
import { GraphData, Graphs, GraphTypes, GraphWrapper } from '../../../services/GraphController';

// our table
const sheet: Sheet<'naam' | 'kamer' | 'energieverbruik' | 'actief' | 'schakel'> = {
    headers: {
        naam: {
            label: 'Apparaat',
            renderer: RenderNames.string
        },
        kamer: {
            label: 'Kamer',
            renderer: RenderNames.string
        },
        energieverbruik: {
            label: 'Energieverbruik',
            renderer: RenderNames.number
        },
        actief: {
            label: 'Actief',
            renderer: RenderNames.boolean
        },
        schakel: {
            label: 'Schakelen',
            renderer: RenderNames.button
        }
    },
    values: [
        {
            naam: 'Servo',
            kamer: 'Woonkamer',
            energieverbruik: '0.1 W',
            actief: true,
            schakel: {
                disabled: true,
                type: "Yellow",
                title: "Beheerd",
                icon: "",
                callback: () => {}
            }
        },
    ]
};

// our graph
const graph: GraphWrapper<GraphTypes.ColumnGraph> = {
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
const kwh_graph: GraphData = {
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
    y_label: 'Energieverbruik in kWh',
    graphs: new Map<number, GraphWrapper<GraphTypes>>([
        [0, graph]
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
        .table_box {
            grid-column-start: 1;
            grid-column-end: 2;
            grid-row-start: 4;
            grid-row-end: 9;
            flex-direction: column;
        }
    </style>    
`

// WebComponent
@customElement('ly-home')
export class HomeLayout extends LitElement {
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
        this.button_callback = this.button_callback.bind(this);
    }

    firstUpdated(_changedProperties: PropertyValues): void {
        // Try to initialize if APIService already provided; otherwise `updated` will handle it.
        if (this.APIService?.devices && !this.DeviceConsumer) {
            this.DeviceConsumer = new StoreConsumer(this, this.APIService.devices);
        }
    }

    updated(_changedProperties: PropertyValues): void {
        // Context services may arrive after first update; ensure consumer is created
        if (!this.DeviceConsumer && this.APIService?.devices) {
            this.DeviceConsumer = new StoreConsumer(this, this.APIService.devices);
        }
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    async button_callback(apparaat_id: number, nu_actief: boolean) {
        await Wrap(
            this.disabledTableButtons,
            (set) => { set.add(apparaat_id); this.requestUpdate()},
            (set) => { set.delete(apparaat_id); this.requestUpdate()},
            async (id: number, now_active: boolean) => { 
                await new ToggleDevice(this.NotificationController, this.APIService).start(id, now_active); // Flow
            },
            apparaat_id, nu_actief
        )
    }

    render() {
        // we manage Device data
        const devicesState: Array<Device> = Object.values((this.APIService as APIService)?.devices.value) as unknown as Array<Device>

        // transform what we got from the database and make it digestible for our Sheet.
        const passable = devicesState.map((value) => ({
            naam: value.naam, 
            kamer: value.kamer, 
            energieverbruik: value.huidig_verbruik,
            actief: value.actief,
            schakel: {
                disabled: value.beheerd || this.disabledTableButtons.has(value.apparaat_id),
                type: "Yellow",
                title: "Schakel",
                icon: "",
                callback: (e: any) => {
                    return this.button_callback(value.apparaat_id, value.actief)
                }
            }
        }))

        // build our sheet
        const dynamicSheet = Object.assign({}, sheet, { values: Object.values(passable) });
        return html`
            ${base_style}
            <div class="inner">
                <md-title>
                    Home
                </md-title>
                <div class="grid">
                    <gl-surface style="gap: 15px; overflow: hidden;" class="detail_box" width="auto" height="auto">
                        <gl-data-tile height="200px" color="#005ec3" style="flex: 1 1 auto;">
                            <md-richtext>Luchtvochtigheid</md-richtext>
                            <md-title>${this.APIService.humidity.value}%</md-title>
                            <md-richtext style="color: #005ec3!important; text-size: 10px;">huidig</md-richtext>
                        </gl-data-tile>
                        <gl-data-tile height="200px" color="#3f9062" style="flex: 1 1 auto;">
                            <md-richtext>Binnentemperatuur</md-richtext>
                            <md-title>21 °C</md-title>
                            <md-richtext style="color: #3f9062!important; text-size: 10px;">huidig</md-richtext>
                        </gl-data-tile>
                        <gl-data-tile height="200px" color="#c30000" style="flex: 1 1 auto;">
                            <md-richtext>Energieverbruik</md-richtext>
                            <md-title>${
                                Object.entries(this.APIService.devices.value).reduce((acc, device) => acc + Number(device[1].huidig_verbruik), 0).toFixed(2)
                            }</md-title>
                            <md-richtext style="color: #c30000!important; text-size: 10px;">/ uur</md-richtext>
                        </gl-data-tile>
                    </gl-surface>
                    <gl-surface class="table_box" width="auto" height="auto">
                        <adv-table .table=${dynamicSheet}>
                        </adv-table>
                    </gl-surface>
                    <gl-surface class="graph_box" width="auto" height="auto">
                        <adv-graph .graph=${kwh_graph}>
                        </adv-graph>
                    </gl-surface>
                </div>
                <br/>
            </div>
        `;
    }
}

// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "ly-home": HomeLayout;
    }
}