import {html, css, LitElement, TemplateResult} from 'lit';
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
                type: "Primary",
                title: "Beheerd",
                icon: "",
                callback: () => {}
            }
        },
    ]
};

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

    constructor() {
        super();
    }

    render() {
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
                            <md-title>67%</md-title>
                            <md-richtext style="color: #005ec3!important; text-size: 10px;">huidig</md-richtext>
                        </gl-data-tile>
                        <gl-data-tile height="200px" color="#3f9062" style="flex: 1 1 auto;">
                            <md-richtext>Binnentemperatuur</md-richtext>
                            <md-title>21 °C</md-title>
                            <md-richtext style="color: #3f9062!important; text-size: 10px;">huidig</md-richtext>
                        </gl-data-tile>
                        <gl-data-tile height="200px" color="#c30000" style="flex: 1 1 auto;">
                            <md-richtext>Energieverbruik</md-richtext>
                            <md-title>2.5 kW</md-title>
                            <md-richtext style="color: #c30000!important; text-size: 10px;">/ uur</md-richtext>
                        </gl-data-tile>
                    </gl-surface>
                    <gl-surface class="table_box" width="auto" height="auto">
                        <adv-table .table=${sheet}>
                        </adv-table>
                    </gl-surface>
                    <gl-surface class="graph_box" width="auto" height="auto">
                        <adv-graph>
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