import {StateStore} from "../";

const stateStore = new StateStore<any>({a: 1});

stateStore.addChangeEvent((selectedValue, preSelectedValue) => {
    console.log("change a: ", `${preSelectedValue} -> ${selectedValue}`);
}, (state: any) => {
    return state.a;
});

stateStore.use((next) =>
    (newState: any, preState: any) => {
        console.log("middleware", newState);
        const returnValue =  next(newState, preState);
        returnValue.middle = "add";
        return returnValue;
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
