import { Maybe } from "./maybe";
import { compose } from "..";
import { id } from "./identity";
import { describe, test, expect } from "bun:test";

describe("Maybe", () => {
    describe("Functor laws", () => {
        test("Identity: `fmap id = id`", () => {
            // Test with Just value
            {
                const v = Maybe.just(5);
                const l = Maybe.fmap(id)(v);
                const r = id(v);
                expect(l).toEqual(r);
            }

            // Test with Nothing value
            {
                const v = Maybe.nothing<number>();
                const l = Maybe.fmap(id)(v);
                const r = id(v);
                expect(l).toEqual(r);
            }
        });

        test("Composition: `fmap (f . g) = fmap f . fmap g`", () => {
            const f = (x: number) => x * 2;
            const g = (x: number) => x + 1;

            // Test with Just value
            {
                const v = Maybe.just(5);
                const l = Maybe.fmap(compose(f, g))(v);
                const r = compose(Maybe.fmap(f), Maybe.fmap(g))(v);
                expect(l).toEqual(r);
            }

            // Test with Nothing value
            {
                const v = Maybe.nothing<number>();
                const l = Maybe.fmap(compose(f, g))(v);
                const r = compose(Maybe.fmap(f), Maybe.fmap(g))(v);
                expect(l).toEqual(r);
            }

            // Additional test with different functions
            {
                const v = Maybe.just(5);
                const h = (x: number) => x.toString();
                const l = Maybe.fmap(compose(h, compose(f, g)))(v);
                const r = compose(
                    Maybe.fmap(h),
                    compose(Maybe.fmap(f))(Maybe.fmap(g)),
                )(v);
                expect(l).toEqual(r);
            }
        });
    });

    describe("Applicative", () => {
        test("Identity: `pure id <*> v = v`", () => {
            // Test with Just value
            {
                const v = Maybe.just(5);
                const l = Maybe.apply(Maybe.pure(id<number>))(v);
                const r = v;
                expect(l).toEqual(r);
            }

            // Test with Nothing value
            {
                const v = Maybe.nothing<number>();
                const l = Maybe.apply(Maybe.pure(id<number>))(v);
                const r = v;
                expect(l).toEqual(r);
            }
        });

        test("Composition: `pure (.) <*> u <*> v <*> w = u <*> (v <*> w)`", () => {
            const u = Maybe.just((x: number) => x * 2);
            const v = Maybe.just((x: number) => x + 1);
            const w = Maybe.just(5);

            const compose =
                (f: (b: number) => number) =>
                (g: (a: number) => number) =>
                (x: number) =>
                    f(g(x));
            const l = Maybe.apply(
                Maybe.apply(Maybe.apply(Maybe.pure(compose))(u))(v),
            )(w);
            const r = Maybe.apply(u)(Maybe.apply(v)(w));

            expect(l).toEqual(r);

            // Test with Nothing values
            const nothingU = Maybe.nothing<(x: number) => number>();
            const nothingV = Maybe.nothing<(x: number) => number>();
            const nothingW = Maybe.nothing<number>();

            expect(
                Maybe.apply(
                    Maybe.apply(Maybe.apply(Maybe.pure(compose))(nothingU))(v),
                )(w),
            ).toEqual(Maybe.apply(nothingU)(Maybe.apply(v)(w)));
            expect(
                Maybe.apply(
                    Maybe.apply(Maybe.apply(Maybe.pure(compose))(u))(nothingV),
                )(w),
            ).toEqual(Maybe.apply(u)(Maybe.apply(nothingV)(w)));
            expect(
                Maybe.apply(
                    Maybe.apply(Maybe.apply(Maybe.pure(compose))(u))(v),
                )(nothingW),
            ).toEqual(Maybe.apply(u)(Maybe.apply(v)(nothingW)));
        });

        test("Homomorphism: `pure f <*> pure x = pure (f x)`", () => {
            const f = (x: number) => x * 2;
            const x = 5;

            {
                const l = Maybe.apply(Maybe.pure(f))(Maybe.pure(x));
                const r = Maybe.pure(f(x));
                expect(l).toEqual(r);
            }

            // Test with different function and value
            const g = (s: string) => s.length;
            const y = "hello darkness my old friend";

            {
                const l = Maybe.apply(Maybe.pure(g))(Maybe.pure(y));
                const r = Maybe.pure(g(y));

                expect(l).toEqual(r);
            }
        });

        test("Interchange: `u <*> pure y = pure ($ y) <*> u`", () => {
            // Test with Just value
            {
                const u = Maybe.just((x: number) => x * 2);
                const y = 5;
                const $y = (f: (x: number) => number) => f(y);
                const l = Maybe.apply(u)(Maybe.pure(y));
                const r = Maybe.apply(Maybe.pure($y))(u);
                expect(l).toEqual(r);
            }

            // Test with Nothing value
            {
                const u = Maybe.nothing<(x: number) => number>();
                const y = 5;
                const $y = (f: (x: number) => number) => f(y);
                const l = Maybe.apply(u)(Maybe.pure(y));
                const r = Maybe.apply(Maybe.pure($y))(u);
                expect(l).toEqual(r);
            }

            // Test with different function and value
            {
                const u = Maybe.just((s: string) => s.length);
                const y = "hello darkness my old friend";
                const $y = (f: (s: string) => number) => f(y);
                const l = Maybe.apply(u)(Maybe.pure(y));
                const r = Maybe.apply(Maybe.pure($y))(u);
                expect(l).toEqual(r);
            }
        });
    });
});
