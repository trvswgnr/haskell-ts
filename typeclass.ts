import type * as FP from ".";
import type * as HKT from "./hkt";
import type * as MaybeModule from "./maybe";

export interface Identity extends HKT.Kind {
    readonly type: FP.Identity<this["In"]>;
}
export interface Functor<F extends HKT.Kind> extends HKT.Kind {
    readonly type: FP.Functor<F>;
}
export interface Applicative<F extends HKT.Kind> extends HKT.Kind {
    readonly type: FP.Applicative<F>;
}
export interface Monad<F extends HKT.Kind> extends HKT.Kind {
    readonly type: FP.Monad<F>;
}
export interface MaybeStatic extends HKT.Kind {
    readonly type: MaybeModule.Maybe<this["In"]>;
}
export interface Array extends HKT.Kind {
    readonly type: globalThis.Array<this["In"]>;
}
