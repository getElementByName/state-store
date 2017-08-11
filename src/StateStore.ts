import {Middleware, MiddlewareCallback} from "./middleware";

interface ChangeHandlerInterface<StateType> {
    (event: StateChangeEvent<StateType>, options?: any): void;
}

class StateChangeEvent<StateType> {
    newTarget?: any;
    preTarget?: any;

    constructor(public newState: StateType, public preState: StateType) {
    }
}

class StateStore<StateType> {
    private handlerList: ChangeHandlerInterface<StateType>[];
    private middleware: Middleware<ChangeHandlerInterface<StateType>>;

    private state: StateType;

    constructor(initState: StateType) {
        this.handlerList = [];

        this.state = initState;
        this.middleware = new Middleware();
        this.middleware.use((next) => (event: StateChangeEvent<StateType>, options?: any) => {
            return this.onChange(event, options);
        });
    }

    addChangeEvent(handler: ChangeHandlerInterface<StateType>, selector?: Function) {
        let wrappedHandler: ChangeHandlerInterface<StateType>;
        if (selector) {
            wrappedHandler = (event: StateChangeEvent<StateType>, options?: any) => {
                const newTarget = selector(event.newState);
                const preTarget = selector(event.preState);
                if (newTarget !== preTarget) {
                    const selectedEvent = new StateChangeEvent(event.newState, event.preState);
                    selectedEvent.newTarget = newTarget;
                    selectedEvent.preTarget = preTarget;
                    handler(selectedEvent, options);
                }
            }
        } else {
            wrappedHandler = handler;
        }

        this.handlerList.push(wrappedHandler);
    }

    // TODO: mixin
    setState(state: StateType, options?: any): StateChangeEvent<StateType> {
        const preState = this.state;
        const newState = state;

        const newEvent = new StateChangeEvent<StateType>(newState, preState);
        return this.middleware.go(newEvent, options);
    }

    private onChange(event: StateChangeEvent<StateType>, options?: any) {
        this.state = event.newState;

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

    use(middlewareCallback: MiddlewareCallback<ChangeHandlerInterface<StateType>>) {
        this.middleware.use(middlewareCallback);
    }
}

export {StateStore, StateChangeEvent};