import {css, LitElement, TemplateResult} from 'lit';
import { literal, unsafeStatic, html } from 'lit/static-html.js';
import {customElement, property} from 'lit/decorators.js';
import {Styles} from '../components/sidebar/MenuEntry'
import { Router, Routes } from '../services/RouterService'
import { popupContext, PopupController } from '../services/PopupController'
import { provide } from '@lit/context';
import { ContextProvider } from '@lit/context';
import { notificationContext, NotificationController } from '../services/NotificationController';
import { when } from 'lit/directives/when.js';
import { apiContext, APIService } from '../services/APIService';
import { authContext, AuthService } from '../services/AuthService';

const base_style = html`
    <style>
        :root { 
            --border-width: 5px;
        }
        :host {
            display: block; 
            flex: 1;
            position: fixed;
            height: 100%;
            width: 100%;
            background-color: #f2f9f1;
        }
    </style>    
`

// WebComponent
@customElement('pg-dashboard')
export class Dashboard extends LitElement {
    @property() text: string;
    private _onRoute: () => void;

    public popupController = new ContextProvider(this, {context: popupContext, initialValue: new PopupController(this, 100)});
    public notificationController = new ContextProvider(this, {context: notificationContext, initialValue: new NotificationController(this, 100)});
    public apiService = new ContextProvider(this, {context: apiContext, initialValue: new APIService(this)})
    public authService = new ContextProvider(this, {context: authContext, initialValue: new AuthService(this)})

    constructor() {
        super();
        this.text = 'Continue';
        this._onRoute = () => this.requestUpdate();
    }

    connectedCallback(): void {
        super.connectedCallback();
        window.addEventListener('route-changed', this._onRoute);
    }

    disconnectedCallback(): void {
        window.removeEventListener('route-changed', this._onRoute);
        super.disconnectedCallback();
    }

    render() {
        const route = Routes[Router.state.get()]
        const tag = String(route.pageSelector)
        // we inject custom html/css via our popupcontroller to render our popups and notifications on demand. See: Lit Directives
        return html`
            ${base_style}
            <split-layout orientation="horizontal" start-size="220px">
                ${when(
                    route.show === true,
                    () => html`
                        <div slot="start">
                            <side-bar></side-bar>
                        </div>
                    `
                )}
                <div slot="middle">
                    <div style="padding: 15px; display: block; flex: 1; min-width: 0; min-height: 0; overflow: hidden; ">
                        <${unsafeStatic(tag)}>
                        </${unsafeStatic(tag)}>
                    </div>
                </div>
            </split-layout>
            ${this.popupController.value._render()}
            ${this.notificationController.value._render()}
        `;
    }
}

// Webcomponent Factory


// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "pg-dashboard": Dashboard;
    }
}
