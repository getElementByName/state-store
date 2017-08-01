import {StateStore} from "./index";
import {Middleware} from "./Middleware";

const stateStore = new StateStore<any>({a: 1});

const middleware = new Middleware<StateStore<any>>(stateStore);
middleware.use({
    setState: (stateStore: StateStore<any>) => {
        return (next) => {
            return (newState: any) => {
                console.log("pre", stateStore.getState());
                const resultValue = next(newState);
                console.log("new", stateStore.getState());
                return resultValue;
            }
        }
    }
});



stateStore.onChange((newState) => {
    console.log("change a", newState);
}, (state: any) => {
    return state.a;
});

const setStateReturn = stateStore.setState({
    a: 1,
    b: 2
});

console.log("return", setStateReturn);

stateStore.setState({
    a: 1,
    b: 3
});

stateStore.setState({
    a: 2,
    b: 3
});