import {Middleware, MiddlewareCallback} from "./middleware";

interface ChangeHandlerInterface {
    (newState: any, preState: any): void;
}


class StateChangeEvent<StateType>{
    constructor(public newState: StateType, public preState: StateType){

    }
}

class StateStore<StateType> {
    private handlerList: ChangeHandlerInterface[];
    private middleware: Middleware;

    private state: StateType;

    constructor(initState: StateType) {
        this.handlerList = [];

        this.state = initState;
        this.middleware = new Middleware((event: StateChangeEvent<StateType>, options?:any) => {
            return this.onChange(event, options);
        });
    }

    addChangeEvent(handler: ChangeHandlerInterface, selector?: Function) {
        let wrappedHandler: ChangeHandlerInterface;
        if (selector) {
            wrappedHandler = (event: StateChangeEvent<StateType>, options?:any) => {
                const newTarget = selector(event.newState);
                const preTarget = selector(event.preState);
                if (newTarget !== preTarget) {
                    handler(newTarget, preTarget);
                }
            }
        } else {
            wrappedHandler = handler;
        }

        this.handlerList.push(wrappedHandler);
    }

    // TODO: mixin
    setState(state: StateType, options?: any): StateType {
        const preState = this.state;
        const newState = state;
        this.state = newState;

        const newEvent = new StateChangeEvent<StateType>(newState, preState);
        return this.middleware.go(newEvent, options);
    }

    private onChange(event: StateChangeEvent<StateType>, options?:any) {
        const handlerList = this.handlerList;
        for (let i = 0; i < handlerList.length; i++) {
            const nowHandler = handlerList[i];
            nowHandler(event, options);
        }
        return event;
    }


    getState(): StateType {
        return this.state;
    }

    use(middlewareCallback: MiddlewareCallback){
        this.middleware.use(middlewareCallback);
    }
}

export {StateStore, StateChangeEvent};