// description
import { html, css, LitElement, ReactiveController, ReactiveControllerHost, TemplateResult } from "lit"
import { Popup } from "../components/general/Popup";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import {createContext} from '@lit/context';
import { Dashboard } from "../pages/Dashboard";
import { Router } from "./RouterService";
import { Store } from "./GlobalState";
import { Result } from "./AuthService";

// data structures
export interface Device {
    naam: string,
    kamer: string,
    huidig_verbruik: number,
    actief: boolean,
    apparaat_id: number,
    beheerd: boolean
}
export interface Account {
    gebruiker_id: number,
    naam: string,
    email: string,
    sessies: number
}

// This class controls our API state, provides API methods, and provides active auth state.
export interface Request {
    Type: 'GET' | 'POST' | 'PUT' | 'DELETE', 
    Url: string,
    Body?: any,
    Headers?: Map<string, string>,
    Params?: URLSearchParams,
    Cookies?: any,
    Authorization: boolean,
    Catch: boolean
}

export interface ApiResponse<T = any> {
    success: boolean;
    error_code?: number;
    message?: string;
    data?: T;
}

export class APIService implements ReactiveController {
    host: Dashboard;
    timeout: number;

    devices:  Store<Record<number, Device>>  = new Store({});
    accounts: Store<Record<number, Account>> = new Store({});
    me:       Store<Record<number, Account>> = new Store({});
    innerTemp: Store<number> = new Store(0);
    outerTemp: Store<number> = new Store(0);
    humidity: Store<number> = new Store(0);
    fetchTime!: Date;


    constructor(host: Dashboard, timeout = 5000) {
        (this.host = host).addController(this);
        this.timeout = timeout
    }

    // Binding to our host and our entry point to rendering. We dont really need any preparation work however: so we have empty shells to satisfy the Typescript compiler.
    hostConnected() {}
    hostDisconnected() {}
    
