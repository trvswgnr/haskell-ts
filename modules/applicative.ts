import type * as HKT from "./hkt";
import type { Functor } from "./functor";

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
    apply: <A, B>(
        ff: HKT.Type<F, (a: A) => B>,
    ) => (fa: HKT.Type<F, A>) => HKT.Type<F, B>;
    /**
     * Lift a binary function to actions.
     */
    liftA2?: <A, B, C>(
        f: (a: A) => (b: B) => C,
    ) => (fa: HKT.Type<F, A>) => (fb: HKT.Type<F, B>) => HKT.Type<F, C>;
    /**
     * Sequence actions, discarding the value of the first argument.
     */
    applyRight?: <A, B>(
        fa: HKT.Type<F, A>,
    ) => (f: HKT.Type<F, B>) => HKT.Type<F, B>;
    /**
     * Sequence actions, discarding the value of the second argument.
     */
    applyLeft?: <A, B>(
        f: HKT.Type<F, A>,
    ) => (fb: HKT.Type<F, B>) => HKT.Type<F, A>;
}
