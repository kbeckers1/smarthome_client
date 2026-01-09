// description
import { html, css, LitElement, ReactiveController, ReactiveControllerHost, TemplateResult } from "lit"
import { Popup } from "../components/general/Popup";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import {createContext} from '@lit/context';
import { Graph } from "../components/advanced/Graph";
import { drawColumns } from "./graph_renderers/ColumnRenderer";

const MAX_AXIS_LENGTH = 4;

// Internal Structures
// Graph Descriptors & Metadata
export type ZIndex = number

export interface Range {
    start: number,
    end: number,
    step: number
}

export interface Cuboid {
    x: number,
    y: number,
    width: number,
    height: number
}

// Graph Types
export enum GraphTypes {
    LineGraph,
    WaterfallGraph,
    ColumnGraph,
    ScatterGraph
}

export type GraphTypeMap = {
    [GraphTypes.LineGraph]: LineGraph
    [GraphTypes.WaterfallGraph]: WaterfallGraph
    [GraphTypes.ColumnGraph]: ColumnGraph
    [GraphTypes.ScatterGraph]: ScatterGraph
}

export const GraphRenderers: {
    [K in GraphTypes]: (ctx: CanvasRenderingContext2D, graph: GraphWrapper<K>, graphBox: Cuboid, x_range: Range, y_range: Range) => void
} = {
    [GraphTypes.LineGraph]: () => {},
    [GraphTypes.WaterfallGraph]: () => {},
    [GraphTypes.ColumnGraph]: drawColumns,
    [GraphTypes.ScatterGraph]: () => {},
};

export type WaterfallGraph = Array<WaterfallPoint>
export type LineGraph = Array<Point>
export type ColumnGraph = Array<Column>
export type ScatterGraph = Array<Point>

// Graph Structural Descriptors
export interface GraphWrapper<T extends GraphTypes> {
    type: T,
    color: string,
    graph: GraphTypeMap[T]
}

export type Graphs = Map<ZIndex, GraphWrapper<GraphTypes>>

// Graph Content (the structures inside them)
export interface Point {
    x: number,
    y: number
}

export type WaterfallPoint = Point & {
    height: number
}

export type Column = Point & {
    width: number
}

export interface GraphData {
    graphs: Graphs,
    x_range: Range,
    y_range: Range,
    x_label?: string,
    y_label?: string
}

// GraphController
// I should probably change the space calculations to something else sometime
export class GraphController implements ReactiveController {
    context!: CanvasRenderingContext2D
    host: Graph; // apparantly this is also valid lmao
    graphs!: Graphs;
    x_range!: Range;
    y_range!: Range;
    x_label?: string;
    y_label?: string;
    graphBox!: Cuboid;

    constructor(host: Graph) {
        (this.host = host).addController(this);
    }

    // Binding to our host and our entry point to rendering. We dont really need any preparation work however: so we have empty shells to satisfy the Typescript compiler.
    hostConnected() {}
    hostDisconnected() {}

    setGraph(graph: GraphData) {
        this.graphs = graph?.graphs;
        this.x_range = graph?.x_range;
        this.y_range = graph?.y_range;
        this.x_label = graph?.x_label;
        this.y_label = graph?.y_label;
    }

    start(graph: GraphData) {
        this.setGraph(graph);
        this.context = this.host.canvas.getContext('2d') as CanvasRenderingContext2D

        const ctx = this.context;
        const dpr = window.devicePixelRatio || 1;
        const width = this.host.canvas.width / dpr;
        const height = this.host.canvas.height / dpr;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        this.graphBox = {
            x: 60,
            y: 0,
            width: width - 60,
            height: height - 40
        }

        this.render()
    }

    render() {
        const ctx = this.context;
        // if there is atleast one graph component, draw the whole ordeal
        if (this.graphs?.has(0)) {
            // we need to calculate our Range and our intervals.
            const x_entries: number = (this.x_range.end - this.x_range.start) // this is the AMOUNT of x entries that we have
            const y_entries: number = (this.y_range.end - this.y_range.start)
            const x_entries_scaled: number = x_entries * this.x_range.step // this is the absolute positioning of them relative to the zero-point
            const y_entries_scaled: number = y_entries * this.y_range.step

            this.drawGridLines(ctx, this.graphBox.width, this.graphBox.height, this.graphBox.x, this.graphBox.y, x_entries_scaled, y_entries_scaled);
            this.drawYAxis(ctx, this.graphBox.y, this.graphBox.height, this.y_range, this.y_label);
            this.drawXAxis(ctx, this.graphBox.x, this.graphBox.y, this.graphBox.width, this.graphBox.height, this.x_range, this.x_label);
        }
        // draw our graphs in order
        for (const graph of this?.graphs ?? []) {
            GraphRenderers[graph[1].type](ctx, graph[1] as never, this.graphBox, this.x_range, this.y_range);
        }
    }

