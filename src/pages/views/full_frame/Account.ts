import {html, css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { Styles } from '../../../components/forms/Button';
import { Router } from '../../../services/RouterService';
import { LogOut } from '../../../services/micro/LogOut';
import { consume } from '@lit/context';
import { popupContext, PopupController } from '../../../services/PopupController';
import { notificationContext, NotificationController } from '../../../services/NotificationController';
import { authContext, AuthService } from '../../../services/AuthService';
import { RenderNames, Sheet } from '../../../components/advanced/Table';

// Token Table
const sheet: Sheet<'gebruiker' | 'verlooptOp' | 'beheer'> = {
    headers: {
        gebruiker: {
            label: 'Gebruikersnaam',
            renderer: RenderNames.string
        },
        verlooptOp: {
            label: 'Verloop',
            renderer: RenderNames.string
        },
        beheer: {
            label: 'Beheer',
            renderer: RenderNames.button
        }
    },
    values: [
        {
            gebruiker: 'John',
            verlooptOp: '06/01/26',
            beheer: {
                callback: () => {},
                type: 'Red',
                disabled: false,
                icon: "",
                title: "Revoke"
            }
        },
        {
            gebruiker: 'John',
            verlooptOp: '06/01/26',
            beheer: {
                callback: () => {},
                type: 'Red',
                disabled: false,
                icon: "",
                title: "Revoke"
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
@customElement('ly-account')
export class AccountLayout extends LitElement {
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
                    Account
                </md-title>
                <gl-surface style="flex-direction: column;">
                    <md-richtext>
                        Log uit
                    </md-richtext>
                    <br/>
                    <md-button .type=${Styles.Red} .callback=${() => new LogOut(this.PopupController, this.AuthService).start()}>
                        Log uit
                    </md-button>
                </gl-surface>
                <gl-surface width="700px">
                    <adv-table .table=${sheet}>

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
        "ly-account": AccountLayout;
    }
}