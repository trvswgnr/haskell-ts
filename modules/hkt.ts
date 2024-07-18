export type ContravariantOp<In> = (_: In) => void;
export type CovariantOp<Out> = () => Out;
export type InvariantOp<T> = (_: T) => T;

export interface Kind {
    /**
     * `In` is contravariant, meaning it can be used for operations that can
     * accept an input that is wider than the original type.
     */
    readonly In: unknown;
    /**
     * `Out1` is covariant, meaning it can be used for operations that return a
     * result that is narrower than the original type.
     */
    readonly Out1: unknown;
    /**
     * `Out2` is covariant, meaning it can be used for operations that return a
     * result that is narrower than the original type.
     */
    readonly Out2: unknown;
    /**
     * `Target` is invariant, meaning it can be used for operations that do not
     * change the type of the input or output.
     */
    readonly Target: unknown;
}

export type Type<
    F extends Kind,
    In = never,
    Out1 = never,
    Out2 = never,
    Target = never,
> = F extends {
    readonly type: unknown;
}
    ? (F & {
          readonly In: In;
          readonly Out1: Out1;
          readonly Out2: Out2;
          readonly Target: Target;
      })["type"]
    : {
          readonly F: F;
          readonly In: ContravariantOp<In>;
          readonly Out1: CovariantOp<Out1>;
          readonly Out2: CovariantOp<Out2>;
          readonly Target: InvariantOp<Target>;
      };

export declare const KIND: unique symbol;

export interface Class<F extends Kind> {
    readonly [KIND]?: F;
}
