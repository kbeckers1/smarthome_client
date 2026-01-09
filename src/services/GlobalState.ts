import { ReactiveController, ReactiveControllerHost } from 'lit';

type Unsubscribe = () => void;

export class Store<T extends Record<string, any> = Record<string, any>> extends EventTarget {
  private _state: T;

  constructor(initial: T) {
    super();
    this._state = initial;
  }

  get value(): T {
    return this._state;
  }

  set(patch: Partial<T>) {
    this._state = { ...this._state, ...patch } as T;
    this.dispatchEvent(new CustomEvent('change', { detail: this._state }));
  }
  
  subscribe(callback: (state: T) => void): Unsubscribe {
    const handler = ((e: Event) => callback((e as CustomEvent).detail)) as EventListener;
    this.addEventListener('change', handler);

    // call immediately so subscribers synchronize to current state
    callback(this._state);
    return () => this.removeEventListener('change', handler);
  }
}

export const globalState = new Store<Record<string, any>>({});

export class StoreConsumer<T extends Record<string, any> = Record<string, any>> implements ReactiveController {
  private host: ReactiveControllerHost;
  private store: Store<T>;
  private unsub?: Unsubscribe;

  constructor(host: ReactiveControllerHost, store: Store<T>) {
    this.host = host;
    this.store = store;
    this.host.addController(this);
  }

  hostConnected(): void {
    this.unsub = this.store.subscribe(() => this.host.requestUpdate());
  }

  hostDisconnected(): void {
    if (this.unsub) this.unsub();
  }

  get state(): T {
    return this.store.value;
  }

  set(updates: Partial<T>) {
    this.store.set(updates);
  }
}

export default globalState;
