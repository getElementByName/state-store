import {expect} from "chai";
import {Middleware} from "../src/middleware";

describe('# Middleware', () => {
    it('go()', () => {
        const middleware = new Middleware();
        middleware.use((next) => (arg1: number, arg2: number) => {
            return {arg1, arg2, execute: true};
        });

        const returnValue = middleware.go(1, 2);

        expect(returnValue).to.deep.equal({arg1: 1, arg2: 2, execute: true});
    });

    it('use() - change args & return values', () => {
        const middleware = new Middleware();

        middleware.use((next: Function) => (arg1: number, arg2: number) => {
            return {arg1, arg2, execute: true};
        });

        middleware.use((next) => (arg1: number, arg2: number) => {
            arg1++;
            const returnValue = next(arg1, arg2);  // 아래 middleware 로 이동
            returnValue.middleware = 1;
            return returnValue;
        });

        middleware.use((next) => (arg1: number, arg2: number) => {
            arg1 *= 2;
            const returnValue = next(arg1, arg2);
            returnValue.middleware = 2;
            return returnValue;
        });


        const returnValue = middleware.go(1, 2);
        expect(returnValue).to.deep.equal({arg1: 3, arg2: 2, execute: true, middleware: 2});
    });
})
;