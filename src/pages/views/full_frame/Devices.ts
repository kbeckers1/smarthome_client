import {html, css, LitElement, TemplateResult, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { consume } from '@lit/context';
import { apiContext, APIService, Device } from '../../../services/APIService';
import { notificationContext, NotificationController } from '../../../services/NotificationController';
import { StoreConsumer } from '../../../services/GlobalState';
import { Wrap } from '../../../directives/Wrap';
import { ToggleDevice } from '../../../services/micro/ToggleDevice';

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
            grid-auto-rows: 2fr 2fr;
            height: 100%;
            width: 100%;
            gap: 15px;
        }
        .box_1 {
            grid-column-start: 1;
            grid-column-end: 1;
            grid-row-start: 1;
            grid-row-end: 1;
        }
        .box_2 {
            grid-column-start: 2;
            grid-column-end: 2;
            grid-row-start: 1;
            grid-row-end: 1;
        }
        .box_3 {
            grid-column-start: 3;
            grid-column-end: 3;
            grid-row-start: 1;
            grid-row-end: 1;
        }
        .box_4 {
            grid-column-start: 1;
            grid-column-end: 1;
            grid-row-start: 2;
            grid-row-end: 2;
        }
        .box_5 {
            grid-column-start: 2;
            grid-column-end: 2;
            grid-row-start: 2;
            grid-row-end: 2;
        }
        .box_6 {
            grid-column-start: 3;
            grid-column-end: 3;
            grid-row-start: 2;
            grid-row-end: 2;
        }
    </style>    
`

// WebComponent
@customElement('ly-devices')
export class DeviceLayout extends LitElement {
    @consume({context: apiContext})
    public APIService!: APIService;

    @consume({context: notificationContext})
    public NotificationController!: NotificationController;

    public DeviceConsumer?: StoreConsumer;

    @property({attribute: false}) disabledDeviceButtons: Set<number> = new Set([]);

    constructor() {
        super();
        this.button_callback = this.button_callback.bind(this);
    }

    firstUpdated(_changedProperties: PropertyValues) {
        if (this.APIService?.devices && !this.DeviceConsumer) {
            this.DeviceConsumer = new StoreConsumer(this, this.APIService.devices);
        }
    }

    updated(_changedProperties: PropertyValues) {
        if (!this.DeviceConsumer && this.APIService?.devices) {
            this.DeviceConsumer = new StoreConsumer(this, this.APIService.devices);
        }
    }

    async button_callback(apparaat_id: number, nu_actief: boolean) {
        await Wrap(
            this.disabledDeviceButtons,
            (set) => { set.add(apparaat_id); this.requestUpdate(); },
            (set) => { set.delete(apparaat_id); this.requestUpdate(); },
            async (id: number, now_active: boolean) => {
                await new ToggleDevice(this.NotificationController, this.APIService).start(id, now_active);
            },
            apparaat_id, nu_actief
        )
    }

    render() {
        const devicesState: Array<Device> = Object.values((this.APIService as APIService)?.devices?.value ?? {}) as Array<Device>;

        return html`
            ${base_style}
            <div class="inner">
                <md-title>Apparaten</md-title>
                <div class="grid">
                    ${[0,1,2,3,4,5].map((idx) => html`
                        ${devicesState[idx] ? html`
                            <gl-device-tile
                                class="box_${idx+1}"
                                .device=${devicesState[idx]}
                                ?disabled=${this.disabledDeviceButtons.has(devicesState[idx].apparaat_id)}
                                .callback=${this.button_callback}
                            ></gl-device-tile>
                        ` : html``}
                    `)}
                </div>
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