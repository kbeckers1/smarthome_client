import {html, css, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { cell_bool } from './cell_renderers/Boolean';
import { Button } from '../general/Popup';
import { cell_button } from './cell_renderers/Button';

// source: https://www.reddit.com/r/typescript/comments/12xdwds/enforce_field_to_have_same_keys_as_another_field/
export type RendererFn<T> = (value: T, options?: any) => TemplateResult;

export interface Renderer<T, O = {}> {
    render: RendererFn<T>;
    options?: O;
}

export enum RenderNames {
    number,
    boolean,
    string,
    button
}
export interface RendererValueMap {
    [RenderNames.string]: string;
    [RenderNames.number]: number;
    [RenderNames.boolean]: boolean;
    [RenderNames.button]: Button;
}
export const Renderers: {
    [K in RenderNames]: Renderer<RendererValueMap[K]>
} = {
    [RenderNames.string]: {
        render: (value) => {
            return html`${value}`;
        }
    },
    [RenderNames.number]: {
        render: (value: number) => {
            let newVal;
            if (typeof value === "number") {
                newVal = value.toFixed(2)
            } else {
                newVal = value
            }
            return html`${newVal}`;
        }
    },
    [RenderNames.boolean]: {
        render: cell_bool
    },
    [RenderNames.button]: {
        render: cell_button
    }
};

export interface HeaderConfig<R extends RenderNames> {
    label: string;
    renderer: R;
    options?: Parameters<
        typeof Renderers[R]['render']
    >[1];
}


export interface Sheet<T extends string> {
    headers: {
        [K in T]: HeaderConfig<RenderNames>;
    };
    values: {
        [K in T]: RendererValueMap[RenderNames];
    }[];
}

const sheet: Sheet<'firstName' | 'lastName' | 'age' | 'active'> = {
    headers: {
        firstName: {
            label: 'First name',
            renderer: RenderNames.string
        },
        lastName: {
            label: 'Last name',
            renderer: RenderNames.string
        },
        age: {
            label: 'Age',
            renderer: RenderNames.number
        },
        active: {
            label: 'Active',
            renderer: RenderNames.boolean
        }
    },
    values: [
        {
            firstName: 'John',
            lastName: 'Doe',
            age: 32,
            active: true
        },
        {
            firstName: 'Mary',
            lastName: 'Jane',
            age: 28,
            active: false
        },
    ]
};


const base_style = html`
    <style>
        :root { 

        }
        :host {
            width: calc(100% - 20px);
            height: calc(100% - 5px);
            margin-top: 5px;
            padding-left: 10px;
            padding-right: 10px;
        }
        table {
            overflow: hidden;
            width: 100%;
            border-collapse: collapse; /* ensures borders are not doubled */
            border-style: hidden;
            border-bottom: 1px solid #f3f3f3;
        }

        th, td {
            border-bottom: 1px solid #f3f3f3;   /* add visible borders */
            padding: 4px;              /* optional: makes cells readable */
            text-align: left;
            height: 30px;
            vertical-align: middle;
            font-family: "Funnel Display", Helvetica;
            font-size: 14px;
        }

        th:first-child, td:first-child {
            padding-left: 10px;
        }
    </style>    
`

// WebComponent
@customElement('adv-table')
export class Table extends LitElement {
    @property() text: string;
    @property({attribute: false}) table: Sheet<any>;

    constructor() {
        super();
        this.text = 'Continue';
        this.table = sheet;
    }

    render() {
        const headers = Object.entries(this.table?.headers ?? {});
        const values = Array.isArray(this.table?.values) ? this.table!.values : [];
        if (values.length === 0) return html`<div style="vertical-align: center; justify-content: middle;"><md-richtext>Awaiting data</md-richtext></div>`;
        return html`
            ${base_style}
            <table>
                ${repeat(
                    Object.entries(this.table.headers),
                    (instance) => html`
                        <th>
                            ${instance[1].label}
                        </th>
                    `
                )}
                ${repeat(
                    this.table.values,
                    (instance) => html`
                        <tr>
                        ${repeat(
                            Object.entries(instance),
                            (key) => {
                                const renderer_type = this.table.headers[key[0]].renderer
                                const renderer = Renderers[renderer_type]
                                return html`<td>${renderer.render(key[1] as never)}</td>` // we surpress this error because we know itll work anyway
                            }
                        )}
                        </tr>
                    `
                )}
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




/*
energieverbruik over dagen 
dingen aan/uit zetten
huidige temperatuur
matrix aan/uit slim

ai fixen -> kai
dashboard maken & tabellen -> kai

sham & bahaa -> vanuit de pico W stuur je sensorgegevens elke 30 seconden

*/