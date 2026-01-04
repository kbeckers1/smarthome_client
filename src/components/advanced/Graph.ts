import {html, css, LitElement, TemplateResult, PropertyValues} from 'lit';
import {customElement, property, query, queryAll, queryAsync} from 'lit/decorators.js';
import { GraphController } from '../../services/GraphController';

const base_style = html`
    <style>
        :root { 

        }
        :host {
            height: 100%;
            width: 100%;
        }
    </style>    
`

// WebComponent
@customElement('adv-graph')
export class Graph extends LitElement {
    @property({attribute: false}) canvas!: HTMLCanvasElement
    @property({attribute: false}) width: string
    @property({attribute: false}) height: string
    private graphController: GraphController = new GraphController(this)

    constructor() {
        super();
        this.width = '100px';
        this.height = '100px';
    }

    firstUpdated(_changedProperties: PropertyValues): void {
        // we iniate the canvas
        const style = getComputedStyle(this);
        this.width = style.width;
        this.height = style.height;

        // we iniate the drawings
        this.canvas = this.shadowRoot?.querySelector('#canvas') as HTMLCanvasElement; // this because @query for whatever reason is broken: we manually assign our canvas.

        // resolve blur & sizing
        const dpr = window.devicePixelRatio || 1;
        this.canvas.style.width = style.width;
        this.canvas.style.height = style.height;
        this.canvas.height = parseInt(this.height) * dpr
        this.canvas.width = parseInt(this.width) * dpr

        const ctx = this.canvas.getContext('2d')!;
        ctx.scale(dpr, dpr);
        
        this.graphController.start()
    }

    render() {
        return html`
            ${base_style}
            <canvas 
                height="${this.height}"
                width="${this.width}"
                id="canvas"
            ></canvas>
        `;
    }
}

// Type definition
declare global {
    interface HTMLElementTagNameMap {
        "adv-graph": Graph;
    }
}
