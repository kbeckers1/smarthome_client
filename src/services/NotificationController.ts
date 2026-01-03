// description
import { html, css, LitElement, ReactiveController, ReactiveControllerHost, TemplateResult } from "lit"
import { Notification } from "../components/general/Notification"
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import {createContext} from '@lit/context';

// TODO:
// REALLY IMPORTANT!
// We get value shifts once popups are deleted, so actions might reference the wrong item, with all consequences part of it.

export interface NotificationWrapper {
    notification: Notification,
    id: number
}

export class NotificationController implements ReactiveController {
    host: ReactiveControllerHost;
    ordered_notifications: Array<Notification>
    notification_ownership: Map<number, Notification>

    constructor(host: ReactiveControllerHost, timeout = 1000) {
        (this.host = host).addController(this);
        this.ordered_notifications = [];
        this.notification_ownership = new Map();
    }

    // Binding to our host and our entry point to rendering. We dont really need any preparation work however: so we have empty shells to satisfy the Typescript compiler.
    hostConnected() {}
    hostDisconnected() {}

    // public interface for creating notifications, callbacks, etc.
    public notify(notification: Notification): number {
        // step 1: push to active_popups, find first index that is empty
        const keys = Array.from(this.notification_ownership.keys())
        const maxKey = keys.length ? Math.max(...keys) : 0;
        const firstMissing = keys.find(k => !this.notification_ownership.has(k)) ?? maxKey + 1;

        this.ordered_notifications.push(notification)
        this.notification_ownership.set(firstMissing, notification)

        // step 2: we create a promise that removes our 
        this.host.requestUpdate()
        new Promise((resolve) => {
            setTimeout(() => {
                this.dismiss(firstMissing); // 'this' is correct here
                console.log(this.notification_ownership)
                console.log(this.ordered_notifications)
            }, 3000);
        })
        return firstMissing;
    }

    public dismiss(ownership_id: number) {
        console.log('dismissed')
        const notification = this.notification_ownership.get(ownership_id);
        this.ordered_notifications.slice(
            this.ordered_notifications.findIndex(n => n === notification)
        );
        this.notification_ownership.delete(ownership_id)
        this.host.requestUpdate()
    }

    // We render our Notification UI via our custom Directive, accessible via the NotificationService Context Api.
    // We do not use a Directive class because we frankly don't need it. We just need to expose a renderer.
    _render(): TemplateResult {
        return html`
            <style>
                .notification_overlay {
                    display: block;
                    position: absolute;
                    top: 15px;
                    right: 0;
                    height: 100%;
                    width: 100%;
                    z-index: 100;
                    justify-content: right;
                    pointer-events: none;
                }
                .notification_overlay > .wrapper {
                    position: absolute; 
                    right: 15px; 
                }
                .notification_overlay > .wrapper > * {
                    position: relative; /* allows variable size naturally */
                    pointer-events: auto;
                    margin-bottom: 15px;
                }
            </style>
            ${when(
                this.ordered_notifications.length > 0,
                () => html`
                    <div class="notification_overlay">
                        <div class="wrapper">
                            ${repeat(
                                Object.entries(this.ordered_notifications), 
                                ([key, value]) => key, ([key, value]) => {
                                    return html`
                                        <gl-notification .shape=${value}></gl-notification>
                                    `
                                }
                            )}
                        </div>
                    </div>
                        `
            )}
        `
    }
}

export const notificationContext = createContext<NotificationController>('notificationController');