import type { Topic } from '../../types';

export const defensiveSecurityTopic: Topic = {
  id: 'defensive-security',
  title: 'Defensive Security Design',
  day: 5,
  tags: ['mfa', 'password-hashing', 'session', 'credential-stuffing', 'defense-in-depth'],
  plainDefinition:
    'Defensive security design layers controls around login and sessions so one failure does not expose accounts or data.',
  technicalDefinition:
    'Defensive security applies multiple complementary controls—strong authentication, secure credential storage, session management, abuse detection, and least privilege—to reduce likelihood and impact of account compromise.',
  mechanism: [
    'Passwords stored with slow salted hashes (bcrypt, scrypt, Argon2)—never plaintext or reversible encryption.',
    'MFA adds a second factor; phishing-resistant options (WebAuthn/FIDO2) resist OTP phishing better than SMS.',
    'Rate limits, progressive delays, and lockouts slow brute force and password spraying.',
    'Credential stuffing detected via breached-password lists, impossible travel, device signals.',
    'Sessions: random IDs, HttpOnly Secure cookies, rotation on privilege change, expiration and server-side invalidation.',
    'Recovery codes stored hashed; limited use; separate from login rate limits.',
    'Defense in depth: WAF, bot management, monitoring, and alerting on anomalies.',
  ],
  securityBenefit:
    'Raises cost of account takeover even when passwords leak or users reuse credentials across sites.',
  risksAndTradeoffs: [
    'Strict lockouts enable denial-of-service against specific accounts.',
    'SMS MFA vulnerable to SIM swap; usability drops with friction.',
    'Long sessions increase theft window; short sessions annoy users.',
    'False positives on suspicious-login block legitimate travelers.',
    'No single control is sufficient—stuffing bypasses lockout per IP with distribution.',
  ],
  realWorldExample:
    'SaaS login uses Argon2id hashes, breached-password check, WebAuthn MFA for admins, 30-minute idle session timeout, and alerts on new device logins.',
  commonMisconception:
    'Account lockout after five failures does not stop credential stuffing that tries one password across millions of usernames with many IPs.',
  modelAnswer: {
    id: 'defensive-model-login',
    topicId: 'defensive-security',
    estimatedSeconds: 80,
    definition:
      'Defensive login design combines hashing, MFA, rate limiting, and session controls so compromised passwords are harder to abuse.',
    mechanism:
      'On login, verify password against salted slow hash, enforce rate limits and delays, require MFA when risk signals fire, issue short-lived session cookie with HttpOnly and Secure flags, and invalidate sessions on logout or password change.',
    benefit:
      'Layers reduce brute force, stuffing, and session hijack success even when one control fails.',
    risk:
      'Usability suffers with aggressive friction; lockouts can be abused; weak MFA factors give false confidence.',
    example:
      'Cloud-hosted web app behind CDN with bot detection, Argon2 passwords, TOTP MFA, and Redis-backed session store.',
    conclusion:
      'Security and usability must be balanced, but multiple targeted controls beat any single silver bullet.',
  },
  weakAnswer:
    'Use strong passwords and lock accounts after three tries. MFA fixes everything.',
  weakAnswerExplanation:
    'No hashing mechanism, ignores stuffing pattern, overstates MFA, no session or tradeoff discussion.',
  followUpQuestions: [
    'Why salt passwords before hashing?',
    'Password spraying vs brute force?',
    'What makes MFA phishing-resistant?',
    'How do you invalidate sessions on logout?',
  ],
  relatedTopicIds: ['jwt-authentication', 'api-rate-limiting', 'cia-triad'],
};
