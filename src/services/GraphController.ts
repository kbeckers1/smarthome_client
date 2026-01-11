// description
import { html, css, LitElement, ReactiveController, ReactiveControllerHost, TemplateResult } from "lit"
import { Popup } from "../components/general/Popup";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import {createContext} from '@lit/context';
import { Graph } from "../components/advanced/Graph";
import { drawColumns } from "./graph_renderers/ColumnRenderer";
import { drawLine } from "./graph_renderers/LineRenderer";

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
    [GraphTypes.LineGraph]: drawLine,
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
            // calculate spans and intervals using the original intended semantics:
            // tick spacing (in units) = 1 / step (so step=0.25 -> tick every 4 units)
            const x_span = this.x_range.end - this.x_range.start;
            const y_span = this.y_range.end - this.y_range.start;
            const x_tickSpacing = this.x_range.step > 0 ? 1 / this.x_range.step : x_span;
            const y_tickSpacing = this.y_range.step > 0 ? 1 / this.y_range.step : y_span;
            const x_intervals = Math.max(1, Math.round(x_span / x_tickSpacing));
            const y_intervals = Math.max(1, Math.round(y_span / y_tickSpacing));

            this.drawGridLines(ctx, this.graphBox.width, this.graphBox.height, this.graphBox.x, this.graphBox.y, x_intervals, y_intervals);
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

        // compute pixel spacing for grid lines using tick counts
        const absolute_x_interval = width / x_entries;
        const absolute_y_interval = height / y_entries;

        for (let i = 0; i <= x_entries; i++) {
            const px = i * absolute_x_interval;
            ctx.beginPath();
            ctx.moveTo(px + start_x, start_y);
            ctx.lineTo(px + start_x, height + start_y);
            ctx.stroke();
        }
        for (let j = 0; j <= y_entries; j++) {
            const py = height - j * absolute_y_interval;
            ctx.beginPath();
            ctx.moveTo(start_x, py + start_y);
            ctx.lineTo(width + start_x, py + start_y);
            ctx.stroke();
        }
    }

    drawYAxis(ctx: CanvasRenderingContext2D, start_y: number, y_height: number, y_range: Range, label?: string) {
        // compute tick spacing as reciprocal of step (matches prior behaviour)
        const tickSpacing = y_range.step > 0 ? 1 / y_range.step : (y_range.end - y_range.start);
        const intervals = Math.max(1, Math.round((y_range.end - y_range.start) / tickSpacing));
        const absolute_y_interval = y_height / intervals;

        ctx.font = "14px 'Funnel Display'";
        ctx.fillStyle = "#000000";

        // draw labels from top to bottom
        for (let i = 0; i <= intervals; i++) {
            const labelValue = (y_range.start + (intervals - i) * tickSpacing);
            const abs_pos = i * absolute_y_interval + 12; // top offset
            ctx.fillText(`${labelValue}`.substring(0, MAX_AXIS_LENGTH), 30, abs_pos);
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
        // compute tick spacing as reciprocal of step (so step=0.25 -> tick every 4 units)
        const x_tickSpacing = x_range.step > 0 ? 1 / x_range.step : (x_range.end - x_range.start);
        const x_intervals = Math.max(1, Math.round((x_range.end - x_range.start) / x_tickSpacing));
        const absolute_x_interval = x_width / x_intervals;

        ctx.font = "14px 'Funnel Display'";
        ctx.fillStyle = "#000000";

        ctx.save();
        ctx.textAlign = 'right';
        for (let i = 0; i <= x_intervals; i++) {
            const abs_pos = i * absolute_x_interval + start_x;
            const textValue = (x_range.start + i * x_tickSpacing).toString();
            ctx.fillText(textValue, abs_pos, y_height + 20);
        }
        ctx.restore();

        // label
        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillText(label ? label : '', x_width / 2 + start_x, start_y + y_height + 40);
        ctx.restore();
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
*/