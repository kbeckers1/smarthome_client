// model for login & logout flows
// model for logout flows provides an entry point for Buttons to callback into. Then we generate a Popup, ask for confirmation, and then continue the flow as is needed.
// Buttons can directly import this model, however I recommend using the Context API to pass it down as needed.

import { html } from "lit/static-html.js";
import { Popup } from "../../components/general/Popup";
import { PopupController } from "../PopupController";
import { BaseFlow } from "./BaseFlow";
import { Router } from "../RouterService"
import { AuthService } from "../AuthService";

// actually the buttons should make a new Class because its technically a flow
export class LogOut extends BaseFlow {
    controller: PopupController
    controller_id?: number
    auth: AuthService

    constructor(controller: PopupController, auth: AuthService) {
        super()
        this.auth = auth;
        this.controller = controller;
        return this;
    }

    start() {
        const id = this.controller.notify(this.popup);
        this.controller_id = id;
    }

    confirm() {
        // additional logic
        if (this.controller_id !== undefined) {
            this.controller.dismiss(this.controller_id);
            this.auth.deauthenticate()
        }
    }

    cancel() {
        if (this.controller_id !== undefined) {
            this.controller.dismiss(this.controller_id);
        }
    }

    popup: Popup = {
        width: '400px',
        title: {
            icon: "",
            content: "Logout"
        },
        button_bar: [
            {
                icon: "/public/home.svg",
                callback: () => this.confirm(),
                title: "Log out",
                type: "Red",
                disabled: false
            },
            {
                icon: "",
                callback: () => this.cancel(),
                title: "Cancel",
                type: "Secondary",
                disabled: false
            }
        ]
    }
}