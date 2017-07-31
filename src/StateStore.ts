interface ChangeHandlerInterface{
    (newState: any, preState: any): void;
}

interface MiddlewareInterface<StateType>{
    (next: (state:StateType)=> StateType): any;
}


class StateStore<StateType>{
    handlerList: ChangeHandlerInterface[];

    state: StateType;

    constructor(initState: StateType) {
        this.handlerList = [];
        this.state = initState;
    }

    onChange(handler: ChangeHandlerInterface, selector?: Function){
        let warppedHandler: ChangeHandlerInterface;
        if(selector){
            warppedHandler = (newState: any, preState: any)=>{
                const newTarget = selector(newState);
                const preTarget = selector(preState);
                if(newTarget !== preTarget){
                    handler(newTarget, preTarget);
                }
            }
        } else {
            warppedHandler = handler;
        }

        this.handlerList.push(warppedHandler);
    }

    // TODO: mixin

    
    setState(state: StateType): any{
        const preState = this.state;
        const newState = state;
        this.state = newState;

        // TODO: middleware

        const handlerList = this.handlerList;
        for(let i=0; i<handlerList.length; i++){
            const nowHandler = handlerList[i];
            nowHandler(newState, preState);
        }
    }
}

export {StateStore};