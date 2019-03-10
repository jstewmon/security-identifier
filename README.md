# sid

Convert Windows [security identifiers] between binary and string representations.

Table Of Contents:

- [Installation](#installation)
- [Use Cases](#use-cases)
- [API](#api)
- [Command Line](#command-line)

## Installation

```bash
$ npm install sid
```

## Use Cases

- Formatting the binary representation of an `objectSid` in
  [Apple Directory Utility] as a SID string on the command line
  ```bash
  $ sid '01020000 00000005 20000000 20020000'
  S-1-5-32-544
  ```
- Formatting the SID string from a Windows Audit Event as a Buffer for use in an
  LDAP filter (with [ldapjs])

  ```js
  const ldap = require('ldapjs');
  const { sidStringToBuffer } = require('sid');
  const filter = new ldap.EqualityFilter({
    attribute: 'objectSID',
    value: sidStringToBuffer('S-1-5-32-544'),
  });
  ```

## API

#### `sidBufferToString(buf: Buffer): string`

Converts from [sid binary format] Buffer to [sid string].

Example:

```js
const { sidBufferToString } = require('sid');
sidBufferToString(Buffer.from('01020000000000052000000020020000', 'hex')); // ⇨ 'S-1-5-32-544'
```

#### `sidStringToBuffer(sid: string): Buffer`

Converts from [sid string format syntax] to [sid binary format].

Example:

```js
const { sidStringToBuffer } = require('sid');
sidStringToBuffer('S-1-5-32-544'); // ⇨ <Buffer 01 02 00 00 00 00 00 05 20 00 00 00 20 02 00 00>
```

## Command Line

sid can be used from the command line to convert between string and binary (hex
encoded) formats

```bash
$ sid S-1-5-32-544
01020000000000052000000020020000

$ sid 01020000000000052000000020020000
S-1-5-32-544
```

[apple directory utility]: https://support.apple.com/guide/directory-utility/welcome/mac
[ldapjs]: http://ldapjs.org/
[security identifiers]: https://docs.microsoft.com/en-us/windows/desktop/secauthz/security-identifiers
[sid string]: https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-dtyp/78eb9013-1c3a-4970-ad1f-2b1dad588a25
[sid components]: https://docs.microsoft.com/en-us/windows/desktop/SecAuthZ/sid-components
[sid string format syntax]: https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-dtyp/c92a27b1-c772-4fa7-a432-15df5f1b66a1
[sid binary format]: https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-dtyp/f992ad60-0fe4-4b87-9fed-beb478836861
