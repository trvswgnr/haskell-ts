import type { Monad } from "./monad";
import type * as TypeClass from "./typeclass";

export type Just<A> = {
    readonly variant: "Just";
    readonly value: A;
};

export type Nothing = {
    readonly variant: "Nothing";
};

export type Maybe<A> = Just<A> | Nothing;

export const Maybe = class {
    static just<A>(value: A): Maybe<A> {
        return { variant: "Just", value };
    }
    static nothing<A>(): Maybe<A> {
        return { variant: "Nothing" };
    }

    static pure<A>(a: A): Maybe<A> {
        return { variant: "Just", value: a };
    }
    static return<A>(a: A): Maybe<A> {
        return { variant: "Just", value: a };
    }
    static apply<A, B>(f: Maybe<(a: A) => B>): (self: Maybe<A>) => Maybe<B> {
        return (self) => {
            if (self.variant === "Nothing" || f.variant === "Nothing") {
                return Maybe.nothing();
            }
            return Maybe.just(f.value(self.value));
        };
    }
    static bind<A, B>(ma: Maybe<A>): (f: (a: A) => Maybe<B>) => Maybe<B> {
        return (f) => (ma.variant === "Just" ? f(ma.value) : Maybe.nothing());
    }
    static fmap<A, B>(f: (a: A) => B): (self: Maybe<A>) => Maybe<B> {
        return (self) =>
            self.variant === "Just"
                ? Maybe.just(f(self.value))
                : Maybe.nothing();
    }
} satisfies Monad<TypeClass.Maybe>;
