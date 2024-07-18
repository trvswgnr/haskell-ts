import type * as HKT from "./hkt";
import type { Identity as _Identity } from "./identity";
import type { Maybe as _Maybe } from "./maybe";
import type { Functor as _Functor } from "./functor";
import type { Applicative as _Applicative } from "./applicative";
import type { Monad as _Monad } from "./monad";

export interface Identity extends HKT.Kind {
    readonly type: _Identity<this["In"]>;
}
export interface Functor<F extends HKT.Kind> extends HKT.Kind {
    readonly type: _Functor<F>;
}
export interface Applicative<F extends HKT.Kind> extends HKT.Kind {
    readonly type: _Applicative<F>;
}
export interface Monad<F extends HKT.Kind> extends HKT.Kind {
    readonly type: _Monad<F>;
}
export interface Maybe extends HKT.Kind {
    readonly type: _Maybe<this["In"]>;
}
export interface Array extends HKT.Kind {
    readonly type: globalThis.Array<this["In"]>;
}
