import {html, css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { Styles } from '../forms/Button'
import { when } from 'lit/directives/when.js';
import { repeat } from 'lit/directives/repeat.js';

// Popup Shape
export interface Button {
    callback: Function,
    title: string,
    icon: string,
    disabled: boolean,
    type: "Primary" | "Secondary" | "Red"
}
export interface Title {
    icon: string,
    content: string
}
export type Body = TemplateResult // whatever you want basically. I recommend using RichText. 
export type ButtonBar = Array<Button>

export interface Popup {
    button_bar?: ButtonBar,
    title?: Title,
    body?: Body,
    width: string
}

// WebComponent
@customElement('gl-popup-surface')
export class PopupSurface extends LitElement {
    // CSS
    static styles = css`
        :root {
            --width: 500px;
        }

        @keyframes slideUp {
            0% {
                transform: translateY(20px);
                opacity: 0;
            }
            100% {
                transform: translateY(0);
                opacity: 1;
            }
        }
        :host {
            display: flex;
            border: solid 1px #a2a2a2;
            width: var(--width);
            border-radius: 15px;
            background-color: #ffffff;
            animation: 0.5s ease-out 0s 1 slideUp;
        }
        .slot {
            display: flex;
            padding: 15px;
        }
        .container > * + * {
            border-top: solid 1px #a2a2a2;
        }  
    `
    @property({type: Object, attribute: false}) shape: Popup = {width: '500'};
    @property({type: Number}) counter: number

    constructor() {
        super();
        this.counter = 0;
        this.style.setProperty('--width', this.shape.width || '');
    }

    updated(changed: any){ 
        this.style.setProperty('--width', this.shape.width || '');
    }

    render() {
        // construction logic
        return html`
            <split-layout orientation="vertical" start-size="54px" end-size="61px" class="container">
                ${when(
                    'title' in this.shape,
                    () => html`
                        <div slot="start" class="slot">
                            <md-title .margined=${false} size="20px">
                                ${this.shape.title?.content}
                            </md-title>
                        </div>
                    `
                )}
                ${when(
                    'body' in this.shape,
                    () => html`
                        <div slot="middle" class="slot">
                            ${this.shape.body}
                        </div>
                    `
                )}
                ${when(
                    'button_bar' in this.shape,
                    () => html`
                        <div slot="end" class="slot" style="vertical-align: middle; justify-content: flex-end; padding: 10px!important;">
                            ${repeat(
                                this.shape.button_bar ?? [],
                                (item) => `${item.title}-${item.disabled}`, (item, index) => {
                                    let button_type = Styles.Primary
                                    switch(item.type) {
                                        case 'Primary':
                                            button_type = Styles.Primary;
                                            break;
                                        case 'Secondary':
                                            button_type = Styles.Secondary;
                                            break;
                                        case 'Red':
                                            button_type = Styles.Red;
                                            break;
                                    }
                                    return html`
                                        <md-button .type=${button_type} .callback=${item.callback} icon=${item.icon} .disabled=${item.disabled}>${item.title}</md-button>
                                    `
                                }
                            )}
                        </div>
                    `
                )}
            </split-layout>
        `
    }
}

// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "gl-popup-surface": PopupSurface;
    }
}
