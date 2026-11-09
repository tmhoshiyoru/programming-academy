function binaryRatio(value) {
  const buffer = new DataView(new ArrayBuffer(8));
  buffer.setFloat64(0, value);
  const bits = buffer.getBigUint64(0);
  const exponent = Number(bits >> 52n);
  const fraction = bits & ((1n << 52n) - 1n);
  const significand = exponent === 0 ? fraction : fraction + (1n << 52n);
  const shift = (exponent === 0 ? 1 : exponent) - 1075;
  return shift >= 0
    ? { numerator: significand << BigInt(shift), denominator: 1n }
    : { numerator: significand, denominator: 1n << BigInt(-shift) };
}

function scaleRatio({ numerator, denominator }, places) {
  const scale = 10n ** BigInt(Math.abs(places));
  return places >= 0 ? [numerator * scale, denominator] : [numerator, denominator * scale];
}

function roundDecimal(ratio, places) {
  const [numerator, denominator] = scaleRatio(ratio, places);
  const quotient = numerator / denominator;
  const twiceRemainder = (numerator % denominator) * 2n;
  // Round the binary value itself, with ties to even as in the default C locale.
  return twiceRemainder > denominator || (twiceRemainder === denominator && quotient % 2n)
    ? quotient + 1n : quotient;
}

function fixedDigits(digits, places) {
  if (places <= 0) return digits + '0'.repeat(-places);
  const padded = digits.padStart(places + 1, '0');
  return padded.slice(0, -places) + '.' + padded.slice(-places);
}

function trimDecimals(text) {
  return text.includes('.') ? text.replace(/0+$/, '').replace(/\.$/, '') : text;
}

export function formatSandboxFloat(value, mode, precision) {
  if (Number.isNaN(value)) return 'nan';
  const sign = value < 0 || Object.is(value, -0) ? '-' : '';
  if (!Number.isFinite(value)) return sign + 'inf';
  const magnitude = Math.abs(value);
  const ratio = binaryRatio(magnitude);
  if (mode === 'fixed') {
    return sign + fixedDigits(String(roundDecimal(ratio, precision)), precision);
  }

  let exponent = magnitude === 0 ? 0 : Math.floor(Math.log10(magnitude));
  if (magnitude !== 0) {
    const [n, d] = scaleRatio(ratio, -exponent);
    if (n < d) exponent--;
    else if (n >= d * 10n) exponent++;
  }
  const significant = mode === 'scientific' ? precision + 1 : Math.max(1, precision);
  let digits = String(roundDecimal(ratio, significant - exponent - 1)).padStart(significant, '0');
  if (digits.length > significant) {
    exponent++;
    digits = digits.slice(0, -1);
  }
  if (mode === 'scientific' || exponent < -4 || exponent >= significant) {
    const mantissa = fixedDigits(digits, significant - 1);
    const suffix = (exponent < 0 ? '-' : '+') + String(Math.abs(exponent)).padStart(2, '0');
    return sign + (mode === 'scientific' ? mantissa : trimDecimals(mantissa)) + 'e' + suffix;
  }
  return sign + trimDecimals(fixedDigits(digits, significant - exponent - 1));
}
