import {expect} from "chai";
import {StateStore} from "../src";

describe('# StateStore', () => {
    it("changeEventHandler", () => {
        const stateStore = new StateStore<any>({a: 1});

        return new Promise((resolve, reject) => {
            stateStore.addChangeEvent((event, options) => {
                expect(event.newState).to.deep.equal({a: 2});
                expect(options).to.deep.equal({o: true});
                resolve();
            });

            stateStore.setState({a: 2}, {o: true});
        });
    });

    it("changeEventHandler + selector", () => {
        const stateStore = new StateStore<any>({a: 1});

        return new Promise((resolve, reject) => {
            stateStore.addChangeEvent((event, options) => {

                expect(event.preTarget).to.equal(1);
                expect(event.newTarget).to.equal(2);
                resolve();

            }, (state: any) => {
                return state.a;
            });

            stateStore.setState({a: 2});
        });
    });

    it("middleware", () => {
        const stateStore = new StateStore<any>({a: 1});

        stateStore.use((next) =>
            (event, options) => {

                const returnValue = next(event, options);
                returnValue.middleware = true;
                return returnValue;
            });

        const stateChangeEvent = stateStore.setState({
            a: 1,
            b: 2
        });

        expect(stateChangeEvent).to.deep.include({middleware: true});
        expect(stateStore.getState()).to.deep.equal({a: 1, b: 2});
    });
});

