import {html, css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';

type TableRow<T extends any[]> = T;

interface TypedTable<T extends any[]> {
  rows: TableRow<T>[];
}

// we define our column types & forms.


const base_style = html`
    <style>
        :root { 

        }
        :host {

        }
        
    </style>    
`

// WebComponent
@customElement('adv-table')
export class Table extends LitElement {
    @property() text: string;

    constructor() {
        super();
        this.text = 'Continue';
    }

    render() {
        return html`
            ${base_style}
            <table>

            </table>
        `;
    }
}

// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "adv-table": Table;
    }
}

/*
WHAT THIS WILL LOOK LIKE:
RULES:
- max display amount
- we maintain a set of active stuff
- each 

*/