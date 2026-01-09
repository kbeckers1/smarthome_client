import {html, css, LitElement, TemplateResult, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { Popup, PopupSurface } from '../../../components/general/Popup';
import { when } from 'lit/directives/when.js';
import { Router } from '../../../services/RouterService';
import { authContext, AuthService, Result } from '../../../services/AuthService';
import { consume } from '@lit/context';
import { live } from 'lit/directives/live.js';
import { notificationContext, NotificationController } from '../../../services/NotificationController';

const base_style = html`
    <style>
        :root { 
            --border-width: 5px;
        }
        .inner {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: 200;
            justify-content: center;
        }
        .inner > .wrapper {
           position: absolute; 
           left: 50%; 
           top: 50%; 
           transform: translate(-50%, calc(-50% - 100px));
        }
        .inner > .wrapper > * {
            position: relative; /* allows variable size naturally */
            pointer-events: auto;
        }
    </style>    
`

// WebComponent
@customElement('ly-auth')
export class AuthLayout extends LitElement {
    @consume({context: authContext})
    public AuthService!: AuthService;

    @consume({context: notificationContext})
    public NotificationController!: NotificationController

    @property({type: Boolean}) invalid_state: boolean
    current_username_input: string;
    current_password_input: string;

    @property({type: Object, attribute: false}) shape: Popup
    @property({type: Object, attribute: false, hasChanged: () => true}) computedShape?: Popup;
    @property({type: Number}) counter: number

    private popupRef?: PopupSurface; // Add reference to popup

    firstUpdated() {
        // Get reference to the popup element
        this.popupRef = this.shadowRoot?.querySelector('gl-popup-surface') as PopupSurface;
    }

    constructor() {
        super();
        this.invalid_state = false;
        this.counter = 0;
        this.button_callback = this.button_callback.bind(this);
        this.user_input_callback = this.user_input_callback.bind(this);
        this.passwd_input_callback = this.passwd_input_callback.bind(this);
        this.current_username_input = '';
        this.current_password_input = '';
        this.shape = {
            width: '700px',
            title: {
                content: 'SlimHuis Login',
                icon: ''
            },
            button_bar: [
                { 
                    type: "Primary",
                    title: "Log in",
                    icon: "",
                    disabled: false,
                    callback: this.button_callback
                }
            ]
        }
    }

    async button_callback(e: any) {
        const newShape = {
            ...this.shape,
            button_bar: [
                {
                    ...this.shape.button_bar![0],
                    disabled: true,
                }
            ]
        };
        this.shape = newShape;
        this.counter += 1;

        // https://github.com/lit/lit/issues/4651
        this.requestUpdate();
        this.popupRef?.requestUpdate()

        const res = await this.AuthService.generate_token(this.current_username_input, this.current_password_input)

        // reset out button
        const newShape2 = {
            ...this.shape,
            button_bar: [
                {
                    ...this.shape.button_bar![0],
                    disabled: false,
                }
            ]
        };
        this.shape = newShape2;
        this.counter += 1;

        if (res == Result.Success) {
            Router.route(0)
            this.NotificationController.notify({
                style: "default",
                description: "Logged in"
            })
        } else {
            this.invalid_state = true;
        }

        this.requestUpdate();
        this.popupRef?.requestUpdate()
    }

    user_input_callback(e: any) {
        this.current_username_input = e.target.value;
    }

    passwd_input_callback(e: any) {
        this.current_password_input = e.target.value;
    }

    // render hook
    render() {
        const bodyContent = html`
            <style>
                .auth-fields {
                    display: flex;
                    flex-direction: column; /* stacks children vertically */
                    gap: 8px; /* space between lines */
                    width: calc(100% - 60%);
                }
            </style>
            <div class="auth-fields">
                <md-richtext><b>Gebruikersnaam</b></md-richtext>
                <md-textfield .callback=${this.user_input_callback}></md-textfield>
                <md-richtext><b>Wachtwoord</b></md-richtext>
                <md-textfield .password=${true} .callback=${this.passwd_input_callback}>
                    ${when(
                        this.invalid_state === true,
                        () => html`
                            <div style="color: red; font-family:'Funnel Display', Helvetica; font-size: 14px; padding-top: 5px; padding-left: 5px;">
                                Invalide Wachtwoord of Gebruikersnaam
                            </div>
                        `
                    )}
                </md-textfield>
            </div>
        `
        this.computedShape = {...this.shape, body: bodyContent} as Popup;
        return html`
            ${base_style}
            <div class="inner">
                <div class="wrapper">
                    <gl-popup-surface .counter="${this.counter}" .shape=${live(this.computedShape as unknown as any)}></gl-popup-surface>    
                </div>
            </div>
        `;
    }
}

// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "ly-auth": AuthLayout;
    }
}