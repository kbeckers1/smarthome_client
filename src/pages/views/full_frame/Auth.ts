import {html, css, LitElement, TemplateResult, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { Popup } from '../../../components/general/Popup';
import { when } from 'lit/directives/when.js';

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
    @property({type: Boolean}) invalid_state: boolean
    current_username_input: string;
    current_password_input: string;

    shape: Popup

    constructor() {
        super();
        this.invalid_state = false;
        this.button_callback = this.button_callback.bind(this);
        this.user_input_callback = this.user_input_callback.bind(this);
        this.passwd_input_callback = this.passwd_input_callback.bind(this);
        this.current_username_input = '';
        this.current_password_input = '';
        this.shape = {
            width: '700px',
            title: {
                content: 'SmartHome Login',
                icon: ''
            },
            button_bar: [
                { 
                    type: "Primary",
                    title: "Log in",
                    icon: "",
                    callback: this.button_callback
                }
            ]
        }
    }

    button_callback(e: any) {
        console.log(this.current_username_input)
        console.log(this.current_password_input)
    }

    user_input_callback(e: any) {
        this.current_username_input = e.target.value;
    }

    passwd_input_callback(e: any) {
        this.current_password_input = e.target.value;
    }

    // render hook
    render() {
        this.shape.body = html`
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
        return html`
            ${base_style}
            <div class="inner">
                <div class="wrapper">
                    <gl-popup-surface .shape=${this.shape}></gl-popup-surface>               
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