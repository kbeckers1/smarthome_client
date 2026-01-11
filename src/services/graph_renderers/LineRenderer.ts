import { Cuboid, GraphTypes, GraphWrapper, Range, Point } from "../GraphController";

export function drawLine(ctx: CanvasRenderingContext2D, graph: GraphWrapper<GraphTypes.LineGraph>, graphBox: Cuboid, x_range: Range, y_range: Range) {
    ctx.strokeStyle = graph.color;
    ctx.lineWidth = 5;
    ctx.beginPath();

    const dataset = graph.graph;

    // compute x entries (hours) used for scaling
    const x_entries = (x_range.end - x_range.start);
    const y_entries = (y_range.end - y_range.start);

    const transform_point = (point: Point) => {
        return {
            x: point.x * (graphBox.width / x_entries) + graphBox.x,
            y: graphBox.height - (point.y * (graphBox.height / y_entries)) + graphBox.y
        } as Point
    }

    if (dataset.length === 0) return;

    const base = transform_point(dataset[0]);
    ctx.moveTo(base.x, base.y);
    for (let i = 1; i < dataset.length; i++) {
        const p = transform_point(dataset[i]);
        ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
}
