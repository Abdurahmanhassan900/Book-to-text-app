import type { Lesson } from '../../types';

export const lessons: Lesson[] = [
  {
    id: 'lesson-tls-handshake',
    topicId: 'tls-cryptography',
    day: 1,
    title: 'TLS Handshake Walkthrough',
    summary: 'From TCP connect to encrypted application data.',
    content: [
      'TLS runs on top of TCP. HTTPS defaults to port 443.',
      'ClientHello advertises supported protocol versions, cipher suites, and extensions like SNI.',
      'ServerHello selects parameters and sends certificate chain plus key exchange data.',
      'Certificate validation is critical: chain, hostname, expiry, revocation.',
      'ECDHE key exchange provides forward secrecy for recorded traffic.',
      'After Finished messages, HTTP or API payloads are encrypted with symmetric AEAD.',
    ],
    mechanismSteps: [
      'TCP SYN → SYN-ACK',
      'ClientHello',
      'ServerHello + Certificate + ServerKeyExchange',
      'Client validates cert chain and hostname',
      'ClientKeyExchange + derive session keys',
      'Encrypted application data',
    ],
    practicePrompts: [
      'Explain ClientHello vs ServerHello in 30 seconds.',
      'What does the client check in the certificate?',
      'Why switch to symmetric encryption after the handshake?',
    ],
  },
  {
    id: 'lesson-tls-hybrid-crypto',
    topicId: 'tls-cryptography',
    day: 1,
    title: 'Asymmetric vs Symmetric in TLS',
    summary: 'Why TLS uses both public-key and symmetric cryptography.',
    content: [
      'Asymmetric crypto (RSA, ECDHE) solves key agreement and authentication but is slower.',
      'Symmetric crypto (AES-GCM, ChaCha20-Poly1305) encrypts bulk data efficiently.',
      'Handshake uses asymmetric operations to establish shared session keys.',
      'Session keys are unique per connection (especially with ephemeral DH).',
    ],
    mechanismSteps: [
      'Server proves identity with certificate signed by CA',
      'Key exchange produces shared secret',
      'KDF derives session keys',
      'Bulk data encrypted symmetrically',
    ],
    practicePrompts: [
      'Why not use RSA to encrypt all HTTP data?',
      'What is a session key?',
    ],
  },
  {
    id: 'lesson-sql-injection',
    topicId: 'sql-injection',
    day: 2,
    title: 'How SQL Injection Changes Query Logic',
    summary: 'Concatenation vs parameter binding.',
    content: [
      'SQL parsers distinguish keywords, operators, and string literals.',
      'Injection breaks out of string context using quotes and comments.',
      'Parameterized queries send structure and values separately.',
      'ORMs help but raw SQL and dynamic identifiers need care.',
    ],
    mechanismSteps: [
      'User input in concatenated string',
      'Parser executes attacker SQL',
      'Prepared statement with bound params',
      'DB treats input as data only',
    ],
    practicePrompts: [
      'Explain unsafe vs `WHERE email = ?` example.',
      'When is an ORM unsafe?',
    ],
  },
  {
    id: 'lesson-jwt-structure',
    topicId: 'jwt-authentication',
    day: 3,
    title: 'JWT Structure and Verification',
    summary: 'Header, payload, signature—not secret, not encrypted by default.',
    content: [
      'Header: alg and typ—must reject "none" and unexpected algorithms.',
      'Payload: claims like sub, exp, iss, aud.',
      'Signature: HMAC or asymmetric sign over header.payload.',
      'Verification checks signature and claim validity before trusting.',
    ],
    mechanismSteps: [
      'Parse token',
      'Verify signature',
      'Validate exp, iss, aud',
      'Authorize request',
    ],
    practicePrompts: [
      'What happens when server receives a JWT?',
      'Access vs refresh token roles?',
    ],
  },
  {
    id: 'lesson-sast-dast-pipeline',
    topicId: 'sast-dast',
    day: 4,
    title: 'Security Scans in CI/CD',
    summary: 'Where each scan type fits in the pipeline.',
    content: [
      'PR time: SAST, secret scan, IaC scan on changed files.',
      'Build: dependency/SCA scanning.',
      'Staging: DAST baseline and authenticated scans.',
      'Release: container image scan; manual pen test for critical apps.',
    ],
    mechanismSteps: [
      'Commit → SAST/secret',
      'Build → SCA',
      'Deploy staging → DAST',
      'Triage → fix → retest',
    ],
    practicePrompts: [
      'Compare SAST and DAST.',
      'What is a false positive?',
    ],
  },
  {
    id: 'lesson-rate-limit-algorithms',
    topicId: 'api-rate-limiting',
    day: 5,
    title: 'Rate Limiting Algorithms',
    summary: 'Fixed window, sliding window, token bucket compared.',
    content: [
      'Fixed window: easy counters, boundary burst problem.',
      'Sliding window: smoother, more memory/state.',
      'Token bucket: allows bursts up to bucket size, steady refill.',
      'Distributed APIs need shared counters—often Redis.',
    ],
    mechanismSteps: [
      'Identify limit dimension (IP, user, key)',
      'Increment counter or consume token',
      'Compare to threshold',
      'Return 429 or allow',
    ],
    practicePrompts: [
      'Which algorithm for login brute-force protection?',
      'Why Redis for rate limits?',
    ],
  },
  {
    id: 'lesson-defensive-login',
    topicId: 'defensive-security',
    day: 5,
    title: 'Layered Login Protection',
    summary: 'Hashing, MFA, stuffing defenses, sessions.',
    content: [
      'Store salted slow hashes—bcrypt, scrypt, Argon2.',
      'MFA and phishing-resistant factors for sensitive accounts.',
      'Rate limits and breached-password checks against stuffing.',
      'Secure session cookies and invalidation on logout.',
    ],
    mechanismSteps: [
      'Verify hash',
      'Risk-based MFA',
      'Issue session',
      'Monitor anomalies',
    ],
    practicePrompts: [
      'Protect login from credential stuffing.',
      'Security vs usability tradeoff example?',
    ],
  },
  {
    id: 'lesson-pinning',
    topicId: 'mobile-pinning',
    day: 6,
    title: 'Certificate Pinning Operations',
    summary: 'Security benefit and rotation risk.',
    content: [
      'Pinning adds trust check beyond system CAs.',
      'Blocks many MITM proxies and malicious CAs.',
      'Requires backup pins and release coordination.',
      'Wrong for every app—maintenance cost is real.',
    ],
    mechanismSteps: [
      'TLS handshake completes',
      'Hash server SPKI',
      'Match embedded pins',
      'Abort or continue',
    ],
    practicePrompts: [
      'Why can pinning break legitimate connections?',
      'When is pinning justified?',
    ],
  },
  {
    id: 'lesson-cia',
    topicId: 'cia-triad',
    day: 6,
    title: 'CIA in Real Systems',
    summary: 'Map controls to confidentiality, integrity, availability.',
    content: [
      'Confidentiality failures: unencrypted backups, IDOR, shoulder surfing.',
      'Integrity failures: unsigned updates, SQL tampering, log injection.',
      'Availability failures: DDoS, no backups, single point of failure.',
    ],
    mechanismSteps: [
      'Identify asset',
      'Classify CIA impact',
      'Select control',
      'Monitor effectiveness',
    ],
    practicePrompts: [
      'CIA controls for healthcare app?',
      'Real availability failure example?',
    ],
  },
];

export function getLessonsByTopic(topicId: Lesson['topicId']): Lesson[] {
  return lessons.filter((l) => l.topicId === topicId);
}

export function getLessonsByDay(day: number): Lesson[] {
  return lessons.filter((l) => l.day === day);
}
