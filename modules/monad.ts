import type * as HKT from "./hkt";
import type { Applicative } from "./applicative";

/**
 * Represents a Monad, which is a type class that extends Applicative with
 * return and bind operations.
 */
export interface Monad<M extends HKT.Kind> extends Applicative<M> {
    /**
     * Sequentially compose two actions, passing any value produced by the first
     * as an argument to the second.
     */
    bind: <A, B>(
        ma: HKT.Type<M, A>,
    ) => (f: (a: A) => HKT.Type<M, B>) => HKT.Type<M, B>;
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
