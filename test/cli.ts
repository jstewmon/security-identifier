import anyTest, { ExecutionContext, TestInterface } from 'ava';
import sinon, { SinonSpy } from 'sinon';
import * as cli from '../src/cli';

interface ITestContext {
  consoleLog: SinonSpy;
  consoleError: SinonSpy;
  processExit: SinonSpy;
}

const test = anyTest as TestInterface<ITestContext>;

test.serial.beforeEach((t) => {
  t.context.consoleLog = sinon.stub(console, 'log').returns();
  t.context.consoleError = sinon.stub(console, 'error').returns();
  t.context.processExit = sinon.stub(process, 'exit').callsFake((() => {
    return void 0;
  }) as () => never);
});

test.serial.afterEach.always(() => {
  sinon.restore();
});

function testHelp(t: ExecutionContext<ITestContext>, flag: string) {
  cli.main([flag]);
  sinon.assert.calledWithMatch(t.context.consoleLog, /^Usage:/);
  sinon.assert.calledWithExactly(t.context.processExit, 0);
  t.pass();
}

test.serial('--help shows usage', testHelp, '--help');
test.serial('-h shows usage', testHelp, '-h');

test.serial('converts sid string to hex', (t) => {
  cli.main(['S-1-5-32-544']);
  sinon.assert.calledWithExactly(
    t.context.consoleLog,
    '01020000000000052000000020020000',
  );
  t.pass();
});

test.serial('converts hex to sid string', (t) => {
  cli.main(['01020000000000052000000020020000']);
  sinon.assert.calledWithExactly(t.context.consoleLog, 'S-1-5-32-544');
  t.pass();
});

test.serial('converts hex with spaces to sid string', (t) => {
  cli.main(['01020000 00000005 20000000 20020000']);
  sinon.assert.calledWithExactly(t.context.consoleLog, 'S-1-5-32-544');
  t.pass();
});

test.serial('shows usage and exits non-zero without args', (t) => {
  cli.main([]);
  sinon.assert.calledWithExactly(
    t.context.consoleError.firstCall,
    `Missing argument: 'sid-string'`,
  );
  sinon.assert.calledWithMatch(t.context.consoleError.secondCall, /^Usage:/);
  sinon.assert.calledWithMatch(
    t.context.processExit,
    (exitCode: number) => exitCode > 0,
  );
  t.pass();
});

test.serial('exits non-zero on conversion error', (t) => {
  cli.main(['foo']);
  sinon.assert.calledWithMatch(
    t.context.consoleError,
    /^Error converting 'foo':/,
  );
  sinon.assert.calledWithMatch(
    t.context.processExit,
    sinon.match((code) => code > 0),
  );
  t.pass();
});

test.serial('usage exit code', (t) => {
  const exitCode = 123;
  cli.usage(exitCode);
  sinon.assert.calledWithMatch(t.context.consoleError, /^Usage:/);
  sinon.assert.calledWithExactly(t.context.processExit, exitCode);
  t.pass();
});
