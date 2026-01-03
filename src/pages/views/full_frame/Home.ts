import {html, css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { Title, Button, ButtonBar, Popup } from '../../../components/general/Popup';
import { Styles } from '../../../components/forms/Button';
import { LogOut } from '../../../services/micro/LogOut';
import { popupContext, PopupController } from '../../../services/PopupController';
import { consume } from '@lit/context';
import { notificationContext, NotificationController } from '../../../services/NotificationController';
import { Router, Routes } from '../../../services/RouterService';

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
                <md-button .type=${Styles.Primary} .callback=${() => new LogOut(this.PopupController).start()}>
                    Show Popup
                </md-button>
                <md-button .type=${Styles.Red} .callback=${() => this.NotificationController.notify({description: 'Hhello world!', style: "default"})}>
                    Show Notification
                </md-button>
                <md-button .type=${Styles.Yellow} .callback=${() => {Router.route(6)}}>
                    To Auth Page
                </md-button>
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