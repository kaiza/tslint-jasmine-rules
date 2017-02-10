import {assertFailure, assertSuccess} from './lintAssertions';

describe('no focused tests rule', () => {
    describe('focused describe', () => {
        it('should fail when fdescribe at the top level', () => {
          let source = `
fdescribe('my test', () => {
    it('should do stuff', () => {
    });
});
            `;
           assertFailure('no-focused-tests', source, {
               message: 'Focused test (fit or fdescribe)',
               startPosition: {
                   line: 1,
                   character: 0
               },
               endPosition: {
                   line: 1,
                   character: 9
               }
           }, ['camelCase', 'ng']);
        });

        it('should fail when nested fdescribe', () => {
            let source = `
describe('my test', () => {
    fdescribe('something', () => {
        it('should do stuff', () => {
        });
    });
});
            `;
            assertFailure('no-focused-tests', source, {
                message: 'Focused test (fit or fdescribe)',
                startPosition: {
                    line: 2,
                    character: 4
                },
                endPosition: {
                    line: 2,
                    character: 13
                }
            }, ['camelCase', 'ng']);
        });
    });

    describe('focused test', () => {
        it('should fail when fit present', () => {
            let source = `
describe('my test', () => {
    fit('should do stuff', () => {
    });
});
            `;
            assertFailure('no-focused-tests', source, {
                message: 'Focused test (fit or fdescribe)',
                startPosition: {
                    line: 2,
                    character: 4
                },
                endPosition: {
                    line: 2,
                    character: 7
                }
            }, ['camelCase', 'ng']);
        });
    });

    describe('no focused describes or tests', () => {
       it('should pass when no fdescribe or fit present', () => {
           let source = `
describe('my test', () => {
    it('should do stuff', () => {
    });
});
            `;
           assertSuccess('no-focused-tests', source, ['camelCase', 'ng']);
       });
    });
});