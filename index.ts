import type * as HKT from "./hkt";

type NonFnObject<T> = T extends object ? (T extends (...args: never[]) => unknown ? never : T) : never;

export type Identity<T> = T extends (...args: infer A) => infer R
    ? (...args: A) => R
    : {
          [K in keyof T]: T[K] extends NonFnObject<T[K]> ? Identity<T[K]> : T[K];
      } & {};

export const id = <T>(value: T): Identity<T> => value as any;

/**
 * A type f is a Functor if it provides a function fmap which, given any types a and b lets you apply any function from (a -> b) to turn an f a into an f b, preserving the structure of f. Furthermore f needs to adhere to the following:
 *
 * **Identity**
 *
 * `fmap(id) == id`
 *
 * **Composition**
 *
 * `fmap(compose(f, g)) == compose(fmap(f), fmap(g))`
 */
export interface Functor<F extends HKT.Kind> extends HKT.Class<F> {
    /**
     * Applies a function to the contents of the functor.
     */
    fmap: <A, B>(f: (a: A) => B) => (fa: HKT.Type<F, A>) => HKT.Type<F, B>;
}

/**
 * Describes a structure intermediate between a functor and a monad
 * (technically, a strong lax monoidal functor). Compared with monads, this
 * interface lacks the full power of the `bind` operation, but it has more
 * instances and is sufficient for many uses.
 */
export interface Applicative<F extends HKT.Kind> extends Functor<F> {
    /**
     * Lifts a value into the structure.
     */
    pure<A>(a: A): HKT.Type<F, A>;
    /**
     * Sequential application.
     */
    apply: <A, B>(ff: HKT.Type<F, (a: A) => B>) => (fa: HKT.Type<F, A>) => HKT.Type<F, B>;
    /**
     * Lift a binary function to actions.
     */
    liftA2?: <A, B, C>(f: (a: A) => (b: B) => C) => (fa: HKT.Type<F, A>) => (fb: HKT.Type<F, B>) => HKT.Type<F, C>;
    /**
     * Sequence actions, discarding the value of the first argument.
     */
    applyRight?: <A, B>(fa: HKT.Type<F, A>) => (f: HKT.Type<F, B>) => HKT.Type<F, B>;
    /**
     * Sequence actions, discarding the value of the second argument.
     */
    applyLeft?: <A, B>(f: HKT.Type<F, A>) => (fb: HKT.Type<F, B>) => HKT.Type<F, A>;
}

/**
 * Represents a Monad, which is a type class that extends Applicative with return and bind operations.
 */
export interface Monad<M extends HKT.Kind> extends Applicative<M> {
    /**
     * Sequentially compose two actions, passing any value produced by the first
     * as an argument to the second.
     */
    bind: <A, B>(ma: HKT.Type<M, A>) => (f: (a: A) => HKT.Type<M, B>) => HKT.Type<M, B>;
    /**
     * Sequentially compose two actions, discarding any value produced by the
     * first.
     */
    then?: <A, B>(ma: HKT.Type<M, A>) => (mb: HKT.Type<M, B>) => HKT.Type<M, B>;
    /**
     * Inject a value into the monadic type.
     */
    return: Applicative<M>["pure"];
}

export function compose<T extends any[], R1, R2>(f: (arg: R1) => R2): (g: (...args: T) => R1) => (...args: T) => R2;
export function compose<T extends any[], R1, R2>(f: (arg: R1) => R2, g: (...args: T) => R1): (...args: T) => R2;
export function compose<T extends any[], R1, R2>(f: (arg: R1) => R2, g?: (...args: T) => R1) {
    if (g) {
        return (...args: T) => f(g(...args));
    }
    return (g: (...args: T) => R1) =>
        (...args: T) =>
            f(g(...args));
}
