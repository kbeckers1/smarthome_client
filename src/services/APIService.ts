// description
import { html, css, LitElement, ReactiveController, ReactiveControllerHost, TemplateResult } from "lit"
import { Popup } from "../components/general/Popup";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import {createContext} from '@lit/context';

// This class controls our API state, provides API methods, and provides active auth state.

export class APIService implements ReactiveController {
    host: ReactiveControllerHost;

    constructor(host: ReactiveControllerHost, timeout = 1000) {
        (this.host = host).addController(this);
    }

    // Binding to our host and our entry point to rendering. We dont really need any preparation work however: so we have empty shells to satisfy the Typescript compiler.
    hostConnected() {}
    hostDisconnected() {}

    
    // methods
}

export const popupContext = createContext<APIService>('apiService');