import { sidBufferToString, sidStringToBuffer } from './index';

/* tslint:disable:no-console */

export function usage(exitCode = 0) {
  console[exitCode ? 'error' : 'log'](`Usage:
    sid <sid-string ...>
    sid -h | --help
Example:
    sid S-1-5-32-544
    sid 01020000000000052000000020020000
    sid '01020000 00000005 20000000 20020000'
`);
  process.exit(exitCode);
}

export function main(args: string[]): void {
  if (args.length === 0) {
    console.error(`Missing argument: 'sid-string'`);
    usage(1);
  }
  if (args.find(arg => ['-h', '--help'].includes(arg))) {
    usage();
  }
  for (const input of args) {
    try {
      if (input.startsWith('S')) {
        console.log(
          sidStringToBuffer(input)
            .toString('hex')
            .toUpperCase(),
        );
      } else {
        console.log(
          sidBufferToString(Buffer.from(input.replace(/\s/g, ''), 'hex')),
        );
      }
    } catch (e) {
      console.error(`Error converting '${input}': ${e.message}`);
      process.exit(2);
    }
  }
}
