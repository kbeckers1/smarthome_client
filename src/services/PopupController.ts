// description
import { html, css, LitElement, ReactiveController, ReactiveControllerHost, TemplateResult } from "lit"
import { Popup } from "../components/general/Popup";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import {createContext} from '@lit/context';

// TODO:
// REALLY IMPORTANT!
// We get value shifts once popups are deleted, so actions might reference the wrong item, with all consequences part of it.

export class PopupController implements ReactiveController {
    host: ReactiveControllerHost;
    active_popups: Array<Popup>

    constructor(host: ReactiveControllerHost, timeout = 1000) {
        (this.host = host).addController(this);
        this.active_popups = []
    }

    // Binding to our host and our entry point to rendering. We dont really need any preparation work however: so we have empty shells to satisfy the Typescript compiler.
    hostConnected() {}
    hostDisconnected() {}

    // public interface for creating notifications, callbacks, etc.
    public notify(popup: Popup): number {
        // step 1: push to active_popups
        this.active_popups.push(popup)
        this.host.requestUpdate()
        return 0;
    }

    public dismiss(popup_id: number) {
        this.active_popups.splice(popup_id, 1)
        this.host.requestUpdate()
    }

    // We render our Notification UI via our custom Directive, accessible via the NotificationService Context Api.
    // We do not use a Directive class because we frankly don't need it. We just need to expose a renderer.
    _render(): TemplateResult {
        return html`
            <style>
                .overlay {
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    background-color: rgba(0, 0, 0, 0.6);
                    z-index: 200;
                    justify-content: center;
                }
                .overlay > .wrapper {
                   position: absolute; 
                   left: 50%; 
                   top: 50%; 
                   transform: translate(-50%, calc(-50% - 100px));
                }
                .overlay > .wrapper > * {
                    position: relative; /* allows variable size naturally */
                    pointer-events: auto;
                }
            </style>
            ${when(
                this.active_popups.length > 0,
                () => html`
                    <div class="overlay">
                        ${repeat(
                            Object.entries(this.active_popups), 
                            ([key, value]) => key, ([key, value]) => {
                                return html`
                                    <div class="wrapper">
                                        <gl-popup-surface .shape=${value}></gl-popup-surface>
                                    </div>
                                `
                            }
                        )}
                    </div>
                        `
            )}
        `
    }
}

export const popupContext = createContext<PopupController>('popupController');