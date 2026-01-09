import { Cuboid, GraphTypes, GraphWrapper, Range } from "../GraphController";

export function drawColumns(ctx: CanvasRenderingContext2D, graph: GraphWrapper<GraphTypes.ColumnGraph>, graphBox: Cuboid, x_range: Range, y_range: Range) {
        for (let i = 0; i <= graph.graph.length - 1; i++) {
            // calculate relative space
            const column = graph.graph[i];

            const start_x = column.x - (column.width / 2);
            const end_x   = column.x + (column.width / 2);
            const start_y = column.y;
            const baseline_y = graphBox.y + graphBox.height;

            // transform all that to absolute space
            // we calculate spacing between our entries first, do it times our entry, that gets us the absolute position relative to the canvasgrid. Then we offset it to be absolute in the canvas.
            const x_entries = (x_range.end - x_range.start);
            const abs_start_x = start_x * (graphBox.width / x_entries) + graphBox.x;
            const abs_end_x   = end_x   * (graphBox.width / x_entries) + graphBox.x;
            const abs_start_y = -1 * (start_y * (graphBox.height / (y_range.end - y_range.start))) // same thing as before, but negative for our inverted view
            const width = abs_end_x - abs_start_x;

            ctx.fillStyle = graph.color;
            ctx.fillRect(abs_start_x, baseline_y, width, abs_start_y);
        };
    }