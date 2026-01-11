import { html, css, LitElement, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { Device, APIService, apiContext } from '../../services/APIService';
import { consume } from '@lit/context';
import { StoreConsumer } from '../../services/GlobalState';
import { Styles } from '../forms/Button';

@customElement('gl-device-tile')
export class DeviceTile extends LitElement {
    @property({ type: Object, attribute: false }) device: Device | undefined;
    @property({ type: Boolean }) disabled: boolean = false;
    @property({ attribute: false }) callback: Function = () => {};
    @consume({context: apiContext})
    public APIService!: APIService;

    private energyConsumer?: StoreConsumer<Record<number, { totalEnergyKwh: number, totalCost: number }>>;

    constructor() {
        super();
    }
    firstUpdated(_changedProperties: PropertyValues) {
        if (this.APIService && !this.energyConsumer) {
            this.energyConsumer = new StoreConsumer(this, this.APIService.deviceEnergy);
        }
    }

    static styles = css`
        :host {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 12px;
            overflow: hidden;
            border: solid 1px #a2a2a2;
            color: black;
            font-family: "Funnel Display", Helvetica, Arial;
        }
        .inner {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 12px;
            height: 100%;
            box-sizing: border-box;
            justify-content: space-between;
        }
        .meta {
            display:flex;
            justify-content: space-between;
            align-items: center;
        }
        .title {
            font-weight: 700;
            font-size: 16px;
        }
        .sub {
            font-size: 12px;
            color: rgba(0,0,0,0.6);
        }
        .bottom {
            display:flex;
            justify-content: space-between;
            align-items: center;
        }
        .energy {
            font-weight: 600;
        }
        .overlay {
            position: absolute;
            inset: 0;
            background: rgba(255,255,255,0.6);
            display:flex;
            align-items:center;
            justify-content:center;
            font-size: 14px;
            color: #666;
        }
    `;

    isLamp(name: string) {
        return name.toLowerCase().includes('lamp');
    }

    isServo(name: string) {
        return name.toLowerCase().includes('servo');
    }

    render() {
        if (!this.device) return html``;

        const name = this.device.naam ?? '';
        const active = Boolean(this.device.actief);

        let bg = '#ffffff';
        let textColor = '#000000';

        if (this.disabled) {
            bg = '#dcdcdc';
            textColor = '#666';
        } else if (this.isLamp(name)) {
            bg = active ? '#FFF5DE' : '#ffffff';
            textColor = active ? '#fff' : '#000';
        } else if (this.isServo(name)) {
            bg = active ? '#E0FFE1' : '#c30000';
            textColor = '#fff';
        }

        const buttonLabel = this.device.beheerd ? 'Beheerd' : (active ? 'Uit' : 'Aan');

        return html`
            <style>
                :host { background: ${bg}; color: ${textColor}; position: relative; }
            </style>
            <div class="inner">
                <div class="meta">
                    <div>
                        <div class="title">${this.device.naam}</div>
                        <div class="sub">${this.device.kamer}</div>
                    </div>
                    <div class="sub">ID: ${this.device.apparaat_id}</div>
                </div>

                <div class="bottom">
                    <div>
                        <div class="energy">${Number(this.device.huidig_verbruik).toFixed(2)} W</div>
                        <div class="sub">${this.device.actief ? 'Actief' : 'Inactief'}</div>
                        <div class="sub">24u: ${(() => {
                            try {
                                const store = this.energyConsumer?.state ?? {};
                                const s = this.device ? (store[this.device.apparaat_id] ?? { totalEnergyKwh: 0, totalCost: 0 }) : { totalEnergyKwh: 0, totalCost: 0 };
                                return `${s.totalEnergyKwh.toFixed(3)} kWh • €${s.totalCost.toFixed(2)}`;
                            } catch (e) { return '0.000 kWh • €0.00'; }
                        })()}</div>
                    </div>
                    <div>
                        <md-button
                            .type=${Styles.Primary}
                            ?disabled=${this.device.beheerd || this.disabled}
                            .callback=${() => this.callback(this.device!.apparaat_id, this.device!.actief)}
                        >${buttonLabel}</md-button>
                    </div>
                </div>

                ${when(this.disabled, () => html`<div class="overlay">Bezig met schakelen...</div>`)}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'gl-device-tile': DeviceTile;
    }
}
