import type { PracticeQuestion } from '../../types';
import { createRubric } from '../rubrics/helpers';

export const defensiveQuestions: PracticeQuestion[] = [
  {
    id: 'q-def-01',
    topicId: 'defensive-security',
    category: 'scenario',
    difficulty: 'assessment',
    prompt: 'How would you protect a login endpoint from credential stuffing?',
    rubric: createRubric({
      requiredConcepts: [
        'slow salted password hashing',
        'rate limits and progressive delays',
        'MFA especially on risk',
        'breached-password detection',
        'stuffing uses distributed low-volume attempts',
      ],
      mechanismSteps: [
        'Verify credentials with secure hash comparison',
        'Throttle per IP and per username',
        'Detect stuffing and breached passwords',
        'Require MFA or step-up on anomalies',
        'Secure session issuance after success',
      ],
      prohibitedClaims: ['account lockout alone stops stuffing', 'MFA fixes everything without other layers'],
      terminologyKeywords: ['credential stuffing', 'Argon2', 'bcrypt', 'MFA', 'rate limit'],
    }),
    modelAnswer: {
      id: 'q-def-01-model',
      questionId: 'q-def-01',
      topicId: 'defensive-security',
      estimatedSeconds: 85,
      definition:
        'Credential stuffing replays leaked passwords across sites; login endpoints need layered controls that slow automation and block known-bad credentials even when the password format is valid.',
      mechanism:
        'Store passwords with salted slow hashes (Argon2id/bcrypt). Enforce per-IP and per-username rate limits with progressive delays. Check passwords against breach corpora, monitor distributed low-and-slow patterns, and require MFA or WebAuthn on elevated risk. Issue HttpOnly Secure session cookies with rotation on privilege change.',
      benefit:
        'Raises attacker cost, reduces successful takeovers from reused passwords, and limits blast radius when one control fails.',
      risk:
        'Aggressive lockouts enable account denial-of-service; SMS MFA is phishable; friction hurts conversion; stuffing bypasses per-IP limits with botnets.',
      example:
        'B2B SaaS uses Argon2id, Have I Been Pwned k-anonymity checks, 10 logins per 15 minutes per username, and mandatory WebAuthn for admin roles.',
      conclusion:
        'Defense in depth—hashing, throttling, stuffing detection, and phishing-resistant MFA together—not any single control.',
    },
    hints: ['Stuffing tries many accounts, not one password repeatedly.', 'Where do breached passwords get checked?'],
  },
  {
    id: 'q-def-02',
    topicId: 'defensive-security',
    category: 'mechanism',
    difficulty: 'foundation',
    prompt: 'Why must passwords be salted before hashing, and what algorithms are appropriate?',
    rubric: createRubric({
      requiredConcepts: ['salt defeats rainbow tables', 'unique salt per user', 'slow password hashing algorithms'],
      mechanismSteps: [
        'Explain role of random salt',
        'Name suitable algorithms (bcrypt, scrypt, Argon2)',
        'Reject fast hashes and plaintext storage',
      ],
      prohibitedClaims: ['MD5 or SHA-256 alone is fine for passwords', 'encryption is the same as hashing'],
      terminologyKeywords: ['salt', 'bcrypt', 'Argon2', 'scrypt', 'rainbow table'],
    }),
    modelAnswer: {
      id: 'q-def-02-model',
      questionId: 'q-def-02',
      topicId: 'defensive-security',
      estimatedSeconds: 70,
      definition:
        'Password hashing converts secrets into one-way digests; salting ensures identical passwords produce different hashes so attackers cannot reuse precomputed tables.',
      mechanism:
        'Generate a unique cryptographically random salt per user, concatenate with password, and pass through a slow memory-hard function such as Argon2id, bcrypt, or scrypt with tuned cost parameters. Store salt alongside hash; never store plaintext or reversible encryption of passwords.',
      benefit:
        'Offline cracking becomes impractical at scale even if the database leaks, especially compared to fast hashes.',
      risk:
        'Weak cost parameters age poorly; home-grown schemes fail; pepper loss complicates rotation; users still reuse passwords across sites.',
      example:
        'User registration runs Argon2id with 64 MB memory cost; verification re-hashes submitted password with stored salt using constant-time compare.',
      conclusion:
        'Use established slow hash functions with per-user salts—never fast general-purpose hashes for password storage.',
    },
    hints: ['What attack does salt block?', 'Why must hashing be slow?'],
  },
  {
    id: 'q-def-03',
    topicId: 'defensive-security',
    category: 'comparison',
    difficulty: 'intermediate',
    prompt: 'Compare bcrypt, scrypt, and Argon2 for password hashing in a new web application.',
    rubric: createRubric({
      requiredConcepts: ['all are adaptive slow hashes', 'memory hardness in scrypt/Argon2', 'Argon2id resists GPU and side channels'],
      mechanismSteps: [
        'State shared goal of resisting offline cracking',
        'Contrast memory and CPU costs',
        'Recommend Argon2id or bcrypt with tuning',
      ],
      terminologyKeywords: ['bcrypt', 'scrypt', 'Argon2id', 'memory-hard', 'work factor'],
    }),
    modelAnswer: {
      id: 'q-def-03-model',
      questionId: 'q-def-03',
      topicId: 'defensive-security',
      estimatedSeconds: 75,
      definition:
        'bcrypt, scrypt, and Argon2 are purpose-built password hashes that increase verification cost to slow brute-force attacks after a database breach.',
      mechanism:
        'bcrypt uses Blowfish with a configurable work factor—mature but limited memory hardness. scrypt adds memory cost to resist GPU farms. Argon2id combines data-dependent and independent passes, winning PHC and offering tunable time, memory, and parallelism.',
      benefit:
        'Each forces attackers to spend real resources per guess, shrinking feasible crack rates on leaked dumps.',
      risk:
        'High parameters can DoS login servers under load; parameters need periodic retuning as hardware improves; library support varies on legacy platforms.',
      example:
        'Greenfield API chooses Argon2id (t=3, m=65536 KiB, p=4); legacy import rehashes bcrypt users on next successful login.',
      conclusion:
        'Prefer Argon2id for new systems; bcrypt remains acceptable with strong work factors; tune costs to your hardware budget.',
    },
    hints: ['Which algorithm won the Password Hashing Competition?', 'Why does memory hardness matter against GPUs?'],
  },
  {
    id: 'q-def-04',
    topicId: 'defensive-security',
    category: 'mechanism',
    difficulty: 'intermediate',
    prompt: 'What makes an MFA factor phishing-resistant, and how does WebAuthn compare to SMS OTP?',
    rubric: createRubric({
      requiredConcepts: ['phishing-resistant binds origin', 'WebAuthn/FIDO2 cryptographic challenge', 'SMS SIM swap and OTP relay risks'],
      mechanismSteps: [
        'Define phishing in MFA context',
        'Explain WebAuthn origin binding',
        'Contrast SMS OTP weaknesses',
      ],
      terminologyKeywords: ['WebAuthn', 'FIDO2', 'phishing-resistant', 'SMS', 'TOTP'],
    }),
    modelAnswer: {
      id: 'q-def-04-model',
      questionId: 'q-def-04',
      topicId: 'defensive-security',
      estimatedSeconds: 80,
      definition:
        'Phishing-resistant MFA uses cryptographic proofs tied to the legitimate site origin so attackers cannot harvest codes on fake pages.',
      mechanism:
        'WebAuthn/FIDO2 signs a challenge including relying party ID; browsers only release credentials for matching origins. SMS and email OTPs are human-readable secrets attackers can relay from phishing proxies in real time.',
      benefit:
        'Stops most credential-phishing workflows even when users click malicious links.',
      risk:
        'WebAuthn needs device availability and recovery planning; SMS remains common but weaker; push MFA can suffer fatigue attacks if users approve blindly.',
      example:
        'Admin portal requires security key WebAuthn; standard users may use TOTP; SMS only as last-resort recovery with extra monitoring.',
      conclusion:
        'Prioritize FIDO2/WebAuthn for high-value accounts; treat SMS as convenience, not strong assurance.',
    },
    hints: ['Can a fake site receive an SMS code the user types?', 'What does the authenticator sign in WebAuthn?'],
  },
  {
    id: 'q-def-05',
    topicId: 'defensive-security',
    category: 'comparison',
    difficulty: 'foundation',
    prompt: 'What is the difference between password spraying and brute-force attacks?',
    rubric: createRubric({
      requiredConcepts: ['spray one password across many accounts', 'brute force many passwords on one account', 'different detection signals'],
      mechanismSteps: [
        'Define brute force pattern',
        'Define password spraying pattern',
        'Explain why lockouts affect each differently',
      ],
      terminologyKeywords: ['password spraying', 'brute force', 'lockout'],
    }),
    modelAnswer: {
      id: 'q-def-05-model',
      questionId: 'q-def-05',
      topicId: 'defensive-security',
      estimatedSeconds: 65,
      definition:
        'Brute force tries many passwords against one account; password spraying tries one or few common passwords against many accounts to evade per-account lockouts.',
      mechanism:
        'Brute force hammers a single username until lockout or success. Spraying uses `Password123!` across thousands of usernames with pauses to stay under lockout thresholds, exploiting password reuse.',
      benefit:
        'Understanding the pattern drives correct controls—per-username limits and breach detection for spraying, lockouts and MFA for targeted brute force.',
      risk:
        'Misapplied lockouts help spraying victims remain untouched while enabling DoS on brute-force targets; IP limits miss distributed spray.',
      example:
        'Attacker tests `Summer2024!` against every corporate email from LinkedIn; only two accounts reuse it.',
      conclusion:
        'Monitor for horizontal failure patterns (spray) and vertical failures on one account (brute force) with different thresholds.',
    },
    hints: ['Which attack avoids tripping one account’s lockout?', 'How many passwords per account in spraying?'],
  },
  {
    id: 'q-def-06',
    topicId: 'defensive-security',
    category: 'architecture',
    difficulty: 'intermediate',
    prompt: 'What session-management controls should follow a successful login?',
    rubric: createRubric({
      requiredConcepts: ['random session ID', 'HttpOnly Secure SameSite cookies', 'rotation and expiration', 'server-side invalidation'],
      mechanismSteps: [
        'Describe session identifier generation',
        'List cookie security flags',
        'Explain logout and password-change invalidation',
      ],
      terminologyKeywords: ['HttpOnly', 'Secure', 'SameSite', 'session rotation'],
    }),
    modelAnswer: {
      id: 'q-def-06-model',
      questionId: 'q-def-06',
      topicId: 'defensive-security',
      estimatedSeconds: 75,
      definition:
        'Secure session management binds authenticated state to unpredictable server-validated tokens with tight cookie policies and explicit invalidation.',
      mechanism:
        'Issue a high-entropy session ID stored server-side or as a signed token with short TTL. Set HttpOnly, Secure, and SameSite=Lax/Strict on cookies. Rotate session ID on login and privilege elevation. Enforce idle and absolute timeouts; delete server sessions on logout and password reset.',
      benefit:
        'Reduces session fixation, XSS token theft, and CSRF while limiting window if a token leaks.',
      risk:
        'Long-lived JWTs without revocation widen theft impact; overly short sessions harm UX; misconfigured SameSite breaks legitimate flows.',
      example:
        'Express app stores sessions in Redis with 30-minute idle timeout; `Set-Cookie: sid=...; HttpOnly; Secure; SameSite=Lax`.',
      conclusion:
        'Treat sessions as credentials—generate safely, transport securely, and revoke aggressively on lifecycle events.',
    },
    hints: ['Which cookie flags block JavaScript theft?', 'When should the session ID change?'],
  },
  {
    id: 'q-def-07',
    topicId: 'defensive-security',
    category: 'risk-tradeoff',
    difficulty: 'intermediate',
    prompt: 'What are the security and usability tradeoffs of locking an account after failed login attempts?',
    rubric: createRubric({
      requiredConcepts: ['slows brute force on one account', 'enables denial-of-service', 'ineffective against spraying'],
      mechanismSteps: [
        'State lockout benefit for brute force',
        'Describe attacker-induced lockout DoS',
        'Note stuffing bypass pattern',
      ],
      terminologyKeywords: ['account lockout', 'denial of service', 'brute force'],
    }),
    modelAnswer: {
      id: 'q-def-07-model',
      questionId: 'q-def-07',
      topicId: 'defensive-security',
      estimatedSeconds: 70,
      definition:
        'Account lockout temporarily disables login after repeated failures, trading brute-force resistance for potential user lockout abuse.',
      mechanism:
        'Counters track failed attempts per username; exceeding threshold blocks further tries until timeout or admin unlock. Helps against focused brute force on high-value accounts.',
      benefit:
        'Caps online guessing attempts per account without expensive hash verification load.',
      risk:
        'Attackers can lock out victims intentionally; does not stop password spraying (one try per account); helpdesk burden on false locks.',
      example:
        'Five failures lock account 15 minutes; security team alerts on bulk lockouts indicating spray campaigns.',
      conclusion:
        'Use soft lockouts with unlock paths and pair with rate limits and MFA—not as the only anti-abuse control.',
    },
    hints: ['Can an attacker lock out a CEO’s account?', 'Does spraying trigger lockout on each account?'],
  },
  {
    id: 'q-def-08',
    topicId: 'defensive-security',
    category: 'mechanism',
    difficulty: 'intermediate',
    prompt: 'How does checking passwords against breached-password lists improve login security?',
    rubric: createRubric({
      requiredConcepts: ['blocks known compromised passwords', 'k-anonymity range queries', 'registration and login enforcement'],
      mechanismSteps: [
        'Explain breach corpus purpose',
        'Describe k-anonymity API pattern',
        'State when to reject or force reset',
      ],
      terminologyKeywords: ['breached password', 'Have I Been Pwned', 'k-anonymity'],
    }),
    modelAnswer: {
      id: 'q-def-08-model',
      questionId: 'q-def-08',
      topicId: 'defensive-security',
      estimatedSeconds: 70,
      definition:
        'Breached-password checking rejects credentials known from public dumps, closing the gap when users reuse passwords attackers already possess.',
      mechanism:
        'Hash the candidate password (SHA-1 prefix for HIBP k-anonymity), query range API without sending full secret, and block registration or force reset if hash suffix matches corpus. Optionally monitor login attempts with breached passwords as stuffing signal.',
      benefit:
        'Stops the most predictable stuffing successes with minimal user friction when paired with clear reset flows.',
      risk:
        'False sense of completeness—corpus is not exhaustive; privacy concerns if implemented poorly; offline attacks still need strong hashing.',
      example:
        'On signup, `P@ssw0rd123` matches HIBP; user must choose a new password before account creation.',
      conclusion:
        'Combine breach checks with hashing and MFA—attackers already have billions of compromised passwords.',
    },
    hints: ['Why k-anonymity for the API call?', 'At registration or only login?'],
  },
  {
    id: 'q-def-09',
    topicId: 'defensive-security',
    category: 'architecture',
    difficulty: 'assessment',
    prompt: 'Describe defense in depth for an internet-facing authentication service.',
    rubric: createRubric({
      requiredConcepts: ['multiple complementary layers', 'WAF bot management monitoring', 'no single point of failure'],
      mechanismSteps: [
        'List edge protections',
        'List application auth controls',
        'List detection and response',
      ],
      terminologyKeywords: ['defense in depth', 'WAF', 'bot management', 'monitoring'],
    }),
    modelAnswer: {
      id: 'q-def-09-model',
      questionId: 'q-def-09',
      topicId: 'defensive-security',
      estimatedSeconds: 85,
      definition:
        'Defense in depth stacks independent controls so compromise of one layer does not fully expose accounts or data.',
      mechanism:
        'Edge: CDN/WAF, bot scores, TLS, DDoS protection. Application: Argon2 hashing, rate limits, MFA, secure sessions, least-privilege APIs. Detection: SIEM alerts on geo velocity, impossible travel, spike in failures. Response: automated step-up, incident playbooks, credential revocation.',
      benefit:
        'Distributed stuffing, phishing, and session theft must defeat several controls, increasing attacker cost.',
      risk:
        'Complexity and config drift; overlapping tools create alert fatigue; weak recovery flows undermine strong login.',
      example:
        'Fintech auth behind Cloudflare bot management, Argon2id, WebAuthn for wires, and Datadog rules on login anomaly scores.',
      conclusion:
        'Map each control to a specific threat—avoid duplicating the same failure mode across layers.',
    },
    hints: ['What happens if only the password hash layer fails?', 'Who watches login anomalies?'],
  },
  {
    id: 'q-def-10',
    topicId: 'defensive-security',
    category: 'mechanism',
    difficulty: 'foundation',
    prompt: 'Why should session cookies use HttpOnly and Secure flags?',
    rubric: createRubric({
      requiredConcepts: ['HttpOnly blocks JavaScript access', 'Secure requires HTTPS transport'],
      mechanismSteps: [
        'Explain XSS token theft risk',
        'Define HttpOnly behavior',
        'Define Secure behavior on HTTPS',
      ],
      terminologyKeywords: ['HttpOnly', 'Secure', 'XSS', 'cookie'],
    }),
    modelAnswer: {
      id: 'q-def-10-model',
      questionId: 'q-def-10',
      topicId: 'defensive-security',
      estimatedSeconds: 60,
      definition:
        'HttpOnly and Secure cookie flags reduce session theft by blocking script access and cleartext transmission.',
      mechanism:
        'HttpOnly prevents `document.cookie` from reading the session ID, mitigating XSS exfiltration. Secure ensures browsers only send the cookie over HTTPS, protecting against network downgrade and sniffing on insecure links.',
      benefit:
        'Shrinks the attack surface for session hijacking when combined with XSS prevention and SameSite.',
      risk:
        'Does not stop XSS entirely; Secure alone does not encrypt cookie at rest on device; missing flags on subdomains can leak sessions.',
      example:
        'Production sets `Set-Cookie: session=abc; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=1800`.',
      conclusion:
        'HttpOnly and Secure are baseline cookie hygiene for any authentication token delivered via Set-Cookie.',
    },
    hints: ['What can XSS do without HttpOnly?', 'When is Secure ignored?'],
  },
  {
    id: 'q-def-11',
    topicId: 'defensive-security',
    category: 'scenario',
    difficulty: 'intermediate',
    prompt: 'When would you require WebAuthn/FIDO2 instead of TOTP for MFA?',
    rubric: createRubric({
      requiredConcepts: ['high-value targets', 'phishing resistance requirement', 'hardware-backed keys'],
      mechanismSteps: [
        'Identify threat model needing origin binding',
        'Compare TOTP phishing relay risk',
        'State operational requirements for FIDO2',
      ],
      terminologyKeywords: ['WebAuthn', 'FIDO2', 'TOTP', 'phishing-resistant'],
    }),
    modelAnswer: {
      id: 'q-def-11-model',
      questionId: 'q-def-11',
      topicId: 'defensive-security',
      estimatedSeconds: 75,
      definition:
        'WebAuthn/FIDO2 should be mandatory when accounts protect high-impact actions and phishing of OTP codes is a realistic threat.',
      mechanism:
        'Security keys and platform authenticators perform asymmetric cryptography bound to relying party ID. TOTP codes can be entered on attacker-controlled sites via real-time phishing proxies.',
      benefit:
        'Strong assurance for admins, financial transactions, and regulated data access.',
      risk:
        'Device loss requires backup codes or additional authenticators; accessibility and cost for all users may be excessive for low-risk forums.',
      example:
        'Healthcare EHR: clinicians use TOTP; prescribing controlled substances requires FIDO2 security key per policy.',
      conclusion:
        'Match MFA strength to asset value—FIDO2 for crown jewels, TOTP where phishing risk is lower and UX matters.',
    },
    hints: ['Can attackers relay a 6-digit TOTP?', 'What does FIDO2 prove about the site?'],
  },
  {
    id: 'q-def-12',
    topicId: 'defensive-security',
    category: 'mechanism',
    difficulty: 'intermediate',
    prompt: 'How should MFA recovery codes be stored and used securely?',
    rubric: createRubric({
      requiredConcepts: ['hashed like passwords', 'single use', 'separate from login rate limits'],
      mechanismSteps: [
        'Generate high-entropy one-time codes',
        'Store hashed with slow hash',
        'Invalidate after use and limit issuance',
      ],
      terminologyKeywords: ['recovery codes', 'hash', 'single-use'],
    }),
    modelAnswer: {
      id: 'q-def-12-model',
      questionId: 'q-def-12',
      topicId: 'defensive-security',
      estimatedSeconds: 70,
      definition:
        'Recovery codes are backup MFA factors that must be stored hashed and consumed once to avoid becoming a plaintext backdoor.',
      mechanism:
        'Generate random codes, display once to user, store only slow hashes. On redemption, verify hash, grant access, and delete or mark code used. Rate-limit recovery separately; require identity proof for reissuance.',
      benefit:
        'Provides account recovery when authenticators are lost without keeping secrets reversible in the database.',
      risk:
        'Plaintext storage equals second password leak; unlimited regeneration defeats MFA; social engineering on helpdesk bypasses codes.',
      example:
        'Ten bcrypt-hashed recovery codes issued at MFA enrollment; support cannot read them, only trigger regeneration after ID verification.',
      conclusion:
        'Treat recovery codes with the same seriousness as passwords—hashed, scarce, and audited.',
    },
    hints: ['Should support staff read recovery codes?', 'How many times can one code work?'],
  },
  {
    id: 'q-def-13',
    topicId: 'defensive-security',
    category: 'scenario',
    difficulty: 'pressure',
    prompt: 'A startup must ship login this week. Prioritize five defensive controls with one usability tradeoff you accept.',
    rubric: createRubric({
      requiredConcepts: ['hashing and HTTPS baseline', 'rate limiting', 'MFA roadmap', 'explicit tradeoff'],
      mechanismSteps: [
        'Rank must-have controls for week one',
        'Name deferred enhancements',
        'Justify one accepted usability cost',
      ],
      terminologyKeywords: ['Argon2', 'HTTPS', 'rate limit', 'MFA', 'tradeoff'],
    }),
    modelAnswer: {
      id: 'q-def-13-model',
      questionId: 'q-def-13',
      topicId: 'defensive-security',
      estimatedSeconds: 90,
      definition:
        'Minimum viable secure login ships strong transport, hashing, throttling, and session hygiene first, then layers MFA and stuffing detection as fast followers.',
      mechanism:
        'Week one: TLS everywhere, Argon2id hashing, per-IP/username rate limits, HttpOnly Secure cookies, breached-password check on signup. Next: TOTP MFA for admins, WebAuthn for finance. Accept tradeoff: 30-minute idle logout annoys users but limits stolen session window.',
      benefit:
        'Blocks worst-case credential storage and drive-by stuffing while keeping scope shippable.',
      risk:
        'Deferring MFA leaves admins exposed briefly; SMS-only MFA later may create false confidence; startup may never schedule phase two without deadlines.',
      example:
        'MVP auth on Fly.io with Redis rate limits and Clerk-like session cookies; admin MFA ticket scheduled sprint two.',
      conclusion:
        'Document accepted risk explicitly—ship baseline hashing and throttling, calendar MFA before handling payment data.',
    },
    hints: ['What is non-negotiable on day one?', 'Which tradeoff can you explain to stakeholders?'],
  },
];
