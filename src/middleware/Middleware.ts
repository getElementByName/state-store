// https://gist.github.com/unbug/dd596d79b5eace7d245f0a4db6cd2be5
import {compose} from "./util";


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
