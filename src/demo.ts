import {StateStore} from "./index";

const stateStore = new StateStore<any>({a:1});




stateStore.onChange((newState)=>{
    console.log(newState);
}, (state: any)=>{
    return state.a;
});

stateStore.setState({
    a:1,
    b:2
});

stateStore.setState({
    a:1,
    b:3
});

stateStore.setState({
    a:2,
    b:3
});