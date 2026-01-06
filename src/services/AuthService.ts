// description
import { html, css, LitElement, ReactiveController, ReactiveControllerHost, TemplateResult } from "lit"
import { Popup } from "../components/general/Popup";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import {createContext} from '@lit/context';
import { APIService } from "./APIService";
import { Dashboard } from "../pages/Dashboard";
import { Router } from "./RouterService";

// TODO:
// REALLY IMPORTANT!
// We get value shifts once popups are deleted, so actions might reference the wrong item, with all consequences part of it.

export enum Result {
    Success = 0,
    Fail = 1
}

export class AuthService {
    host: Dashboard
    api: APIService;
    token!: string;
    authenticated: boolean; 

    constructor(host: Dashboard) {
        this.host = host;
        this.api = host.apiService.value
        this.authenticated = false;
    }

    // here we create new tokens and we manage token deregistration
    async generate_token(username: string, password: string): Promise<Result> {
        const res = await this.api.request({
            Url: "http://localhost:5000/api/login",
            Catch: false,
            Type: "POST",
            Authorization: false,
            Body: {
                naam: username,
                wachtwoord: password
            }
        })
        if (typeof res === "number") {
            this.host.notificationController.value.notify({
                style: 'red',
                description: 'Incorrect username or password.'
            })
            return Result.Fail
        }
        this.authenticated = true;
        this.token = res['token'];
        return Result.Success;
    }

    // used for deregistering & logging out: then calls deauthenticate to route to the login page and reset our token.
    // Intentional methods and unintentional methods call this
    deauthenticate() {
        const temp_token = this.token; // maintain token in the current scope
        this.authenticated = false;
        this.token = '';
        this.host.notificationController.value.notify({
                style: 'default',
                description: 'Logged out'
        })
        Router.route(6)

        // deregistering of our token happens lazily
        const res = this.api.request({
            Url: "http://localhost:5000/api/logout",
            Catch: false,
            Type: "POST",
            Authorization: false,
            Params: new URLSearchParams({
                token: temp_token
            })
        })
    }
}

export const authContext = createContext<AuthService>('authController');