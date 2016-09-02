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
                   line: 4,
                   character: 2
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
                    line: 5,
                    character: 6
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
                    line: 3,
                    character: 6
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