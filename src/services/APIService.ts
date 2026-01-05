// description
import { html, css, LitElement, ReactiveController, ReactiveControllerHost, TemplateResult } from "lit"
import { Popup } from "../components/general/Popup";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import {createContext} from '@lit/context';
import { Dashboard } from "../pages/Dashboard";
import { Router } from "./RouterService";

// This class controls our API state, provides API methods, and provides active auth state.
export interface Request {
    Type: 'Get' | 'Post' | 'Put' | 'Delete', 
    Url: string,
    Body?: any,
    Headers?: Map<string, string>,
    Params?: URLSearchParams,
    Cookies?: any,
    Authorization: boolean,
    Catch: boolean
}

export class APIService implements ReactiveController {
    host: Dashboard;
    timeout: number;

    constructor(host: Dashboard, timeout = 5000) {
        (this.host = host).addController(this);
        this.timeout = timeout
    }

    // Binding to our host and our entry point to rendering. We dont really need any preparation work however: so we have empty shells to satisfy the Typescript compiler.
    hostConnected() {}
    hostDisconnected() {}

    // Wraps HTTPService, deals with errors and manages auth state.
    // Our T defines our expected data structure.
    async request<T = any>(req: Request): Promise<T | number> {
        try {
            // Build URL with query params
            const url = req.Params
                ? `${req.Url}?${req.Params.toString()}`
                : req.Url;

            // Build headers object from Map if provided
            const headers: Record<string, string> = {};
            if (req.Headers) {
                req.Headers.forEach((value, key) => (headers[key] = value));
            }

            // Set JSON header automatically if body exists
            let body: string | undefined;
            if (req.Body != null && req.Type !== 'Get') {
                body = JSON.stringify(req.Body);
                headers['Content-Type'] = headers['Content-Type'] || 'application/json';
            }

            // Wrap fetch in a timeout promise
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                method: req.Type,
                headers,
                body,
                signal: controller.signal,
                credentials: req.Cookies ? 'include' : 'same-origin',
            });

            clearTimeout(timeoutId);

            // Handle HTTP errors
            if (!response.ok) {
                if (req.Catch === true) {
                    this.handleHttpError(response);
                }
                return response.status;
            }

            // Try to parse JSON response
            const contentType = response.headers.get('Content-Type') || '';
            if (contentType.includes('application/json')) {
                return (await response.json()) as T;
            } else {
                return (await response.text()) as unknown as T;
            }
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') {
                this.host.notificationController.value.notify({
                    style: 'default',
                    title: 'Request timed out'
                });
                return 418; // I'm a teapot
            }
            this.host.notificationController.value.notify({
                style: 'default',
                title: 'Unknown network error'
            });
        }
    }

    private async handleHttpError(response: Response): Promise<void> {
        const text = await response.text().catch(() => '');
        switch (response.status) {
            case 401: // Unauthorized
                this.host.notificationController.value.notify({
                    style: 'default',
                    title: 'Session expired; please reauthenticate.'
                });
                Router.route(6);
                break;
            case 403: // Forbidden
                this.host.notificationController.value.notify({
                    style: 'default',
                    title: 'You are not allowed to access this resource.'
                });
                Router.route(6);
                break;
            case 500: // Server error
                this.host.notificationController.value.notify({
                    style: 'default',
                    title: 'Internal Server Error'
                });
                Router.route(6);
                break;
            default:
                this.host.notificationController.value.notify({
                    style: 'default',
                    title: `${response.status} Server Error`
                });
                Router.route(6);
                break;
        }
    }
}

export const apiContext = createContext<APIService>('apiService');

// api service structure:
/*
First layer: HTTPService
Then also an AuthManager
The APIService exposes simplified methods for fetching varying forms of data. A wrapper around the HTTPService.
While it does that, an API request also goes through the AuthManager. The AuthManager has authority to manipulate the state of our Webapp (Authenticated true/false)
APIService also wraps our Cache stores.

*/