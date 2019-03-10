export function sidBufferToString(buf: Buffer): string {
  const revision = buf.readUInt8(0);
  const subAuthCount = buf.readUInt8(1);
  const identifierAuthorityValue = buf.readUIntBE(2, 6);
  const identifierAuthority =
    identifierAuthorityValue < 2 ** 32
      ? identifierAuthorityValue.toString(10)
      : `0x${buf.toString('hex', 2, 8).toUpperCase()}`;
  const subAuthorities: number[] = [];
  for (let i = 0; i < subAuthCount; i++) {
    subAuthorities.push(buf.readUInt32LE(8 + 4 * i));
  }
  return `S-${revision}-${identifierAuthority}-${subAuthorities.join('-')}`;
}

export function sidStringToBuffer(sid: string): Buffer {
  const [, revision, identifierAuthority, ...subAuthorities] = sid.split(
    '-',
  );
  const buf = Buffer.allocUnsafe(8 + 4 * subAuthorities.length);
  buf.writeUInt8(Number.parseInt(revision, 10), 0);
  buf.writeUInt8(subAuthorities.length, 1);
  buf.writeUIntBE(
    Number.parseInt(
      identifierAuthority,
      identifierAuthority[0] === '0' ? 16 : 10,
    ),
    2,
    6,
  );
  for (let i = 0; i < subAuthorities.length; i++) {
    buf.writeUInt32LE(Number.parseInt(subAuthorities[i], 10), 8 + i * 4);
  }
  return buf;
}
