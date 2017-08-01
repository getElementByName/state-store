// https://gist.github.com/unbug/dd596d79b5eace7d245f0a4db6cd2be5

function reduceRight(list: any[], callback: Function, initialValue?: any) {
    const length = list.length;

    let result = initialValue;
    for (let i = length - 1; i >= 0; i--) {
        result = callback(result, list[i]);
    }
    return result;
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
function compose(...funcs: Function[]) {
    if (funcs.length === 0) {
        return (arg: any) => arg;
    }

    if (funcs.length === 1) {
        return funcs[0];
    }

    const last = funcs[funcs.length - 1];
    const rest = funcs.slice(0, -1);
    return (...args: any[]) => {
        return reduceRight(rest, (composedReturn: any, f: Function) => f(composedReturn), last(...args));
    }
}


interface MiddlewareCallbackInterface<TargetType> {
    (next: Function): any;
}


interface MiddlewareInterface<TargetType> {
    (target: TargetType): MiddlewareCallbackInterface<TargetType>;
}

class Middleware<TargetType> {
    target: TargetType;
    originalMethodTable: {[propName: string]: Function};
    middlewareMethodTable: {[propName: string]: MiddlewareCallbackInterface<TargetType>[]};

    /**
     * @param {object} target The target object.
     * @return {object} this
     */
    constructor(target: TargetType) {
        this.target = target;
        this.originalMethodTable = {};
        this.middlewareMethodTable = {};
    }

    private applyToMethod(methodName: string, middleware: MiddlewareInterface<TargetType>) {
        let method = (<any>this.originalMethodTable)[methodName] || (<any>this.target)[methodName];

        this.originalMethodTable[methodName] = method;
        if (this.middlewareMethodTable[methodName] === undefined) {
            this.middlewareMethodTable[methodName] = [];
        }

        this.middlewareMethodTable[methodName].push(middleware(this.target));

        (<any>this.target)[methodName] = compose(...this.middlewareMethodTable[methodName])((...args: any[]) => {
            return method.call(this.target, ...args);  // bind
        });
    }

    use(methodTableObject: {[propName: string]: MiddlewareInterface<TargetType>}): this;
    use(methodName: string, middleware: MiddlewareInterface<TargetType>): this;
    /**
     * Apply (register) middleware functions to the target function or apply (register) middleware objects.
     * If the first argument is a middleware object, the rest arguments must be middleware objects.
     *
     * @param {string|object} methodName String for target function name, object for a middleware object.
     * @param {function} middleware? The middleware chain to be applied.
     * @return {object} this
     */
    use(methodName: string|{[propName: string]: MiddlewareInterface<TargetType>}, middleware?: MiddlewareInterface<TargetType>) {
        if (typeof methodName === 'object') {
            for (let propName in methodName) {
                let nowMiddleware = methodName[propName];
                this.applyToMethod(propName, nowMiddleware);
            }
        } else {
            this.applyToMethod(<string>methodName, middleware);
        }

        return this;
    }
}

export {Middleware};
