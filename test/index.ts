import test from 'ava';
import { sidBufferToString, sidStringToBuffer } from '../src';

test('sidBufferToString', (t) => {
  const sidBuffer = Buffer.from(
    '010500000000000515000000A065CF7E784B9B5FE77C8770091C0100',
    'hex',
  );
  const sidString = 'S-1-5-21-2127521184-1604012920-1887927527-72713';
  t.is(sidBufferToString(sidBuffer), sidString);
});

test('sidBufferToString with identity authority > 2 ** 32', (t) => {
  const sidBuffer = Buffer.from(
    '010500010000000015000000A065CF7E784B9B5FE77C8770091C0100',
    'hex',
  );
  const sidString =
    'S-1-0x000100000000-21-2127521184-1604012920-1887927527-72713';
  t.is(sidBufferToString(sidBuffer), sidString);
});

test('sidStringToBuffer', (t) => {
  const sidString = 'S-1-5-21-2127521184-1604012920-1887927527-72713';
  const sidBuffer = Buffer.from(
    '010500000000000515000000A065CF7E784B9B5FE77C8770091C0100',
    'hex',
  );
  t.deepEqual(sidStringToBuffer(sidString), sidBuffer);
});

test('sidStringToBuffer with hex identity authority', (t) => {
  const sidString =
    'S-1-0x000100000000-21-2127521184-1604012920-1887927527-72713';
  const sidBuffer = Buffer.from(
    '010500010000000015000000A065CF7E784B9B5FE77C8770091C0100',
    'hex',
  );
  t.deepEqual(sidStringToBuffer(sidString), sidBuffer);
});
