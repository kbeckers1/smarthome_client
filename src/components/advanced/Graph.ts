import {html, css, LitElement, TemplateResult, PropertyValues} from 'lit';
import {customElement, property, query, queryAll, queryAsync} from 'lit/decorators.js';
import { GraphController, GraphData } from '../../services/GraphController';

const base_style = html`
    <style>
        :root { 

        }
        :host {
            height: calc(100% - 10px);
            width: 100%;
        }
    </style>    
`

// WebComponent
@customElement('adv-graph')
export class Graph extends LitElement {
    @property({attribute: false}) canvas!: HTMLCanvasElement
    @property({attribute: false}) graph!: GraphData
    private width: string
    private height: string
    private graphController: GraphController = new GraphController(this)
    private resizeObserver?: ResizeObserver
    private resizeTimeout?: number;

    constructor() {
        super();
        this.width = '100px';
        this.height = '100px';
    }

    firstUpdated(_changedProperties: PropertyValues): void {
        this.resizeObserver = new ResizeObserver(() => {
            // Clear previous timeout
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            
            // Wait 150ms after resize stops before updating
            this.resizeTimeout = window.setTimeout(() => {
                this.updateCanvasSize();
                this.graphController.render()
            }, 200);
        });

        this.updateCanvasSize()
        this.graphController.start(this.graph)
        this.resizeObserver.observe(this);
    }

    protected updated(_changedProperties: PropertyValues): void {
        if (_changedProperties.has('graph')) {
            this.graphController.setGraph(this.graph);
            this.graphController.render()
        }
    }

    private updateCanvasSize(): void {
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
        this.canvas.height = parseInt(this.height) * dpr;
        this.canvas.width = parseInt(this.width) * dpr;

        const ctx = this.canvas.getContext('2d')!;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.graphController.start(this.graph);
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        this.resizeObserver?.disconnect();
    }
    
    render() {
        return html`
            ${base_style}
            <canvas 
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
