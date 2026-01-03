// dashboard router
// routes between Home, Plattegrond, Apparaten, Sensoren, Weersvoorspelling & Account.
// single source of truth for all our routes.
import { Signal, signal } from '@lit-labs/signals';

export interface Route {
    vanityName: string,
    iconPath: string,
    pageSelector: string,
    show: boolean
}

export const Routes: Record<number, Route> = {
    0: {vanityName: "Home",              iconPath: "/public/home.svg",    pageSelector: "ly-home", show: true},
    1: {vanityName: "Plattegrond",       iconPath: "/public/layout.svg",  pageSelector: "ly-layout", show: true},
    2: {vanityName: "Apparaten",         iconPath: "/public/devices.svg", pageSelector: "ly-devices", show: true},
    3: {vanityName: "Sensoren",          iconPath: "/public/sensors.svg", pageSelector: "ly-sensors", show: true},
    4: {vanityName: "Weersvoorspelling", iconPath: "/public/weather.svg", pageSelector: "ly-predictions", show: true},
    5: {vanityName: "Account",           iconPath: "/public/account.svg", pageSelector: "ly-account", show: true},
    6: {vanityName: "Auth",              iconPath: "/public/account.svg", pageSelector: "ly-auth", show: false}
}

// only changes the active Route.
class _Router {
    public state = signal(0)

    route(route: number) {
        this.state.set(route)
        // Notify interested components that the route changed
        try {
            window.dispatchEvent(new CustomEvent('route-changed', { detail: route }));
        } catch (e) {
            console.warn('Could not dispatch route-changed event', e);
        }
    };
}

export const Router = new _Router()