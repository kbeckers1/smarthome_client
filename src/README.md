# Directory Shape
We follow the Model - View - Controller pattern.
See: https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller

We use Lit's WebComponents: it serves the same purpose as Tkinter: composing a UI together. The benefit of Lit is that it is fundamentally composable:
"Components" are reusable in every way, while being scoped to themselves. That way we can spawn hundreds of popups, surfaces, buttons, etc, while all of them remain
fully isolated from each other.

In the MVC pattern, Lit occupies and manages the View segment.
THe other two segments: Controller and Model, we manage ourselves.

Our folder structure follows the MVC pattern + Lit's views:
1. Components -> (MVC -> View) Reusable Building blocks
2. Layouts    -> (MVC -> View) Utility/helpers to create dynamic layouts
3. Pages      -> (MVC -> View) Used for our Router. Self explanatory.
4. Models     ->  MVC -> Model segment
5. Services   ->  MVC -> Controller segment


okay, so. the point is: MVC model. The Model needs a global reference. We do that via app-root. However we're supposed to be dynamic and shit.