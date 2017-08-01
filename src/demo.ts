import {StateStore} from "./index";
import {Middleware} from "./middleware/Middleware";

const stateStore = new StateStore<any>({a: 1});

const middleware = new Middleware<StateStore<any>>(stateStore);

const logger = (stateStore: StateStore<any>) =>     //target
    (next: Function) =>   // next
        (newState: any) => { // setState Function signature
            console.log("pre", stateStore.getState());
            const resultValue = next(newState);
            console.log("new", stateStore.getState());
            return resultValue;
        };

middleware.use({
    setState: logger
});


stateStore.onChange((selectedValue, preSelectedValue) => {
    console.log("change a: ", `${preSelectedValue} -> ${selectedValue}`);
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