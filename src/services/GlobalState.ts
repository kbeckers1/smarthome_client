import { ReactiveController, ReactiveControllerHost } from 'lit';

type Unsubscribe = () => void;

type MaybePartial<T> = T extends object ? Partial<T> : T;

export class Store<T = Record<string, any>> extends EventTarget {
  private _state: T;

  constructor(initial: T) {
    super();
    this._state = initial;
  }

  get value(): T {
    return this._state;
  }

  set(patch: MaybePartial<T>) {
    // If both current state and patch are objects, do a shallow merge.
    if (typeof this._state === 'object' && this._state !== null && typeof patch === 'object' && patch !== null) {
      this._state = { ...(this._state as any), ...(patch as any) } as T;
    } else {
      // For primitives (number, boolean, string, etc.) or non-object patches, replace directly.
      this._state = patch as T;
    }

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

export class StoreConsumer<T = Record<string, any>> implements ReactiveController {
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

  set(updates: MaybePartial<T>) {
    this.store.set(updates);
  }
}

export default globalState;
