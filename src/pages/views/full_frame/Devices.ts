import {html, css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';

const base_style = html`
    <style>
        :root { 
            --border-width: 5px;
        }
        .inner {
            padding: 10px;
            padding-top: 0px;
            height: 100%;
            width: calc(100% - 15px);
            overflow: auto;
            display: flex;
            flex-direction: column;
            gap: 10px; /* Space between all children */
        }
        .grid {
            display: grid;
            grid-template-columns: 2fr 2fr 2fr;
            grid-auto-rows: 2fr 2fr;
            height: 100%;
            width: 100%;
            gap: 15px;
        }
        .box_1 {
            grid-column-start: 1;
            grid-column-end: 1;
            grid-row-start: 1;
            grid-row-end: 1;
        }
        .box_2 {
            grid-column-start: 2;
            grid-column-end: 2;
            grid-row-start: 1;
            grid-row-end: 1;
        }
        .box_3 {
            grid-column-start: 3;
            grid-column-end: 3;
            grid-row-start: 1;
            grid-row-end: 1;
        }
        .box_4 {
            grid-column-start: 1;
            grid-column-end: 1;
            grid-row-start: 2;
            grid-row-end: 2;
        }
        .box_5 {
            grid-column-start: 2;
            grid-column-end: 2;
            grid-row-start: 2;
            grid-row-end: 2;
        }
        .box_6 {
            grid-column-start: 3;
            grid-column-end: 3;
            grid-row-start: 2;
            grid-row-end: 2;
        }
    </style>    
`

// WebComponent
@customElement('ly-devices')
export class DeviceLayout extends LitElement {
    constructor() {
        super();
    }

    render() {
        return html`
            ${base_style}
            <div class="inner">
                <md-title>
                    Apparaten
                </md-title>
                <div class="grid">
                    <gl-surface class="box_1" width="auto" height="autho"></gl-surface>
                    <gl-surface class="box_2" width="auto" height="autho"></gl-surface>
                    <gl-surface class="box_3" width="auto" height="autho"></gl-surface>
                    <gl-surface class="box_4" width="auto" height="autho"></gl-surface>
                    <gl-surface class="box_5" width="auto" height="autho"></gl-surface>
                    <gl-surface class="box_6" width="auto" height="autho"></gl-surface>
                </div>
            </div>
        `;
    }
}

// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "ly-devices": DeviceLayout;
    }
}