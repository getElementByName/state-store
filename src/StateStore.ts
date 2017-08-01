interface ChangeHandlerInterface {
    (newState: any, preState: any): void;
}


class StateStore<StateType> {
    handlerList: ChangeHandlerInterface[];

    state: StateType;

    constructor(initState: StateType) {
        this.handlerList = [];

        this.state = initState;
    }

    onChange(handler: ChangeHandlerInterface, selector?: Function) {
        let wrappedHandler: ChangeHandlerInterface;
        if (selector) {
            wrappedHandler = (newState: any, preState: any) => {
                const newTarget = selector(newState);
                const preTarget = selector(preState);
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

    setState(state: StateType): StateType {
        const preState = this.state;
        const newState = state;
        this.state = newState;

        const handlerList = this.handlerList;
        for (let i = 0; i < handlerList.length; i++) {
            const nowHandler = handlerList[i];
            nowHandler(newState, preState);
        }
        return newState;
    }


    getState() : StateType{
        return this.state;
    }
}

export {StateStore};