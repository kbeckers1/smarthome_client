// model for login & logout flows
// model for logout flows provides an entry point for Buttons to callback into. Then we generate a Popup, ask for confirmation, and then continue the flow as is needed.
// Buttons can directly import this model, however I recommend using the Context API to pass it down as needed.

import { html } from "lit/static-html.js";
import { Popup } from "../../components/general/Popup";
import { PopupController } from "../PopupController";
import { BaseFlow } from "./BaseFlow";
import { Router } from "../RouterService"
import { AuthService, Result } from "../AuthService";
import { APIService } from "../APIService";
import { HomeLayout } from "../../pages/views/full_frame/Home";
import { NotificationController } from "../NotificationController";
import { Notification } from "../../components/general/Notification";

// actually the buttons should make a new Class because its technically a flow
export class ToggleDevice extends BaseFlow {
    controller: NotificationController
    controller_id?: number
    api: APIService

    constructor(controller: NotificationController, api: APIService) {
        super()
        this.api = api;
        this.controller = controller;
        return this;
    }

    async start(id: number, now_active: boolean) {
        const target_state = !now_active;
        const result = await this.api.toggle_device(id, target_state);
        if (result === Result.Success) {
            // mutate device store: update single device by id
            const devices = this.api.devices.value;
            const current = devices[id];
            if (current) {
                const updated = { ...current, actief: target_state };
                this.api.devices.set({ [id]: updated });
            }

            // succeeded
            this.controller.notify(this.success_notification);
        } else {
            this.controller.notify(this.error_notification);
        }
    }

    toggling_notification: Notification = {
        style: 'default',
        description: 'Toggling device'
    }
    error_notification: Notification = {
        style: 'red',
        description: 'Failed to toggle device'
    }
    success_notification: Notification = {
        style: 'default',
        description: 'Succesfully toggled device!'
    }
}