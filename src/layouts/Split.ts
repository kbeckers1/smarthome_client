import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('split-layout')
export class SplitLayout extends LitElement {
    @property({ type: String, reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';
    @property({ type: String, attribute: 'start-size' }) startSize: string;
    @property({ type: String, attribute: 'end-size' }) endSize: string;

    constructor() {
        super();
        this.startSize = '20%';
        this.endSize = '10%';
    }

    static styles = css`
        :host {
            display: flex;
            width: 100%;
            height: 100%;
        }
        ::slotted(*) {
            overflow: auto;
            min-width: 0;
            min-height: 0;
            box-sizing: border-box;
        }
        ::slotted([slot="middle"]) {
              flex: 1;
        }
    `;

    render() {
        return html`
            <style>
                /* Flex directions */
                :host([orientation="horizontal"]) {
                  flex-direction: row;
                }
                :host([orientation="vertical"]) {
                  flex-direction: column;
                }
                /* Width/height resetting */
                :host([orientation="horizontal"]) ::slotted([slot="start"]) {
                  width: ${this.startSize};
                }
                :host([orientation="horizontal"]) ::slotted([slot="end"]) {
                  width: ${this.endSize};
                }
                :host([orientation="vertical"]) ::slotted([slot="start"]) {
                  height: ${this.startSize};
                }
                :host([orientation="vertical"]) ::slotted([slot="end"]) {
                  height: ${this.endSize};
                }
            </style>
            <slot name="start"></slot>
            <slot name="middle"></slot>
            <slot name="end"></slot>
        `;
      }
}