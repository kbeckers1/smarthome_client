// A Directive to enforce a specific state during an asynchronous task.
export async function Wrap<T, F extends (...args: any[]) => any>(
    managed_object: T,
    before: (obj: T) => void, 
    after: (obj: T) => void,
    during: F,
    ...passed_object: Parameters<F>
) {
    await before(managed_object);
    try { await during(...passed_object) } catch (e) {}
    await after(managed_object);
}