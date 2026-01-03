import {html, css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { Router, Routes } from '../../services/RouterService'

// Styles
const base_style = html`
    <style>
        :root { 
            --border-width: 5px;
        }
        :host {
            display: inline-flex;
            height: 45px;
            justify-content: center;
            align-items: center;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
        }
        .inner {
            display: inline-flex;
            font-family: "Funnel Display", Helvetica;
            font-size: 16px;
            border-radius: 20px;
            width: 100%;
            justify-content: left;
            padding-left: 10px;
            align-items: center;
            cursor: inherit;
            color: white;
            vertical-align: middle;
            margin: 0px !important;
            height: 100%;
            box-sizing: border-box;
            min-width: 0;
            transition: 0.3s;
        }
        p {
            padding: 0;
            text-align: center;
        }
    </style>
`;

const selected = html`
    <style>
        .inner {
            background-color: #4ac088;
            color: white;
            border: solid 0px #00851f;
        }
        .inner:hover {
            background-color: #46b481;
        }
    </style>
`;

const unselected = html`
    <style>
        .inner {
            background-color: transparent;
            color: white;
            border: solid 0px #00851f;
        }
        .inner:hover {
            background-color: #bfebc9;
        }
    </style>
`;

// Style Definitions
export enum Styles {
    SELECTED = 0,
    UNSELECTED = 1
}

export const LocalStyles: Record<string, TemplateResult> = {
    [Styles.SELECTED]: selected,
    [Styles.UNSELECTED]: unselected,
}


// WebComponent
@customElement('menu-entry')
export class MenuEntry extends LitElement {

    // Use an accessor-backed property to avoid class-field shadowing.
    @property() title: string;
    @property({type: Number}) type: Styles;
    @property({type: String}) icon: string;
    @property({type: Number}) entry: Number;

    constructor() {
        super();
        this.title = 'Entry';
        this.entry = 0;
        this.type = Styles.SELECTED;
        this.icon = '';
    }

    _handleClick(e: any) {
        // get the id from our Title
        Router.route(this.entry.valueOf());
    }

    render() {
        return html`
            ${base_style}
            ${this.type == Styles.SELECTED ? selected : unselected}
            <button @click="${this._handleClick}" class="inner">
                <img src=${this.icon} style="margin-right: 5px;" height="22px;" />
                <p>${this.title}</p>
            </button>
        `;
    }
}

// Webcomponent Factory


// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "menu-entry": MenuEntry;
    }
}
