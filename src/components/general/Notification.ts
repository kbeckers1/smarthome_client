import {css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { Styles } from '../../components/forms/Button'
import { when } from 'lit/directives/when.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { html } from 'lit/static-html.js';

export interface Notification {
    icon?: string,
    title?: string,
    description?: string,
    style: "default" | "red" | "yellow"
}

const base_style = html`
    <style>
        .filter-black {
            filter: brightness(0%);
        }
        :host {
            display: flex;
            border: solid 1px #a2a2a2;
            border-radius: 15px;
            background-color: #ffffff;
            padding: 15px;
        }
    </style>    
`

const red = html`
    <style>
        .filter-black {
            filter: brightness(0%);
        }
        :host {
            display: flex;
            border: solid 1px #ff0000;
            border-radius: 15px;
            background-color: #ffffff;
            padding: 15px;
            color: #ff0000;
        }
    </style>
`;
const yellow = html`
    <style>
        .filter-black {
            filter: brightness(0%);
        }
        :host {
            display: flex;
            border: solid 1px #e1b400;
            border-radius: 15px;
            background-color: #ffffff;
            padding: 15px;
            color: #e1b400;
        }
    </style>
`;

// WebComponent
@customElement('gl-notification')
export class PopupSurface extends LitElement {
    @property({attribute: false}) width: String
    @property({attribute: false}) height: String
    @property({type: Object}) shape: Notification;

    constructor() {
        super();
        this.width = "250px";
        this.height = "100px";
        this.shape = { style: "red", title: "New Message", description: "DescriptionDescriptionDescription DescriptionDescriptionDescription"};
    }

    render() {
        return html`
            ${base_style}
            ${when(
                this.shape.style === "red",
                () => html`
                    ${red}
                `
            )}
            ${when(
                this.shape.style === "yellow",
                () => html`
                    ${yellow}
                `
            )}
            <style>
                :host {
                    width: ${this.width};
                    height: auto;
                }
            </style>
            <div>
                <split-layout orientation="vertical" start-size="30px">
                    ${when(
                        ('title' in this.shape) || ('icon' in this.shape),
                        () => html`
                            <div slot="start">
                                <split-layout orientation="horizontal" start-size="30px">
                                    ${when(
                                        'icon' in this.shape,
                                        () => html`
                                            <div slot="start">
                                                <img src="${ifDefined(this.shape?.icon)}" height="22px" class="filter-black">
                                            </div>
                                        `
                                    )}
                                    ${when(
                                        'title' in this.shape,
                                        () => html`
                                            <div slot="middle" style="vertical-align: middle;">
                                                <md-title size="18px" .margined=${false}>${this.shape?.title}</md-title>
                                            </div>
                                        `
                                    )}
                                </split-layout>
                            </div>
                        `
                    )}
                    ${when(
                        'description' in this.shape,
                        () => html`
                            <div slot="middle" style="vertical-align: middle;">
                                <md-richtext>${this.shape?.description}</md-richtext>
                            </div>
                        `
                    )}
                </split-layout>
            </div>
        `;
    }
}

// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "gl-notification": PopupSurface;
    }
}
