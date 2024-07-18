export function compose<T extends any[], R1, R2>(
    f: (arg: R1) => R2,
): (g: (...args: T) => R1) => (...args: T) => R2;
export function compose<T extends any[], R1, R2>(
    f: (arg: R1) => R2,
    g: (...args: T) => R1,
): (...args: T) => R2;
export function compose<T extends any[], R1, R2>(
    f: (arg: R1) => R2,
    g?: (...args: T) => R1,
) {
    if (g) {
        return (...args: T) => f(g(...args));
    }
    return (g: (...args: T) => R1) =>
        (...args: T) =>
            f(g(...args));
}
