import {html, css, LitElement, TemplateResult, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { Styles } from '../../../components/forms/Button';
import { Router } from '../../../services/RouterService';
import { LogOut } from '../../../services/micro/LogOut';
import { consume } from '@lit/context';
import { popupContext, PopupController } from '../../../services/PopupController';
import { notificationContext, NotificationController } from '../../../services/NotificationController';
import { authContext, AuthService, Result } from '../../../services/AuthService';
import { RenderNames, Sheet } from '../../../components/advanced/Table';
import { StoreConsumer } from '../../../services/GlobalState';
import { Account, apiContext, APIService } from '../../../services/APIService';
import { Wrap } from '../../../directives/Wrap';
import { Sleep } from '../../../directives/Sleep';
import { LogAllOut } from '../../../services/micro/LogAllOut';

// Token Table
const sheet: Sheet<'gebruiker' | 'email' | 'sessies' | 'beheer'> = {
    headers: {
        gebruiker: {
            label: 'Gebruikersnaam',
            renderer: RenderNames.string
        },
        email: {
            label: 'Email',
            renderer: RenderNames.string
        },
        sessies: {
            label: 'Sessies',
            renderer: RenderNames.number
        },
        beheer: {
            label: 'Sessiebeheer',
            renderer: RenderNames.button
        }
    },
    values: []
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

    @consume({context: apiContext})
    public APIService!: APIService;

    public AccountConsumer?: StoreConsumer;
    // optional unsubscribe/cleanup handle if StboreConsumer provides one
    @property({attribute: false }) disabledTableButtons: Set<number> = new Set([]);

    constructor() {
        super();
        this.button_callback = this.button_callback.bind(this);
    }

    firstUpdated(_changedProperties: PropertyValues): void {
        // Try to initialize if APIService already provided; otherwise `updated` will handle it.
        if (this.APIService?.accounts && !this.AccountConsumer) {
            this.AccountConsumer = new StoreConsumer(this, this.APIService.accounts);
        }
    }

    updated(_changedProperties: PropertyValues): void {
        // Context services may arrive after first update; ensure consumer is created
        if (this.APIService?.accounts && !this.AccountConsumer) {
            this.AccountConsumer = new StoreConsumer(this, this.APIService.accounts);
        }
    }

    async button_callback(gebruiker_id: number) {
        await Wrap(
            this.disabledTableButtons,
            (set) => { set.add(gebruiker_id); this.requestUpdate()},
            (set) => { set.delete(gebruiker_id); this.requestUpdate()},
            async (id: number) => { 
                // Request network to erase our stuff\
                await new LogAllOut(this.PopupController, this.APIService, this.NotificationController, id).start(); // Flow
            },
            gebruiker_id
        )
    }

    render() {
        // we manage Device data
        const accountsState: Array<Account> = Object.values((this.APIService as APIService)?.accounts.value) as unknown as Array<Account>

        // transform what we got from the database and make it digestible for our Sheet.
        const passable = accountsState.map((value) => ({
            gebruiker: value.naam, 
            email: value.email,
            sessies: value.sessies,
            beheer: {
                disabled: this.disabledTableButtons.has(value.gebruiker_id),
                type: "Red",
                title: "Log gebruiker uit",
                icon: "",
                callback: (e: any) => {
                    return this.button_callback(value.gebruiker_id)
                }
            }
        }))

        console.log(passable)
        // build our sheet
        const dynamicSheet = Object.assign({}, sheet, { values: Object.values(passable) });

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
                    <adv-table .table=${dynamicSheet}>

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