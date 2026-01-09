// model for login & logout flows
// model for logout flows provides an entry point for Buttons to callback into. Then we generate a Popup, ask for confirmation, and then continue the flow as is needed.
// Buttons can directly import this model, however I recommend using the Context API to pass it down as needed.

import { html } from "lit/static-html.js";
import { Popup } from "../../components/general/Popup";
import { PopupController } from "../PopupController";
import { BaseFlow } from "./BaseFlow";
import { Router } from "../RouterService"
import { AuthService, Result } from "../AuthService";
import { NotificationController } from "../NotificationController";
import { APIService } from "../APIService";

// actually the buttons should make a new Class because its technically a flow
export class LogAllOut extends BaseFlow {
    controller: PopupController
    controller_id?: number
    api: APIService
    notification: NotificationController
    target_id: number
    private resolve?: (v?: any) => void
    promise: Promise<any>;

    constructor(controller: PopupController, api: APIService, notification: NotificationController, target_id: number) {
        super()
        this.api = api;
        this.controller = controller;
        this.notification = notification;
        this.target_id = target_id;
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
        })
        return this;
    }

    async start() {
        const id = this.controller.notify(this.popup);
        this.controller_id = id;
        return await this.promise;
    }

    // so we need to maintain a Promise in this class. 
    // Start awaits it.
    // Confirm resolves it, cancel aswell.

    async confirm() {
        // additional logic
        if (this.controller_id !== undefined) {
            this.controller.dismiss(this.controller_id);

            // api logic
            const result = await this.api.revoke_account_access(this.target_id);
            this.resolve?.(); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
            if (result === Result.Success) {
                this.notification.notify({
                    style: 'default',
                    description: 'Succesvol alle sessies van deze gebruiker opgezegd.'
                })
            } else {
                this.notification.notify({
                    style: 'red',
                    description: 'Er ging iets mis met het opzeggen van de sessies van deze gebruiker.'
                })
            }
        }
    }

    cancel() {
        if (this.controller_id !== undefined) {
            this.resolve?.(); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
            this.controller.dismiss(this.controller_id);
        }
    }

    popup: Popup = {
        width: '400px',
        title: {
            icon: "",
            content: "Deze gebruiker uitloggen?"
        },
        body: html`<md-richtext>Dit zal de sessies van deze gebruikers direct stopzetten.</md-richtext>`,
        button_bar: [
            {
                icon: "/public/home.svg",
                callback: () => this.confirm(),
                title: "Log uit",
                type: "Red",
                disabled: false
            },
            {
                icon: "",
                callback: () => this.cancel(),
                title: "Annuleren",
                type: "Secondary",
                disabled: false
            }
        ]
    }
}