    drawGridLines(ctx: CanvasRenderingContext2D, width: number, height: number, start_x: number, start_y: number, x_entries: number, y_entries: number) {
        // Draw grid
        ctx.strokeStyle = '#e3e3e3';
        ctx.lineWidth = 1;

        // we have a amount of Lines, now we need to stretch those over our stuff, so: define the whitespace per line.
        const absolute_x_interval = width / x_entries
        const absolute_y_interval = height / y_entries

        for (let i = 0; i <= width; i += absolute_x_interval) {
            ctx.beginPath();
            ctx.moveTo(i + start_x, start_y);
            ctx.lineTo(i + start_x, height + start_y);
            ctx.stroke();
        }
        for (let i = height; i >= -1; i -= absolute_y_interval) { // -1 als gekke fix
            ctx.beginPath();
            ctx.moveTo(start_x, i + start_y);
            ctx.lineTo(width + start_x, i + start_y);
            ctx.stroke();
        }
    }

    drawYAxis(ctx: CanvasRenderingContext2D, start_y: number, y_height: number, y_range: Range, label?: string) {
        // y_entries_scaled
        // calculate the amount of side entries we have, and the absolute interval (in pixels)
        const entries = (y_range.end - y_range.start) * y_range.step
        const absolute_y_interval = y_height / entries

        ctx.font = "14px 'Funnel Display'";
        ctx.fillStyle = "#000000";

        for (let i = entries; i >= 0; i -= 1) {
            const abs_pos = i * absolute_y_interval + 12 // calculate position, with a small offset to display the initial number
            // we need to find out what to display.
            ctx.fillText(`${(entries - i) * (1 / y_range.step) }`.substring(0, MAX_AXIS_LENGTH), 30, abs_pos)
        }

        // draw the label -> https://stackoverflow.com/questions/3167928/drawing-rotated-text-on-a-html5-canvas
        ctx.save();
        ctx.translate(10, y_height / 2 + start_y);
        ctx.rotate(-Math.PI/2);
        ctx.textAlign = 'center';
        ctx.fillText(label ? label : '', 0, 0);
        ctx.restore();
    }

    drawXAxis(ctx: CanvasRenderingContext2D, start_x: number, start_y: number, x_width: number, y_height: number, x_range: Range, label?: string) {
        // y_entries_scaled
        // calculate the amount of side entries we have, and the absolute interval (in pixels)
        const entries = (x_range.end - x_range.start) * x_range.step
        const absolute_x_interval = x_width / entries

        ctx.font = "14px 'Funnel Display'";
        ctx.fillStyle = "#000000";

        for (let i = entries; i >= 0; i -= 1) {
            const abs_pos = i * absolute_x_interval + start_x; // calculate position, with a small offset to display the initial number
            // we need to find out what to display.
            const text = `${i * (1 / x_range.step) }`.substring(0, MAX_AXIS_LENGTH);
            const text_in_pixels = ctx.measureText(text).width;
            ctx.fillText(text, abs_pos - text_in_pixels, y_height + 20);
        }

        // label
        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillText(label ? label : '', x_width / 2 + start_x, start_y + y_height + 40);
        ctx.restore();
    }

    drawLine(ctx: CanvasRenderingContext2D, graph: GraphWrapper<GraphTypes.LineGraph>, grid_width: number, grid_height: number, color: string, start_x: number, start_y: number, x_entries: number, y_entries: number) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.beginPath();

        const dataset = graph.graph

        // TODO: clamp dataset in the x_entries and y_entries thing
        // we need to do some point transformations to invert our view and to be correctly scaled.
        const transform_point = (point: Point) => {
            return {
                x:               point.x * (grid_width / x_entries) + start_x,
                y: grid_height - point.y * (grid_height / y_entries) + start_y
            } as Point // transformations: We invert the coordinate space, convert locasl space to global space and we apply our offsets
        }
        const base_point = transform_point(dataset[0])
        ctx.moveTo(base_point.x, base_point.y);
        for (let i = 1; i <= dataset.length - 1; i++) {
            const first = transform_point(dataset[i]);
            ctx.lineTo(first.x, first.y);
        }
        ctx.stroke();
    }
}

// TODO:
/*
I want to refactor this system eventually for more isolated logic and clarity: this is a clusterfuck and confusing mess of argument passing. With some extra interfaces idk which yet.
Also i want to centralize some mathematical calculations (wherever possible). And document the math.
*/

/*
    dataset: LineGraph = [
        {x: 0, y: 10},
        {x: 10, y: 30}
    ]
    x_range: Range = {
        start: 0,
        end: 24,
        step: 0.5
    }
    y_range: Range = {
        start: 0,
        end: 40,
        step: 0.05
    }
*/