    // Wraps HTTPService, deals with errors and manages auth state.
    // Our T defines our expected data structure.
    async request<T = any>(req: Request): Promise<ApiResponse<T>> {
        try {
            // Build URL with query params
            const params = req.Params ? req.Params : new URLSearchParams()
            params.append('token', this.host.authService.value.token)
            const url =  `${req.Url}?${params.toString()}`

            // Build headers object from Map if provided
            const headers: Record<string, string> = {};
            if (req.Headers) {
                req.Headers.forEach((value, key) => (headers[key] = value));
            }

            // Set JSON header automatically if body exists
            let body: string | undefined;
            if (req.Body != null && req.Type !== 'GET') {
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
                const text = await response.text().catch(() => '');
                if (req.Catch === true) {
                    this.handleHttpError(response);
                }
                return { success: false, error_code: response.status, message: text };
            }

            // Try to parse JSON response
            const contentType = response.headers.get('Content-Type') || '';
            if (contentType.includes('application/json')) {
                const parsed = (await response.json()) as T;
                return { success: true, data: parsed };
            } else {
                const txt = (await response.text()) as unknown as T;
                return { success: true, data: txt };
            }
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') {
                this.host.notificationController.value.notify({
                    style: 'red',
                    description: 'Request timed out'
                });
                return { success: false, error_code: 418, message: "I'm a teapot" };
            }
            this.host.notificationController.value.notify({
                style: 'red',
                description: 'Unknown network error'
            });
            return { success: false, error_code: 100, message: 'Unknown network error' };
        }
    }

    private async handleHttpError(response: Response): Promise<void> {
        const text = await response.text().catch(() => '');
        switch (response.status) {
            case 401: // Unauthorized
                this.host.notificationController.value.notify({
                    style: 'red',
                    description: 'Session expired; please reauthenticate.'
                });
                break;
            case 403: // Forbidden
                this.host.notificationController.value.notify({
                    style: 'red',
                    description: 'You are not allowed to access this resource.'
                });
                break;
            case 500: // Server error
                this.host.notificationController.value.notify({
                    style: 'red',
                    description: 'Internal Server Error'
                });
                break;
            default:
                this.host.notificationController.value.notify({
                    style: 'red',
                    description: `${response.status} Server Error`
                });
                break;
        }
        this.host.authService.value.deauthenticate()
    }

    // Execute the first time population happens.
    // It wouldve been better if we had a hierarchical state machine. But i'm short on time.
    async initial_population() {
        // fetch & commit data for each of our buckets/stores in paralell.
        await Promise.all([
            this.fetch_devices(),
            this.fetch_accounts(),
            this.fetch_me(),
            this.fetch_weather_data()
        ])
        console.log('Data retrieval finished')
    }

    async fetch_devices() {
        // fetch devices
        const res = await this.request<Array<Device & { status?: unknown }>>({
            Url: "http://localhost:5000/api/devices",
            Catch: false,
            Type: "GET",
            Authorization: true,
        })
        if (!res.success) {
            this.host.notificationController.value.notify({
                style: 'red',
                description: 'Error fetching data'
            })
            return Result.Fail
        }
        const dataArray = (res.data || []) as Array<Device & { status?: unknown }>;
        const data: Omit<Device, "status">[] = dataArray.map(({ status, ...rest }) => rest);
        // convert array to id->device map for the Store
        const map = Object.fromEntries(data.map((d) => [d.apparaat_id, d] as [number, Omit<Device, "status">])) as Record<number, Omit<Device, "status">>;
        this.devices.set(map);
        // set here
        return Result.Success;
    }

    async fetch_accounts() {
        const res = await this.request<Array<Account>>({
            Url: "http://localhost:5000/api/users",
            Catch: false,
            Type: "GET",
            Authorization: true,
        })
        if (!res.success) {
            this.host.notificationController.value.notify({
                style: 'red',
                description: 'Error fetching data'
            })
            return Result.Fail
        }
        // normalize response to an array (may be undefined) and convert to id->account map
        const dataArray = (res.data ?? []) as Array<Account>;
        const map = Object.fromEntries(
            dataArray.map((d) => [d.gebruiker_id, d] as [number, Account])
        ) as Record<number, Account>;
        this.accounts.set(map);
        return Result.Success;
    }

    async fetch_me() {
        const res = await this.request<Account>({
            Url: "http://localhost:5000/api/me",
            Catch: false,
            Type: "GET",
            Authorization: true,
        })
        if (!res.success) {
            this.host.notificationController.value.notify({
                style: 'red',
                description: 'Error fetching data'
            })
            return Result.Fail
        }

        const d = res.data as Account | undefined
        if (!d) return Result.Fail

        // store under the user's id
        this.me.set({ 0: d } as Record<number, Account>)
        return Result.Success
    }

    async revoke_account_access(id: number) {
        const req: Request = {
            Authorization: true,
            Catch: false,
            Type: "POST",
            Url: "http://localhost:5000/api/revoke",
            Params: new URLSearchParams({
                "user_id": String(id),
            })
        }
        const res = await this.request(req)
        if (res.success) {
            // Mutate data store
            // mutate device store: update single device by id
            await Promise.all([
                this.fetch_accounts(),
                this.fetch_me()
            ])
            return Result.Success
        } else {
            return Result.Fail
        }
    }

    async toggle_device(id: number, target_state: boolean): Promise<Result> {
        // First we make an API request
        // did it succeed?
        //      -> modify local data store
        //      -> exit with Result.Success
        // did it not succeed?
        //      -> exit with Result.Fail

        // make request
        const req: Request = {
            Authorization: true,
            Catch: false,
            Type: "POST",
            Url: "http://localhost:5000/api/devices/toggle",
            Body: {
                "apparaat_id": id,
                "gewenste_status": target_state // invert our is_active
            }
        }
        const res = await this.request(req)
        if (res.success) {
            return Result.Success
        } else {
            return Result.Fail
        }
    }

    async fetch_weather_data() {
        const current_data = await this.request<any>({
            Url: "https://api.open-meteo.com/v1/forecast",
            Catch: false,
            Type: "GET",
            Authorization: false,
            Params: new URLSearchParams({
                latitude: '52.0908',
                longitude: '5.1222',
                current: 'temperature_2m,relative_humidity_2m'
            })
        });
        const data = (current_data?.data ?? {})["current"];
        this.outerTemp.set(data['temperature_2m']);
        this.humidity.set(data['relative_humidity_2m']);
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