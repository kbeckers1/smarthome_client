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
            display: inline-flex;
            flex-direction: column;
            gap: 10px; /* Space between all children */
        }
        .container > * + * {
            border-top: solid 1px #a2a2a2;
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
                <gl-surface style="gap: 15px" width="calc(100% - 50px)">
                    <gl-data-tile height="200px" color="#e1b400" style="flex: 1 1 auto;">
                        <md-richtext>Buitentemperatuur</md-richtext>
                        <md-title>17 °C</md-title>
                        <md-richtext style="color: #e1b400!important; text-size: 10px;">huidig</md-richtext>
                    </gl-data-tile>
                    <gl-data-tile height="200px" color="#005ec3" style="flex: 1 1 auto;">
                        <md-richtext>Luchtvochtigheid</md-richtext>
                        <md-title>67%</md-title>
                        <md-richtext style="color: #005ec3!important; text-size: 10px;">huidig</md-richtext>
                    </gl-data-tile>
                    <gl-data-tile height="200px" color="#3f9062" style="flex: 1 1 auto;">
                        <md-richtext>Netwerk</md-richtext>
                        <md-title>Online</md-title>
                    </gl-data-tile>
                    <gl-data-tile height="200px" color="#c30000" style="flex: 1 1 auto;">
                        <md-richtext>Energieverbruik</md-richtext>
                        <md-title>2.5 kW</md-title>
                        <md-richtext style="color: #c30000!important; text-size: 10px;">/ uur</md-richtext>
                    </gl-data-tile>
                </gl-surface>
                <gl-surface height="300px;" width="600px;" padding="0px">
                    <adv-table>
                    </adv-table>
                </gl-surface>
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