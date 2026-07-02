import type { Topic } from '../../types';

export const jwtTopic: Topic = {
  id: 'jwt-authentication',
  title: 'Authentication and JWT Security',
  day: 3,
  tags: ['jwt', 'authentication', 'authorization', 'tokens', 'cookies', 'xss', 'csrf'],
  plainDefinition:
    'A JWT is a compact, signed token that carries claims about a user. Servers verify the signature to trust the claims without storing session state on every request.',
  technicalDefinition:
    'JSON Web Token (JWT) is a standardized format (RFC 7519) consisting of base64url-encoded header and payload plus a cryptographic signature (or MAC). It enables stateless authentication when the server validates integrity and expiration on each request.',
  mechanism: [
    'User authenticates (e.g., password + MFA); server creates JWT with header (alg, typ), payload (sub, exp, iss, aud, roles).',
    'Server signs with HMAC secret (symmetric) or private key (asymmetric, e.g., RS256).',
    'Client stores token (HttpOnly cookie, memory, or—riskier—localStorage) and sends it on requests (Authorization header or cookie).',
    'Resource server parses token, checks signature with secret/public key, validates exp/iss/aud, then authorizes action.',
    'Access tokens are short-lived; refresh tokens obtain new access tokens with rotation.',
    'Revocation is hard in pure stateless JWT—use short TTL, refresh rotation, deny lists, or session store for logout.',
    'Encoding is not encryption—anyone can read the payload; never put secrets in claims.',
  ],
  securityBenefit:
    'Scales horizontally without centralized session storage; clear separation of auth proof (token) and authorization checks on each service.',
  risksAndTradeoffs: [
    'Stolen bearer token works until expiry—XSS can exfiltrate from localStorage.',
    'Long-lived JWTs widen exposure; revocation is delayed without extra infrastructure.',
    'Weak HMAC secrets enable forgery; algorithm-confusion bugs verify with wrong key type.',
    'Missing iss/aud validation allows token misuse across services.',
    'Logout does not invalidate stateless tokens unless you add server-side state or blocklist.',
    'Cookies need HttpOnly, Secure, SameSite for transport and CSRF considerations.',
  ],
  realWorldExample:
    'An API issues a 15-minute access JWT after OAuth login, stores refresh token in HttpOnly cookie, validates RS256 signature with public key in a microservice, and rejects expired tokens with 401.',
  commonMisconception:
    'JWTs are not encrypted by default—the payload is only signed (integrity) or MACed, not hidden. base64 is encoding, not encryption.',
  modelAnswer: {
    id: 'jwt-model-server-receives',
    topicId: 'jwt-authentication',
    estimatedSeconds: 80,
    definition:
      'A JWT is a signed JSON object used to prove authentication between requests without the server storing session state for every call.',
    mechanism:
      'When a request arrives, the server extracts the JWT, base64url-decodes header and payload, verifies the signature using the shared secret or public key, and checks claims like exp and aud. If valid, it uses sub and roles for authorization; if not, it returns 401.',
    benefit:
      'Enables stateless, horizontally scalable auth across microservices when validation is implemented consistently.',
    risk:
      'Stolen tokens, long TTL, weak secrets, and no revocation allow abuse. localStorage increases XSS theft risk compared to HttpOnly cookies.',
    example:
      'SPA calls `/api/profile` with `Authorization: Bearer eyJ...`; API gateway validates signature and expiry before forwarding to user service.',
    conclusion:
      'JWTs trade server-side session storage for cryptographic proof on each request, but token lifetime, storage, and revocation must be designed deliberately.',
  },
  weakAnswer:
    'JWT is a secure encrypted session token you store in localStorage for easy access.',
  weakAnswerExplanation:
    'Confuses encoding with encryption; recommends risky storage; no signing/verification mechanism; ignores expiration and revocation.',
  followUpQuestions: [
    'Difference between authentication and authorization?',
    'Symmetric vs asymmetric JWT signing?',
    'Why are long-lived JWTs dangerous?',
    'How would you handle logout with stateless JWTs?',
    'What is algorithm confusion?',
  ],
  relatedTopicIds: ['defensive-security', 'api-rate-limiting'],
};
