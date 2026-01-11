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
    predictedTrend: Store<number[]> = new Store([] as number[]);
    trendlineCoeffs: Store<{slope: number, offset: number} | null> = new Store(null);
    // per-device aggregated energy + cost store: { [apparaat_id]: { totalEnergyKwh, totalCost } }
    deviceEnergy: Store<Record<number, { totalEnergyKwh: number, totalCost: number }>> = new Store({});
    fetchTime!: Date;
    private devicesUnsub?: () => void;
    private overThreshold: boolean = false;
    private readonly THRESHOLD_WATTS = 8.5;


    constructor(host: Dashboard, timeout = 5000) {
        (this.host = host).addController(this);
        this.timeout = timeout
    }

    // Binding to our host and our entry point to rendering. We dont really need any preparation work however: so we have empty shells to satisfy the Typescript compiler.
    hostConnected() {
        // subscribe to device store changes to monitor total watt usage
        this.devicesUnsub = this.devices.subscribe((state) => {
            try {
                const devices = state as Record<number, Device>;
                const total = Object.values(devices).reduce((s, d) => s + (Number((d as any)?.huidig_verbruik) || 0), 0);
                console.log('updated')
                if (total > this.THRESHOLD_WATTS && !this.overThreshold) {
                    console.log('h')
                    this.host.notificationController.value.notify({
                        style: 'red',
                        title: 'Hoog energieverbruik',
                        description: `Huidig verbruik ${ (total).toFixed(2)} kW — bovengrens ${ (this.THRESHOLD_WATTS).toFixed(2)} kW`
                    });
                    this.overThreshold = true;
                } else if (total <= this.THRESHOLD_WATTS && this.overThreshold) {
                    this.overThreshold = false;
                }
            } catch (e) {
                // ignore
            }
        });
    }

    hostDisconnected() {
        if (this.devicesUnsub) this.devicesUnsub();
    }
    
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
            this.fetch_weather_data(),
            this.fetch_trendline()
        ])
        console.log('Data retrieval finished')
    }

    async fetch_trendline() {
        const res = await this.request<any>({
            Url: "http://localhost:5000/api/predictions/trendline",
            Catch: false,
            Type: "GET",
            Authorization: true,
        })
        if (!res.success) {
            console.warn('fetch_trendline failed', res.message)
            return;
        }

        const data = res.data;

        // if backend returned coefficients
        if (data && typeof data.slope === 'number' && typeof data.offset === 'number') {
            this.trendlineCoeffs.set({ slope: data.slope, offset: data.offset });
            const feature = typeof data.feature === 'string' ? data.feature : null;

            // Only apply coefficients to temperature series when backend used outside temperature
            if (feature === 'Buitentemperatuur (C)') {
                try {
                    const temps = await this.fetch_temperature_24h_hourly();
                    const temps15 = this.interpolateTo15Min(temps);
                    const predicted = this.applyTrendlineToTemps(temps15, data.slope, data.offset);
                    this.predictedTrend.set(predicted);
                } catch (e) {
                    console.warn('failed computing predicted trend from coeffs', e);
                }
            } else {
                // backend used some other feature; frontend doesn't have that series, so clear predictedTrend
                console.warn('trendline feature is not temperature:', feature);
                this.predictedTrend.set([]);
            }
            return;
        }

        // unknown format
        console.warn('fetch_trendline: unknown response format', data);
    }

    // Fetch hourly temperature forecast for next 24 hours (returns array of 25 hourly samples covering 24h span)
    async fetch_temperature_24h_hourly(): Promise<number[]> {
        const res = await this.request<any>({
            Url: "https://api.open-meteo.com/v1/forecast",
            Catch: false,
            Type: "GET",
            Authorization: false,
            Params: new URLSearchParams({
                latitude: '52.0908',
                longitude: '5.1222',
                hourly: 'temperature_2m',
                forecast_days: '1',
                timezone: 'Europe/Amsterdam'
            })
        });

        if (!res.success) throw new Error('weather fetch failed');

        const hourly = (res.data ?? {}).hourly ?? {};
        const temps: number[] = (hourly.temperature_2m ?? []) as number[];

        if (!temps || temps.length < 2) throw new Error('insufficient hourly temps');

        if (temps.length < 25) {
            const last = temps[temps.length - 1];
            while (temps.length < 25) temps.push(last);
        }
        return temps.slice(0, 25);
    }

    // Interpolate hourly samples to 15-minute resolution (96 samples)
    interpolateTo15Min(hourlyTemps: number[]): number[] {
        // hourlyTemps expected length >= 25 spanning 24h with hourly steps
        const result: number[] = [];
        for (let i = 0; i < 96; i++) {
            const t = i / 4; // hours from start
            const lo = Math.floor(t);
            const hi = Math.min(lo + 1, hourlyTemps.length - 1);
            const frac = t - lo;
            const val = hourlyTemps[lo] * (1 - frac) + hourlyTemps[hi] * frac;
            result.push(val);
        }
        return result;
    }

    // Apply linear trendline (y = slope * x + intercept) to an array of temperatures
    applyTrendlineToTemps(temps15: number[], slope: number, intercept: number): number[] {
        return temps15.map(t => slope * t + intercept);
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
        // fetch energy summary for each device asynchronously (non-blocking)
        Object.keys(map).forEach(id => {
            const nid = Number(id);
            this.fetch_device_energy(nid).catch(() => {});
        });
        // set here
        return Result.Success;
    }

    // Fetch energy for a single device and update the deviceEnergy store
    async fetch_device_energy(apparaat_id: number) {
        try {
            const end = new Date();
            const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
            const res = await this.fetch_energy_intervals({ apparaat_id, start: start.toISOString(), end: end.toISOString(), interval: 60 });
            if (!res) return null;
            const total = (res.buckets || []).reduce((s, b) => s + (b.energy_kwh || 0), 0);
            const tariff = 0.30; // EUR / kWh; make configurable later
            const cost = total * tariff;
            const prev = this.deviceEnergy.value || {};
            this.deviceEnergy.set({ ...(prev as any), [apparaat_id]: { totalEnergyKwh: total, totalCost: cost } });
            return { totalEnergyKwh: total, totalCost: cost };
        } catch (e) {
            return null;
        }
    }

    // Fetch aggregated energy intervals for a device or whole system
    async fetch_energy_intervals(params: { apparaat_id?: number, start?: string, end?: string, interval?: number }) {
        const q = new URLSearchParams();
        if (params.apparaat_id != null) q.append('apparaat_id', String(params.apparaat_id));
        if (params.start) q.append('start', params.start);
        if (params.end) q.append('end', params.end);
        if (params.interval) q.append('interval', String(params.interval));

        const res = await this.request<{ buckets: Array<{ start: string, end: string, energy_kwh: number, avg_kw?: number }> }>({
            Url: "http://localhost:5000/api/energy/intervals",
            Catch: false,
            Type: "GET",
            Authorization: true,
            Params: q
        });

        if (!res.success) return null;
        return res.data as { buckets: Array<{ start: string, end: string, energy_kwh: number, avg_kw?: number }> };
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