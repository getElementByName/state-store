import {compose} from "./util";

interface MiddlewareCallback {
    (next: Function): (...args: any[]) => any;
}


class Middleware {
    executor: Function;
    middlewareList: Function[];

    constructor(executor: Function) {
        this.executor = executor;
        this.middlewareList = [];
    }

    use(middlewareCallback: MiddlewareCallback) {
        this.middlewareList.push(middlewareCallback);
    }

    go(...args: any[]) {
        // TODO: use에서 합성하고 실행은 바로
        return compose(...this.middlewareList)((...args: any[]) => {
            return this.executor(...args);  // bind
        })(...args);
    }
}

export {Middleware, MiddlewareCallback};