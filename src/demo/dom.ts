import {StateStore, StateChangeEvent} from "../";

const rootElement = document.querySelector("._bx");
const inputElement1 = <HTMLInputElement>rootElement.querySelector("._input1");
const inputElement2 = <HTMLInputElement>rootElement.querySelector("._input2");
const textElement = rootElement.querySelector("._text");

interface StateType {
    text: string
}

const stateStore = new StateStore<StateType>({text: ""});

function addChangeValueEventHandler(inputElement: HTMLInputElement) {
    inputElement.addEventListener("keyup", (e: Event) => {
        const valueString = inputElement.value;
        stateStore.setState({
            text: valueString
        }, {
            src: inputElement
        });
    });
}
addChangeValueEventHandler(inputElement1);
addChangeValueEventHandler(inputElement2);

stateStore.addChangeEvent((newText: string) => {
    inputElement1.value = newText;
    inputElement2.value = newText;
    textElement.innerHTML = newText;
}, (state: any) => {
    return state.text
});


const loggerMiddleware = (next: Function) => (event: StateChangeEvent<StateType>, options?: any) => {
    console.log("[BEFORE LOGGER]", stateStore.getState());
    next(event, options);
    console.log("[LOGGER]", stateStore.getState());
    console.log("[LOGGER - options]", options);
};

const persist = new eg.Persist("input_text");
const persistMiddleware = (next: Function) => (event: StateChangeEvent<StateType>, options?: any) => {
    next(event, options);
    persist.set("", event.newState);
};

declare const eg: any;

stateStore.use(loggerMiddleware);
stateStore.use(persistMiddleware);

const persistState: StateType = <StateType>persist.get("");
persistState && stateStore.setState(persistState, {src: persist});