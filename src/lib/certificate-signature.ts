import { createHmac } from 'node:crypto';

/** Fields covered by the HMAC (query string values as validated by Zod, before numeric coercion). */
export type CertificateSignFields = {
  donatorName: string;
  skillName: string;
  amount: string;
  date: string;
  certificateId: string;
};

/**
 * Canonical UTF-8 message for HMAC: one field per line, fixed order
 * (donatorName, skillName, amount, date, certificateId). The `sig` param is never included.
 */
export function buildCertificateCanonicalMessage(data: CertificateSignFields): string {
  return [
    data.donatorName,
    data.skillName,
    data.amount,
    data.date,
    data.certificateId,
  ].join('\n');
}

export function computeCertificateSignatureHex(secret: string, data: CertificateSignFields): string {
  return createHmac('sha256', secret)
    .update(buildCertificateCanonicalMessage(data), 'utf8')
    .digest('hex');
}
