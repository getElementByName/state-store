import {compose} from "./util";

interface MiddlewareCallback<ExecuteFunctionInterface extends Function>{
    (next: Function): ExecuteFunctionInterface;
}

class Middleware <ExecuteFunctionInterface extends Function>{
    executor: ExecuteFunctionInterface;

    constructor() {
        (<any>this.executor) = () => {};
    }

    use(middlewareCallback: MiddlewareCallback<ExecuteFunctionInterface>) {
        this.executor = ((stack) => {
            return middlewareCallback(stack);
        })(this.executor);
    }

    // TODO: ExecuteFunctionInterface로 signature 맞추기
    go(...args: any[]) {
        return (<any>this.executor)(...args);
    }
}

export {Middleware, MiddlewareCallback};