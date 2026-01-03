import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Styles } from '../../components/sidebar/MenuEntry'
import { Routes, Router, Route } from '../../services/RouterService'

const base_style = html`
    <style>
        :root { 
            --border-width: 5px;
        }
        .inner {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            padding: 10px;
            gap: 5px;
            height: 100%;
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
            background-color: #3f9062;
            overflow: auto;
            border-radius: 0px 15px 15px 0px;
        }
        .menu-container {
            margin-top: 5px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            gap: 5px;
        }
        .top {
            font-family: "Funnel Display", Helvetica;
            font-weight: 500;
            color: black;
            font-size: 18px;
            background-color: #ffb300;
            align-items: center;
            text-align: center;
            vertical-align: middle;
            display: inline;
            padding-top: 12px;
            border-radius: 15px;
        }
    </style>    
`

// WebComponent
@customElement('side-bar')
export class Sidebar extends LitElement {
    private _onRoute: () => void;

    constructor() {
        super();
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
        // we generate our Menubar list here, with a list of components and stuff.
        const selected = Router.state.get()
        const container = document.createElement("div");
        container.slot = "middle"
        container.className = "menu-container"

        // we create a button (menu-entry) for each Route minus the Account route.
        const entries: Array<Element & {type: Styles}> = Object.entries(Routes)
            .filter((route) => route[1].pageSelector != "ly-account")
            .filter((route) => route[1].show === true)
            .map((route) => {
                const el = document.createElement("menu-entry");
                container.appendChild(el);
                el.title = route[1].vanityName;
                el.icon = route[1].iconPath;
                el.entry = Number(route[0]);
                el.type = Styles.UNSELECTED;
                return el;
            })

        // why did we bolt on a Login button instead of defining clean subcategories? Well, because its too much work in this short timeframe to do so.
        let account_style = Styles.UNSELECTED // this is for our bolt-on login entry
        if (selected == 5) {
            account_style = Styles.SELECTED
        } else {
            // quickly select the valid one
            entries[selected].type = Styles.SELECTED
        }

        // then we bolt on our Account button
        const account = document.createElement("menu-entry");
        account.title = Routes[5].vanityName;
        account.icon = Routes[5].iconPath;
        account.entry = Number(5);
        account.type = account_style

        return html`
            ${base_style}
            <div class="inner">
                <split-layout orientation="vertical" start-size="50px" end-size="50px">
                    <div slot="start" class="top">SmartHome</div>
                    ${container}
                    <div slot="end">
                        <div style="vertical-align: bottom; height: 100%; display: flex; flex-direction: column-reverse;">
                            ${account}
                        </div>
                    </div>
                </split-layout>
            </div>
        `;
    }
}

// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "side-bar": Sidebar;
    }
}