import type { Flashcard } from '../../types';

export const flashcards: Flashcard[] = [
  // ── tls-cryptography (11) ──────────────────────────────────────────
  {
    id: 'fc-tls-01',
    topicId: 'tls-cryptography',
    front: 'What happens during a TLS handshake?',
    back: 'Client and server negotiate TLS version and cipher suite, authenticate the server via certificates, perform key exchange, derive session keys, then switch to encrypted application data.',
    mechanism:
      'TCP connects → ClientHello → ServerHello + certificate + key exchange → client validates chain and hostname → both derive session keys → Finished messages → AEAD-encrypted payloads.',
    risk: 'Misconfiguration (expired cert, weak ciphers, skipped validation) breaks security or availability.',
    example: 'Browser loading https://example.com:443 negotiates TLS 1.3, validates Let\'s Encrypt chain, then sends HTTP GET encrypted with AES-GCM.',
    followUp: 'How does TLS 1.3 reduce handshake round trips compared to TLS 1.2?',
  },
  {
    id: 'fc-tls-02',
    topicId: 'tls-cryptography',
    front: 'What is ClientHello?',
    back: 'The first TLS message from the client listing supported protocol versions, cipher suites, a random nonce, and extensions such as SNI.',
    mechanism:
      'Client advertises capabilities; server must pick compatible parameters from this list. Extensions like SNI tell the server which hostname the client expects.',
    risk: 'Offering legacy TLS 1.0/1.1 or weak cipher suites widens attack surface if the server accepts them.',
    example: 'curl sends ClientHello with TLS 1.3, ECDHE suites, and SNI=api.example.com before any encrypted data.',
    followUp: 'Why is SNI required when multiple sites share one IP address?',
  },
  {
    id: 'fc-tls-03',
    topicId: 'tls-cryptography',
    front: 'What is ServerHello?',
    back: 'The server\'s response selecting TLS version and cipher suite from the client offer, plus its own random nonce.',
    mechanism:
      'Server picks one cipher suite and protocol version both sides support, then continues with certificate and key-exchange messages in the same flight (TLS 1.3) or subsequent messages (TLS 1.2).',
    risk: 'Server selecting export-grade or NULL encryption suites would negotiate a broken connection.',
    example: 'Server responds TLS 1.3, TLS_AES_256_GCM_SHA384, and sends its certificate chain in the same round trip.',
    followUp: 'What happens if client and server share no common cipher suite?',
  },
  {
    id: 'fc-tls-04',
    topicId: 'tls-cryptography',
    front: 'What is a cipher suite?',
    back: 'A named combination of key exchange, authentication, bulk encryption, and MAC algorithms negotiated during the handshake.',
    mechanism:
      'Client lists suites in ClientHello; server picks one. Modern suites use ECDHE for key exchange, RSA/ECDSA for cert signatures, and AEAD ciphers like AES-GCM or ChaCha20-Poly1305.',
    risk: 'Legacy suites (RC4, 3DES, RSA key transport without forward secrecy) weaken confidentiality against recorded traffic or cryptanalysis.',
    example: 'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 specifies ECDHE key exchange, RSA-signed cert, AES-128-GCM encryption.',
    followUp: 'Why did TLS 1.3 remove many legacy cipher suites?',
  },
  {
    id: 'fc-tls-05',
    topicId: 'tls-cryptography',
    front: 'What role does an X.509 certificate play in TLS?',
    back: 'It binds a public key to an identity (hostname in SAN/CN) and is signed by a trusted issuer, letting the client verify the server\'s identity.',
    mechanism:
      'Certificate contains subject, public key, validity dates, extensions (SAN), and issuer signature. Client checks signature using issuer\'s public key from the chain.',
    risk: 'Self-signed or fraudulently issued certs enable impersonation if the client does not validate properly.',
    example: 'api.bank.com presents a leaf cert with SAN=api.bank.com and an ECDSA public key signed by an intermediate CA.',
    followUp: 'What is the difference between CN and Subject Alternative Name (SAN)?',
  },
  {
    id: 'fc-tls-06',
    topicId: 'tls-cryptography',
    front: 'What is a Certificate Authority (CA) and how does chain validation work?',
    back: 'A CA signs certificates; validation builds a chain from leaf → intermediates → a trust anchor in the client trust store, verifying each signature and policy.',
    mechanism:
      'Client receives server chain, checks each cert is unexpired, signatures chain correctly, basic constraints allow signing, and root is trusted. Missing intermediate certs break validation.',
    risk: 'Compromised CA, failure to check revocation (CRL/OCSP), or incomplete chain enables MITM or outages.',
    example: 'Let\'s Encrypt R3 signs the leaf; ISRG Root X1 is in the OS trust store—browser walks the chain and verifies each link.',
    followUp: 'What problems occur when the server omits intermediate certificates?',
  },
  {
    id: 'fc-tls-07',
    topicId: 'tls-cryptography',
    front: 'What is hostname validation in TLS?',
    back: 'The client verifies the certificate\'s CN or SAN matches the hostname it intended to reach (e.g., from the URL or SNI), preventing cert substitution.',
    mechanism:
      'After chain validation, client compares requested hostname against SAN entries (preferred) or CN. Wildcard rules apply (*.example.com matches a.example.com, not b.a.example.com).',
    risk: 'Skipping hostname checks allows a valid cert for evil.com to impersonate bank.com if chain alone is checked.',
    example: 'Connecting to https://github.com rejects a cert whose SAN only lists login.microsoftonline.com, even if CA-signed.',
    followUp: 'How does certificate transparency relate to detecting mis-issued certs?',
  },
  {
    id: 'fc-tls-08',
    topicId: 'tls-cryptography',
    front: 'What is forward secrecy (PFS)?',
    back: 'Compromise of the server\'s long-term private key does not decrypt past recorded sessions because ephemeral session keys are discarded after use.',
    mechanism:
      'Ephemeral Diffie-Hellman (DHE/ECDHE) generates per-session key material; recorded ciphertext cannot be decrypted later with only the static RSA/ECDSA cert key.',
    risk: 'Static RSA key transport (no ephemeral DH) lacks forward secrecy—past traffic decrypts if the private key leaks.',
    example: 'TLS with ECDHE: attacker records traffic today; server key stolen next year—old sessions remain confidential.',
    followUp: 'Why is forward secrecy especially important for long-lived sensitive communications?',
  },
  {
    id: 'fc-tls-09',
    topicId: 'tls-cryptography',
    front: 'What is ECDHE in TLS?',
    back: 'Elliptic Curve Diffie-Hellman Ephemeral—a key exchange where both sides contribute ephemeral EC key pairs to derive a shared secret with forward secrecy.',
    mechanism:
      'Server sends ECDHE public key in ServerKeyExchange (1.2) or key share extension (1.3); client responds with its ephemeral public key; both run ECDH and feed result into key derivation.',
    risk: 'Weak curves, insufficient randomness in ephemeral keys, or downgrade attacks against supported groups weaken the exchange.',
    example: 'TLS 1.3 handshake uses X25519 ECDHE key shares; both sides derive the same handshake secret without RSA encryption of a pre-master secret.',
    followUp: 'How does ECDHE differ from static ECDH?',
  },
  {
    id: 'fc-tls-10',
    topicId: 'tls-cryptography',
    front: 'How does a man-in-the-middle (MITM) attack target TLS?',
    back: 'Attacker intercepts the connection and presents a fraudulent or user-trusted certificate, decrypting traffic if the client accepts it instead of the real server cert.',
    mechanism:
      'MITM proxies ClientHello/ServerHello, terminates TLS with victim, re-encrypts to real server—or presents a rogue CA cert if victim trusts attacker-installed roots.',
    risk: 'Corporate proxies, malware-installed CAs, validation bugs, or skipped hostname checks enable silent interception.',
    example: 'Burp Suite MITM works when the user installs Burp\'s CA; banking apps with pinning reject it unless pins are bypassed.',
    followUp: 'What defenses beyond default CA validation reduce MITM risk on mobile?',
  },
  {
    id: 'fc-tls-11',
    topicId: 'tls-cryptography',
    front: 'Why does TLS use both asymmetric and symmetric cryptography?',
    back: 'Asymmetric crypto authenticates and establishes keys during the handshake; symmetric session keys encrypt bulk data efficiently afterward.',
    mechanism:
      'RSA/ECDSA signatures prove identity; ECDHE agrees a shared secret; a KDF derives AES-GCM or ChaCha20-Poly1305 session keys used for all application records.',
    risk: 'Confusing the roles—e.g., trying to encrypt all HTTP body with RSA—would be impractically slow and error-prone.',
    example: '1 MB API response encrypted with AES-256-GCM session key derived during handshake, not with the server\'s RSA public key directly.',
    followUp: 'What is the purpose of the TLS Finished message?',
  },

  // ── sql-injection (11) ───────────────────────────────────────────
  {
    id: 'fc-sql-01',
    topicId: 'sql-injection',
    front: 'What is the mechanism of SQL injection?',
    back: 'Untrusted input is concatenated into SQL so the database parser executes attacker-controlled syntax as part of the query logic.',
    mechanism:
      "App builds string concatenation like SELECT with email + input; attacker injects quotes, operators, or clauses (OR 1=1) that alter query semantics.",
    risk: 'Data breach, authentication bypass, data modification, and in some stacks privilege escalation or OS command execution.',
    example: 'Login input `admin\'--` comments out the password clause, returning the admin row without a valid password.',
    followUp: 'How does UNION-based injection differ from boolean-based blind injection?',
  },
  {
    id: 'fc-sql-02',
    topicId: 'sql-injection',
    front: 'What are parameterized queries?',
    back: 'SQL templates with placeholders where user values are bound as data parameters, never parsed as SQL syntax.',
    mechanism:
      'Query sent as `SELECT * FROM users WHERE email = ?` with separate bound value `user@example.com`; driver transmits structure and data independently.',
    risk: 'Only values are parameterized—dynamic table/column names still need allowlists, not user input concatenation.',
    example: 'PDO: `$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?"); $stmt->execute([$email]);`',
    followUp: 'Can you parameterize an ORDER BY column name safely?',
  },
  {
    id: 'fc-sql-03',
    topicId: 'sql-injection',
    front: 'What is a prepared statement?',
    back: 'A database feature where the SQL template is parsed once and executed many times with different bound parameters.',
    mechanism:
      'DB parses and plans the statement on prepare(); execute() supplies values that cannot change query structure. Protects even if the same statement is reused.',
    risk: 'Re-preparing dynamic SQL strings per request without placeholders reintroduces injection; emulated prepares in some drivers may weaken guarantees.',
    example: 'Java PreparedStatement: `ps.setString(1, email)` binds email safely in `WHERE email = ?`.',
    followUp: 'What is the difference between client-side and server-side prepared statements?',
  },
  {
    id: 'fc-sql-04',
    topicId: 'sql-injection',
    front: 'What SQL injection risks remain when using an ORM?',
    back: 'Raw SQL, string-built queries, and dynamic identifiers bypass ORM parameterization and reintroduce injection.',
    mechanism:
      'ORMs parameterize normal queries, but methods like `.raw()`, `.query("... " + input)`, or dynamic `ORDER BY` from user input concatenate untrusted SQL fragments.',
    risk: 'Developers assume ORM = safe and use escape hatches for "quick" dynamic SQL without allowlists.',
    example: 'Sequelize `sequelize.query("SELECT * FROM logs ORDER BY " + req.query.sort)` is injectable if sort is user-controlled.',
    followUp: 'How should you safely implement dynamic sorting with an ORM?',
  },
  {
    id: 'fc-sql-05',
    topicId: 'sql-injection',
    front: 'Sanitization vs parameterization—which is reliable?',
    back: 'Parameterization is the correct defense; sanitization/escaping alone is error-prone and context-dependent.',
    mechanism:
      'Escaping rules differ for strings, LIKE patterns, identifiers, and numeric contexts. One missed escape or wrong function allows injection. Binding separates code from data by design.',
    risk: 'Blacklist filters (`strip keywords like UNION`) are bypassed easily; ad-hoc escaping fails on edge cases and second-order injection.',
    example: 'mysql_real_escape_string on input still fails if the query uses `ORDER BY $input`—parameterization cannot fix identifiers without allowlists.',
    followUp: 'What is second-order SQL injection?',
  },
  {
    id: 'fc-sql-06',
    topicId: 'sql-injection',
    front: 'How does least privilege limit SQL injection impact?',
    back: 'DB accounts scoped to minimum required permissions prevent injected queries from reading unrelated tables, writing files, or executing admin commands.',
    mechanism:
      'App uses a DB user with SELECT/INSERT only on needed tables; no FILE, SHUTDOWN, or xp_cmdshell privileges. Separate read-only replicas for reporting.',
    risk: 'Using root/admin DB credentials for the application amplifies every injection to full database compromise.',
    example: 'Web app connects as `app_rw` with GRANT only on `orders` and `users`—injection cannot `DROP DATABASE` or read `payroll` schema.',
    followUp: 'Should stored procedures run as DEFINER with elevated rights?',
  },
  {
    id: 'fc-sql-07',
    topicId: 'sql-injection',
    front: 'Why is verbose SQL error exposure dangerous?',
    back: 'Stack traces and database error messages reveal table names, column names, and query structure that attackers use to craft injections.',
    mechanism:
      "Attacker probes inputs; detailed errors like unknown column in where clause or full SQL in logs/responses map the schema for targeted attacks.",
    risk: 'Blind injection is harder but still possible; verbose errors accelerate exploitation and reduce attacker effort.',
    example: 'Production API returning `pg_syntax_error: syntax error at or near "UNION"` helps attacker refine UNION SELECT payloads.',
    followUp: 'What should applications return instead of raw database errors?',
  },
  {
    id: 'fc-sql-08',
    topicId: 'sql-injection',
    front: 'How does SQL injection enable authentication bypass?',
    back: 'Injected logic in the WHERE clause makes the login query return a valid user row without knowing the correct password.',
    mechanism:
      "Query SELECT user and pass with string concat; input admin'-- makes password check irrelevant; OR 1=1 can match arbitrary rows.",
    risk: 'First line of defense failure grants full account access; often needs no password cracking.',
    example: "OR 1=1 comment injection in a vulnerable form logs attacker in as the first returned user.",
    followUp: 'How do prepared statements specifically prevent auth bypass?',
  },
  {
    id: 'fc-sql-09',
    topicId: 'sql-injection',
    front: 'What is blind SQL injection?',
    back: 'Injection where the app does not return query results or errors, so the attacker infers data via boolean responses or timing delays.',
    mechanism:
      "Boolean blind: AND SUBSTRING probes change page content. Time-based: SLEEP delays infer true/false without visible errors.",
    risk: 'Harder to detect in logs; still exfiltrates data slowly without obvious error messages.',
    example: 'Login returns generic "invalid" for both wrong password and injected false condition—attacker compares response sizes bit by bit.',
    followUp: 'What monitoring signals suggest blind SQLi probing?',
  },
  {
    id: 'fc-sql-10',
    topicId: 'sql-injection',
    front: 'What is UNION-based SQL injection?',
    back: 'Attacker appends UNION SELECT to combine malicious query results with the original query output displayed by the app.',
    mechanism:
      "Inject UNION SELECT when original query returns matching column count and types; attacker rows appear in application output.",
    risk: 'Direct data exfiltration through normal application UI (search results, error pages) without admin access.',
    example: 'Product search showing `Widget` and attacker row `admin:hash` from UNION SELECT on the users table.',
    followUp: 'How does ORDER BY column count probing work during UNION attacks?',
  },
  {
    id: 'fc-sql-11',
    topicId: 'sql-injection',
    front: 'Why can\'t you parameterize dynamic table or column names?',
    back: 'Prepared statement placeholders bind values, not identifiers—SQL structure cannot treat table/column names as parameters.',
    mechanism:
      "Use strict allowlists mapping user input to known identifiers (name, created_at). Never concatenate raw identifiers from user input.",
    risk: "Developers parameterize values but leave ORDER BY or FROM clauses built from userInput injectable.",
    example: "Safe: ORDER BY from allowlist keys price and name. Unsafe: ORDER BY directly from request query param.",
    followUp: 'How do stored procedures with dynamic SQL create injection risk?',
  },

  // ── jwt-authentication (11) ──────────────────────────────────────
  {
    id: 'fc-jwt-01',
    topicId: 'jwt-authentication',
    front: 'Authentication vs authorization?',
    back: 'Authentication proves identity (who you are); authorization decides permitted actions (what you can do).',
    mechanism:
      'AuthN: login, MFA, token issuance verifying credentials. AuthZ: checking roles/scopes/policies on each request after identity is established.',
    risk: 'Valid JWT (authN) does not imply permission to delete data—missing authZ checks allow privilege abuse.',
    example: 'JWT proves user@corp.com is logged in; RBAC still checks `admin` role before `/admin/users` DELETE.',
    followUp: 'Where should authorization checks live in a microservices architecture?',
  },
  {
    id: 'fc-jwt-02',
    topicId: 'jwt-authentication',
    front: 'What is the structure of a JWT?',
    back: 'Three base64url-encoded parts separated by dots: header (alg, typ), payload (claims), and signature.',
    mechanism:
      'Signing input is `base64url(header) + "." + base64url(payload)`; signature appended as third segment. Payload is readable by anyone—it is not encrypted by default.',
    risk: 'Sensitive data in payload (SSN, passwords) is exposed to anyone holding the token.',
    example: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    followUp: 'What standard claims belong in the payload (sub, exp, iss, aud)?',
  },
  {
    id: 'fc-jwt-03',
    topicId: 'jwt-authentication',
    front: 'How does JWT signing work?',
    back: 'Issuer signs header+payload with a secret (HMAC) or private key (RSA/ECDSA); verifiers recompute or verify signature to detect tampering.',
    mechanism:
      'HS256: HMAC-SHA256 with shared secret. RS256: RSA signature with private key; resource servers verify with public key. Invalid signature → reject token.',
    risk: 'Weak secrets, leaked signing keys, or accepting `alg: none` enable forgery.',
    example: 'Auth server signs with RS256 private key; API gateway verifies using JWKS-published public key.',
    followUp: 'When is symmetric vs asymmetric signing preferable?',
  },
  {
    id: 'fc-jwt-04',
    topicId: 'jwt-authentication',
    front: 'JWT encoding vs encryption?',
    back: 'JWTs are typically signed (integrity), not encrypted—base64url encoding is reversible, not confidentiality.',
    mechanism:
      'JWS = signed token (common). JWE = encrypted token (less common). Anyone with the JWT string can decode and read claims unless JWE is used.',
    risk: 'Storing PII or secrets in payload assumes privacy that signing alone does not provide.',
    example: 'jwt.io decodes payload `{"role":"admin"}` without the secret—only signature verification needs the key.',
    followUp: 'When would you use JWE instead of JWS?',
  },
  {
    id: 'fc-jwt-05',
    topicId: 'jwt-authentication',
    front: 'What is an access token?',
    back: 'A short-lived credential sent with API requests to prove authentication; validated on each call.',
    mechanism:
      'Client includes token in Authorization: Bearer header or cookie; resource server validates signature, exp, iss, aud, then processes request.',
    risk: 'Stolen access token works until expiry—keep TTL short (minutes, not days).',
    example: '15-minute access JWT after OAuth login authorizes calls to `/api/profile` until exp claim passes.',
    followUp: 'What happens when an access token expires mid-session?',
  },
  {
    id: 'fc-jwt-06',
    topicId: 'jwt-authentication',
    front: 'What is a refresh token?',
    back: 'A longer-lived token used only to obtain new access tokens, reducing exposure of the access token and enabling rotation.',
    mechanism:
      'Client sends refresh token to `/token` endpoint; server validates, optionally rotates refresh token, issues new access token. Stored more securely (HttpOnly cookie).',
    risk: 'Stolen refresh token grants prolonged access; reuse detection and rotation limit damage.',
    example: 'Mobile app stores refresh token in secure storage; silently refreshes access token every 14 minutes.',
    followUp: 'What is refresh token rotation and why detect reuse?',
  },
  {
    id: 'fc-jwt-07',
    topicId: 'jwt-authentication',
    front: 'Why store JWTs in HttpOnly cookies?',
    back: 'HttpOnly prevents JavaScript from reading the cookie, reducing XSS token theft compared to localStorage.',
    mechanism:
      'Browser sends cookie automatically on same-site requests; flags Secure (HTTPS only), SameSite (CSRF mitigation), HttpOnly (no document.cookie access).',
    risk: 'Cookies require CSRF protections for state-changing requests; misconfigured SameSite breaks flows or allows cross-site posting.',
    example: 'Set-Cookie: access_token=...; HttpOnly; Secure; SameSite=Strict on login response.',
    followUp: 'How does SameSite=Lax differ from Strict for auth cookies?',
  },
  {
    id: 'fc-jwt-08',
    topicId: 'jwt-authentication',
    front: 'How does XSS threaten JWT-based auth?',
    back: 'Injected script runs in the victim browser and can read tokens from localStorage/sessionStorage or non-HttpOnly cookies and exfiltrate them.',
    mechanism:
      "Attacker stores script that reads localStorage token and exfiltrates it; victim browser sends bearer token to attacker.",
    risk: 'Bearer tokens are replayable until expiry—XSS becomes account takeover without password.',
    example: 'SPA storing JWT in localStorage compromised by stored XSS in a comment field.',
    followUp: 'What CSP and output-encoding practices reduce XSS risk?',
  },
  {
    id: 'fc-jwt-09',
    topicId: 'jwt-authentication',
    front: 'What is JWT algorithm confusion?',
    back: 'Server accepts unintended algorithm (e.g., RS256 token verified with HMAC using the public key as secret), allowing attackers to forge valid signatures.',
    mechanism:
      'Attacker changes header alg to HS256 and signs with RSA public key (often published in JWKS); buggy verifier uses same key material for HMAC.',
    risk: 'Complete authentication bypass—attacker mints arbitrary claims including admin roles.',
    example: 'CVE-class bug: API expects RS256 but does not pin alg; attacker forges HS256 token signed with PEM public key string.',
    followUp: 'How should servers enforce allowed algorithms during verification?',
  },
  {
    id: 'fc-jwt-10',
    topicId: 'jwt-authentication',
    front: 'Why is JWT revocation difficult?',
    back: 'Stateless JWTs remain valid until exp unless the server maintains a deny list, short TTLs, or session store—logout does not invalidate the token by default.',
    mechanism:
      'Mitigations: short access token TTL + refresh rotation, token versioning in user record, Redis blocklist on logout, or opaque server-side sessions instead of pure JWT.',
    risk: 'Compromised token usable after "logout" or password change if no server-side invalidation exists.',
    example: 'User logs out; stolen access JWT still works for 10 minutes unless jti is blocklisted in Redis.',
    followUp: 'When should you prefer server-side sessions over stateless JWTs?',
  },
  {
    id: 'fc-jwt-11',
    topicId: 'jwt-authentication',
    front: 'What are iss and aud claims and why validate them?',
    back: '`iss` (issuer) identifies who minted the token; `aud` (audience) names intended recipients—prevents token reuse across services.',
    mechanism:
      'Verifier checks iss matches expected auth server URL and aud includes this API\'s identifier; rejects tokens meant for another microservice.',
    risk: 'Accepting any validly signed token from your auth realm allows cross-service token replay attacks.',
    example: 'Token issued for aud `mobile-app` rejected by `payment-api` expecting aud `payment-api`.',
    followUp: 'How do JWKS endpoints support key rotation for JWT verification?',
  },

  // ── sast-dast (11) ─────────────────────────────────────────────
  {
    id: 'fc-sast-01',
    topicId: 'sast-dast',
    front: 'What is SAST?',
    back: 'Static Application Security Testing—white-box analysis of source code or bytecode without executing the application.',
    mechanism:
      'Tools parse code, apply pattern rules and taint analysis tracing untrusted input to sinks (SQL, exec, XSS), report findings in IDE or CI.',
    risk: 'False positives without tuning; cannot find runtime-only issues like misconfigured headers or auth bypass in deployment.',
    example: 'CodeQL flags string concatenation into SQL query in a pull request before merge.',
    followUp: 'What is taint analysis in SAST?',
  },
  {
    id: 'fc-sast-02',
    topicId: 'sast-dast',
    front: 'What is DAST?',
    back: 'Dynamic Application Security Testing—black-box probing of a running application\'s HTTP endpoints like an external attacker.',
    mechanism:
      'Scanner crawls URLs, sends fuzzed payloads (SQLi, XSS, path traversal), analyzes responses for vulnerabilities and misconfigurations.',
    risk: 'Misses unexecuted code paths, complex auth flows, and business logic flaws; slower and environment-dependent.',
    example: 'OWASP ZAP baseline scan against staging finds missing security headers and reflected XSS on search.',
    followUp: 'Why must DAST run against a realistic staging environment?',
  },
  {
    id: 'fc-sast-03',
    topicId: 'sast-dast',
    front: 'White-box vs black-box testing?',
    back: 'White-box (SAST) has source visibility; black-box (DAST) tests only external behavior without code access.',
    mechanism:
      'White-box traces data flow internally; black-box infers vulnerabilities from inputs and responses. Complementary coverage of defect classes.',
    risk: 'Relying on one box type leaves blind spots—unreachable code vs runtime config errors.',
    example: 'SAST sees hardcoded secret in unused branch; DAST sees admin panel exposed without auth in production routing.',
    followUp: 'Where does grey-box (IAST) fit between SAST and DAST?',
  },
  {
    id: 'fc-sast-04',
    topicId: 'sast-dast',
    front: 'What are false positives in security scanning?',
    back: 'Findings flagged as vulnerabilities that are not actually exploitable in context—safe code or dead paths misclassified by rules.',
    mechanism:
      'SAST rules match syntactic patterns without full data-flow proof; teams triage, suppress with justification, or tune rules to reduce noise.',
    risk: 'Alert fatigue causes teams to ignore gates; crying wolf delays real fixes.',
    example: 'Scanner reports SQLi on parameterized query because rule cannot distinguish bound parameters from concatenation.',
    followUp: 'How do you manage suppressions without hiding real issues?',
  },
  {
    id: 'fc-sast-05',
    topicId: 'sast-dast',
    front: 'What are false negatives in security scanning?',
    back: 'Real vulnerabilities that scanners fail to detect—silent misses creating false confidence.',
    mechanism:
      'Novel patterns, complex business logic, manual auth steps, or runtime-only flaws evade automated rules and crawlers.',
    risk: 'Passing CI scans does not mean secure—manual pentest and code review still required.',
    example: 'IDOR allowing access to `/orders/123` as user B when authenticated as user A—no standard SAST/DAST rule catches it.',
    followUp: 'What vulnerability classes are notoriously hard for automation?',
  },
  {
    id: 'fc-sast-06',
    topicId: 'sast-dast',
    front: 'Where should SAST and DAST sit in CI/CD?',
    back: 'SAST and secret scan on PR; SCA on build; DAST on staging post-deploy; container/IaC scan before release to production.',
    mechanism:
      'Shift-left: fast feedback in developer workflow. DAST later validates integrated runtime behavior without blocking every commit.',
    risk: 'DAST in PR pipeline is slow and flaky; SAST-only gates miss deployment misconfiguration.',
    example: 'PR: Semgrep + Gitleaks → merge. Nightly: ZAP on staging. Release: Trivy on Docker image.',
    followUp: 'What severity threshold should block a production release?',
  },
  {
    id: 'fc-sast-07',
    topicId: 'sast-dast',
    front: 'What is SCA (Software Composition Analysis)?',
    back: 'Scanning third-party dependencies against known vulnerability databases (CVEs) to find vulnerable library versions.',
    mechanism:
      'Tools parse lockfiles/manifests (package-lock.json, pom.xml), match package versions to CVE advisories, suggest upgrades or patches.',
    risk: 'Transitive dependencies, vendored code, and lag between CVE disclosure and database updates create gaps.',
    example: 'Dependabot alerts that lodash@4.17.15 has prototype pollution CVE; bump to patched version.',
    followUp: 'How do SBOMs support supply chain security?',
  },
  {
    id: 'fc-sast-08',
    topicId: 'sast-dast',
    front: 'What is secret scanning?',
    back: 'Detecting committed API keys, passwords, and tokens in git history or CI artifacts before they reach production.',
    mechanism:
      'Tools (Gitleaks, GitHub secret scanning) match entropy patterns and known key formats in diffs and repos; block push or alert rotation.',
    risk: 'Secrets in history remain after deletion from HEAD—rotation and history rewrite may be required.',
    example: 'Pre-commit hook blocks AWS_ACCESS_KEY_ID in `.env` accidentally staged for commit.',
    followUp: 'What should you do after a secret is found in a public repository?',
  },
  {
    id: 'fc-sast-09',
    topicId: 'sast-dast',
    front: 'What is container image scanning?',
    back: 'Analyzing Docker/OCI image layers for OS package CVEs, misconfigurations, and embedded secrets before deployment.',
    mechanism:
      'Scanner inspects image manifest and layer filesystem (Trivy, Grype), matches installed packages to vulnerability DBs, fails build on critical CVEs.',
    risk: 'Base image drift—rebuilding later pulls new vulnerable packages; pin and regularly rebuild images.',
    example: 'CI fails when `node:18` base contains critical OpenSSL CVE; team rebases on patched digest.',
    followUp: 'How does minimal distroless base images reduce scan findings?',
  },
  {
    id: 'fc-sast-10',
    topicId: 'sast-dast',
    front: 'What is IaC scanning?',
    back: 'Static analysis of infrastructure-as-code (Terraform, Kubernetes manifests) for security misconfigurations before provisioning.',
    mechanism:
      'Tools (Checkov, tfsec) evaluate resources for public S3 buckets, overly permissive security groups, missing pod security contexts.',
    risk: 'IaC mistakes become production attack surface at scale—one bad Terraform module affects every environment.',
    example: 'Checkov fails PR where S3 bucket has `acl = "public-read"` in Terraform.',
    followUp: 'How does policy-as-code differ from traditional IaC scanning?',
  },
  {
    id: 'fc-sast-11',
    topicId: 'sast-dast',
    front: 'Why can\'t SAST and DAST replace manual penetration testing?',
    back: 'Pentesters find business logic flaws, chained exploits, and contextual authZ bugs that automation lacks judgment to discover.',
    mechanism:
      'Human testers explore workflows (checkout abuse, race conditions, privilege escalation) with domain knowledge beyond generic payloads.',
    risk: 'Green CI dashboard with only automated scans still ships critical logic vulnerabilities.',
    example: 'Pentester discovers coupon stacking + refund race earns unlimited credit—no SAST rule exists.',
    followUp: 'How often should you combine automated scanning with manual assessment?',
  },

  // ── api-rate-limiting (11) ───────────────────────────────────────
  {
    id: 'fc-rate-01',
    topicId: 'api-rate-limiting',
    front: 'What is a fixed-window rate limit?',
    back: 'Counts requests per clock-aligned window (e.g., 100 requests per minute resetting at :00).',
    mechanism:
      'Counter increments per key (IP, user); resets at window boundary. Simple Redis INCR with TTL matching window duration.',
    risk: 'Burst at window edges—client sends 100 at 0:59 and 100 at 1:00, doubling allowed rate briefly.',
    example: 'API allows 60 req/min per API key; counter resets every minute on the wall clock.',
    followUp: 'How does the edge burst problem manifest under load testing?',
  },
  {
    id: 'fc-rate-02',
    topicId: 'api-rate-limiting',
    front: 'What is a sliding-window rate limit?',
    back: 'Tracks requests over a rolling time interval rather than fixed clock boundaries, smoothing allowance over recent history.',
    mechanism:
      'Store timestamps or weighted sub-windows; count requests in last N seconds. More accurate, higher memory/state per client.',
    risk: 'More complex to implement; approximate sliding windows trade precision for Redis efficiency.',
    example: 'Allow 100 requests in any rolling 60-second period—no double burst at minute boundaries.',
    followUp: 'What is the sliding window log vs counter approach?',
  },
  {
    id: 'fc-rate-03',
    topicId: 'api-rate-limiting',
    front: 'What is a token bucket rate limiter?',
    back: 'Bucket holds tokens refilled at a steady rate; each request consumes a token; empty bucket rejects or queues requests.',
    mechanism:
      'Refill rate = sustained throughput; bucket capacity = max burst. Allows controlled bursts while limiting average rate.',
    risk: 'Large bucket size permits damaging bursts; mis-tuned refill allows sustained abuse.',
    example: 'Login endpoint: 5 tokens, refill 1 per 12 seconds—allows short burst of 5 then throttles.',
    followUp: 'How does token bucket differ from leaky bucket?',
  },
  {
    id: 'fc-rate-04',
    topicId: 'api-rate-limiting',
    front: 'What does HTTP 429 mean?',
    back: '429 Too Many Requests—the client exceeded rate limits and should back off before retrying.',
    mechanism:
      'Server or gateway returns 429 with optional Retry-After header (seconds or HTTP-date) indicating when to retry safely.',
    risk: 'Clients ignoring 429 and hammering retries worsen load; exponential backoff required on client side.',
    example: 'GitHub API returns 429 with `Retry-After: 60` when secondary rate limit is hit.',
    followUp: 'Should idempotent GET retries differ from POST retries on 429?',
  },
  {
    id: 'fc-rate-05',
    topicId: 'api-rate-limiting',
    front: 'Why use Redis for distributed rate limiting?',
    back: 'Shared atomic counters across API instances ensure consistent limits; in-memory per-node counters allow N× abuse on N servers.',
    mechanism:
      'Redis INCR, sliding window scripts, or token bucket Lua scripts provide atomic updates with TTL; all nodes read same state.',
    risk: 'Redis outage may fail open (unlimited) or fail closed (block all)—explicit policy required.',
    example: 'Three Kubernetes pods share `rate:ip:1.2.3.4` key in Redis cluster for global 100/min cap.',
    followUp: 'What are alternatives when Redis is unavailable?',
  },
  {
    id: 'fc-rate-06',
    topicId: 'api-rate-limiting',
    front: 'How does rate limiting help against credential stuffing?',
    back: 'Throttles login attempts per IP, device, or username to slow automated testing of stolen password lists.',
    mechanism:
      'Low limits on `/login`, progressive delays, CAPTCHA after threshold, and anomaly detection on success/failure ratios.',
    risk: 'Distributed attackers rotate IPs and try one password per username—per-IP limits alone are insufficient.',
    example: '5 login failures per account per hour triggers lockout + alert; 20/min per IP triggers CAPTCHA.',
    followUp: 'What signals beyond IP help detect stuffing campaigns?',
  },
  {
    id: 'fc-rate-07',
    topicId: 'api-rate-limiting',
    front: 'What is IP throttling?',
    back: 'Rate limiting keyed on client source IP address to restrict request volume from a single network origin.',
    mechanism:
      'Extract IP from X-Forwarded-For (trusted proxy only) or connection; increment per-IP counter; block or delay on exceed.',
    risk: 'NAT and corporate gateways share one IP—legitimate users blocked together; attackers rotate IPs via botnets.',
    example: 'Public search API allows 30 requests/minute per IP without API key.',
    followUp: 'When should you rate limit by API key instead of IP?',
  },
  {
    id: 'fc-rate-08',
    topicId: 'api-rate-limiting',
    front: 'What is a leaky bucket rate limiter?',
    back: 'Requests enter a queue/bucket processed at a fixed output rate, smoothing traffic spikes to steady flow.',
    mechanism:
      'Excess requests queue (with max size) or drop; output rate constant regardless of input bursts—shapes traffic to backend capacity.',
    risk: 'Queue overflow drops requests; adds latency during spikes compared to hard reject.',
    example: 'Payment webhook processor handles max 50/sec outbound regardless of 500/sec inbound spike.',
    followUp: 'When is leaky bucket preferred over token bucket?',
  },
  {
    id: 'fc-rate-09',
    topicId: 'api-rate-limiting',
    front: 'What is the Retry-After header?',
    back: 'Response header telling clients how long to wait before retrying after 429 or 503, reducing retry storms.',
    mechanism:
      'Value in seconds (integer) or HTTP-date; well-behaved clients sleep before next attempt; complements exponential backoff.',
    risk: 'Missing Retry-After causes synchronized immediate retries amplifying server load.',
    example: '429 response: `Retry-After: 120` tells client to wait two minutes before next login attempt.',
    followUp: 'How should mobile apps surface Retry-After to users?',
  },
  {
    id: 'fc-rate-10',
    topicId: 'api-rate-limiting',
    front: 'Where should rate limits be enforced in architecture?',
    back: 'At API gateway or reverse proxy before backend services to block abuse early and protect expensive business logic.',
    mechanism:
      'Envoy, nginx, Kong, or Cloudflare apply limits at edge; backends may add finer per-user limits on sensitive endpoints.',
    risk: 'Limits only in app code still pay TLS and auth cost for rejected traffic; inconsistent limits across services.',
    example: 'Kong plugin limits `/auth/login` to 10/min per IP; microservices trust gateway-injected rate-limit headers.',
    followUp: 'What is the difference between global and per-route rate limits?',
  },
  {
    id: 'fc-rate-11',
    topicId: 'api-rate-limiting',
    front: 'Why doesn\'t rate limiting alone stop determined attackers?',
    back: 'Attackers distribute across IPs, accounts, and slow rates below thresholds; limits raise cost but need layered controls.',
    mechanism:
      'Combine with MFA, breached-password checks, bot detection, WAF, device fingerprinting, and account-level anomaly alerts.',
    risk: 'False sense of security from single-dimension limits while distributed abuse continues.',
    example: 'Botnet of 10,000 IPs each tries 4 logins/min—under per-IP limit but 40,000 attempts/min aggregate.',
    followUp: 'What metrics indicate your rate limits are mis-tuned?',
  },

  // ── defensive-security (11) ──────────────────────────────────────
  {
    id: 'fc-def-01',
    topicId: 'defensive-security',
    front: 'What is MFA and why use it?',
    back: 'Multi-factor authentication requires two or more factors (knowledge, possession, inherence) beyond password alone.',
    mechanism:
      'Login verifies password then TOTP, push approval, WebAuthn, or hardware key—stolen password insufficient without second factor.',
    risk: 'SMS OTP vulnerable to SIM swap; phishing can relay OTP; users resist friction on low-risk apps.',
    example: 'Admin portal requires password + YubiKey WebAuthn tap before access.',
    followUp: 'Why is WebAuthn considered more phishing-resistant than TOTP?',
  },
  {
    id: 'fc-def-02',
    topicId: 'defensive-security',
    front: 'How should passwords be stored?',
    back: 'Never plaintext or reversible encryption—use slow, salted one-way password hashing algorithms.',
    mechanism:
      'On registration, generate unique salt, hash password with adaptive work factor; on login, hash candidate and compare constant-time to stored hash.',
    risk: 'Plaintext DB leak exposes all passwords; fast hashes (MD5, SHA1) crack quickly via GPU rainbow tables.',
    example: 'User sets password; server stores `$argon2id$v=19$m=65536,t=3,p=4$salt$hash` only.',
    followUp: 'Why is salting required even with strong hash algorithms?',
  },
  {
    id: 'fc-def-03',
    topicId: 'defensive-security',
    front: 'What is bcrypt?',
    back: 'Adaptive password hashing function based on Blowfish with configurable cost factor, deliberately slow to resist brute force.',
    mechanism:
      'Cost parameter (2^cost rounds) increases work; salt embedded in output string. Legacy but widely supported.',
    risk: 'GPU/ASIC attacks faster than when bcrypt was designed; 72-byte password limit; cost must increase over years.',
    example: "PHP password_hash with PASSWORD_BCRYPT and cost 12 stores bcrypt hash in users table.",
    followUp: 'How do you choose bcrypt cost for your hardware budget?',
  },
  {
    id: 'fc-def-04',
    topicId: 'defensive-security',
    front: 'What is Argon2?',
    back: 'Modern memory-hard password hashing winner of Password Hashing Competition—Argon2id recommended for new systems.',
    mechanism:
      'Tunable time (t), memory (m), and parallelism (p); memory-hardness resists GPU/ASIC cracking better than bcrypt at similar latency.',
    risk: 'High memory settings may DoS low-memory servers under many concurrent logins—tune for environment.',
    example: 'OWASP recommends Argon2id with parameters matching ~500ms hash time on production servers.',
    followUp: 'What is the difference between Argon2i, Argon2d, and Argon2id?',
  },
  {
    id: 'fc-def-05',
    topicId: 'defensive-security',
    front: 'What is account lockout?',
    back: 'Temporarily disabling login after repeated failed attempts to slow password guessing on a single account.',
    mechanism:
      'Counter increments on failed auth; threshold triggers lock for duration or until admin unlock; may combine with CAPTCHA first.',
    risk: 'Attacker locks victim out (denial-of-service); does not stop distributed stuffing trying one password per account.',
    example: '5 failed logins → 15-minute lockout + email notification to account owner.',
    followUp: 'How do you balance lockout security vs account denial attacks?',
  },
  {
    id: 'fc-def-06',
    topicId: 'defensive-security',
    front: 'What is credential stuffing?',
    back: 'Automated login using username/password pairs leaked from other breaches, exploiting password reuse across sites.',
    mechanism:
      'Attackers use botnets and combo lists; low-and-slow to evade per-IP rate limits; success rate small but profitable at scale.',
    risk: 'Works even with strong hashing if users reuse passwords—no cracking needed, just replay leaked creds.',
    example: 'Millions of `email:password` pairs from Site A breach tested against Site B login API overnight.',
    followUp: 'How do breached-password lists (HIBP) defend against stuffing?',
  },
  {
    id: 'fc-def-07',
    topicId: 'defensive-security',
    front: 'What is defense in depth?',
    back: 'Layering multiple independent security controls so failure of one layer does not collapse overall protection.',
    mechanism:
      'Combine hashing, MFA, rate limits, WAF, monitoring, least privilege, and network segmentation—no single silver bullet.',
    risk: 'Teams assume one control (e.g., MFA) eliminates need for others; gaps remain in alternate attack paths.',
    example: 'Stolen password blocked by MFA; stolen session blocked by IP anomaly detection; both needed for different threats.',
    followUp: 'Give an example where MFA alone would not prevent breach.',
  },
  {
    id: 'fc-def-08',
    topicId: 'defensive-security',
    front: 'What is WebAuthn / FIDO2?',
    back: 'Phishing-resistant MFA using public-key cryptography bound to origin—private key never leaves authenticator device.',
    mechanism:
      'Browser calls navigator.credentials.get(); authenticator signs challenge with key pair registered to specific rpId (domain).',
    risk: 'Recovery if device lost requires backup codes or additional factors; not all users have hardware keys.',
    example: 'Passkey login on google.com—signature only valid for google.com rpId, useless on fake phishing domain.',
    followUp: 'How do passkeys differ from traditional TOTP apps?',
  },
  {
    id: 'fc-def-09',
    topicId: 'defensive-security',
    front: 'What are secure session management practices?',
    back: 'Random session IDs, HttpOnly Secure cookies, rotation on privilege change, idle and absolute timeouts, server-side invalidation on logout.',
    mechanism:
      'Session store maps ID to user state; regenerate ID after login (fixation); destroy on logout and password change.',
    risk: 'Long-lived sessions widen theft window; predictable session IDs enable hijacking.',
    example: 'Express session with `rolling: true`, 30-min idle timeout, `req.session.regenerate()` after MFA step-up.',
    followUp: 'What is session fixation and how do you prevent it?',
  },
  {
    id: 'fc-def-10',
    topicId: 'defensive-security',
    front: 'What is progressive delay on failed login?',
    back: 'Increasing wait time after each failed attempt to slow brute force without permanent lockout.',
    mechanism:
      'Failures 1-3 instant; 4th waits 2s; 5th waits 4s; exponential backoff per account or IP—raises attacker cost linearly.',
    risk: 'Still bypassed by distributed attacks; must pair with rate limits and stuffing detection.',
    example: 'Backend sleeps `min(2^(n-3), 30)` seconds before responding to nth failed login for same username.',
    followUp: 'How does progressive delay compare to CAPTCHA gates?',
  },
  {
    id: 'fc-def-11',
    topicId: 'defensive-security',
    front: 'How do breached-password checks work at registration/login?',
    back: 'Hash candidate password and query k-anonymity API (e.g., HIBP range) to reject passwords known from public breaches.',
    mechanism:
      'Send first 5 chars of SHA1 hash to API; compare suffix locally against returned set—full password never transmitted.',
    risk: 'Only helps for known breached passwords; users choosing unique weak passwords still vulnerable.',
    example: 'On signup, `Password123` rejected because hash prefix matches HIBP breached list entry.',
    followUp: 'Should you block or warn on breached password detection?',
  },

  // ── mobile-pinning (11) ──────────────────────────────────────────
  {
    id: 'fc-pin-01',
    topicId: 'mobile-pinning',
    front: 'What is certificate pinning?',
    back: 'App accepts TLS connections only when server certificate or public key matches preconfigured pins, not merely any CA-valid chain.',
    mechanism:
      'After standard TLS handshake, app hashes server SPKI or cert and compares to embedded pin set; mismatch aborts connection.',
    risk: 'Misconfigured pins or missed rotation bricks app connectivity for all users until update.',
    example: 'iOS NSURLSession delegate compares server public key hash to pins in Info.plist before returning data.',
    followUp: 'What is the difference between certificate pinning and public key pinning?',
  },
  {
    id: 'fc-pin-02',
    topicId: 'mobile-pinning',
    front: 'What is the pinning mechanism at runtime?',
    back: 'Custom TLS validation callback runs after system trust evaluation, enforcing additional pin match on extracted public key or certificate.',
    mechanism:
      'Network stack completes handshake; pinning layer computes SHA-256 of SPKI; compares against primary and backup pins; fails closed on no match.',
    risk: 'Pinning wrong element (expired leaf vs stable intermediate) causes fragile deployments.',
    example: 'OkHttp CertificatePinner checks `sha256/abc123...` matches server chain before proceeding.',
    followUp: 'Should you pin the leaf certificate or the intermediate CA key?',
  },
  {
    id: 'fc-pin-03',
    topicId: 'mobile-pinning',
    front: 'What is certificate rotation risk with pinning?',
    back: 'Renewing certs with new keys invalidates old pins—apps without updated pins cannot connect until users upgrade.',
    mechanism:
      'Plan rotation: deploy backup pin first, release app trusting both keys, switch server cert, later remove old pin in subsequent release.',
    risk: 'Emergency rotation without backup pin causes total outage; users on old app versions permanently broken.',
    example: 'Bank rotates API cert Saturday; app pinned only old key—millions cannot login until App Store update.',
    followUp: 'What is a safe pin rollover timeline across two app releases?',
  },
  {
    id: 'fc-pin-04',
    topicId: 'mobile-pinning',
    front: 'Why include backup pins?',
    back: 'Secondary trusted pins allow server key rotation without breaking clients that have not yet received the new primary pin.',
    mechanism:
      'App trusts pin A (current) and pin B (next cert/key); server switches from A to B; old apps still work if they included B ahead of time.',
    risk: 'Too many backup pins widen trust; compromised backup key accepted by all clients.',
    example: 'App pins current Let\'s Encrypt key plus next renewal key obtained before cert issuance.',
    followUp: 'How many backup pins is reasonable for a mobile banking app?',
  },
  {
    id: 'fc-pin-05',
    topicId: 'mobile-pinning',
    front: 'How does pinning defend against MITM?',
    back: 'Even with user-installed attacker CA or compromised CA, connection fails unless presented cert matches pinned keys.',
    mechanism:
      'System trust store would accept rogue CA-signed cert; pinning layer rejects it because SPKI hash differs from embedded values.',
    risk: 'Does not stop malware hooking SSL APIs after validation; rooted devices may patch pinning logic.',
    example: 'Corporate SSL inspection proxy works in browser but fails in pinned banking app without corporate pin update.',
    followUp: 'What attacks bypass certificate pinning?',
  },
  {
    id: 'fc-pin-06',
    topicId: 'mobile-pinning',
    front: 'What is SPKI pinning?',
    back: 'Pinning the hash of the Subject Public Key Info rather than the entire certificate—survives cert reissue with same key pair.',
    mechanism:
      'Extract public key from cert, DER-encode SPKI, SHA-256 hash, compare to configured pin strings (e.g., `sha256/base64==`).',
    risk: 'Key compromise requires pin update; confusing cert hash with SPKI hash causes misconfiguration.',
    example: 'Pin `sha256/AAAAAAAA...` matches any cert containing that RSA public key, including renewed leaf certs.',
    followUp: 'When does leaf certificate pinning break on routine renewal?',
  },
  {
    id: 'fc-pin-07',
    topicId: 'mobile-pinning',
    front: 'Why does pinning complicate corporate network inspection?',
    back: 'Corporate proxies terminate TLS with their own CA; pinned apps reject proxy cert unless proxy keys are explicitly pinned (usually undesirable).',
    mechanism:
      'Employee installs corporate root CA on device; browser trusts proxy; pinned app sees different SPKI than production server pin.',
    risk: 'Support burden for enterprises; developers may disable pinning in debug builds—ensure release builds keep it.',
    example: 'Bank app fails on office Wi-Fi with SSL inspection; works on cellular because direct to real server.',
    followUp: 'Should consumer banking apps support corporate proxy pins?',
  },
  {
    id: 'fc-pin-08',
    topicId: 'mobile-pinning',
    front: 'What is remote pin configuration?',
    back: 'Updating acceptable pins via signed remote config instead of app store release—still requires secure delivery and signature verification.',
    mechanism:
      'App fetches pin list from CDN; verifies config signature with embedded trust key; applies new pins before connections.',
    risk: 'Compromised signing key or config CDN enables attacker to push malicious pins; must fail closed on invalid signature.',
    example: 'Firebase Remote Config delivers new backup pin two weeks before cert rotation, signed with app embedded public key.',
    followUp: 'What are tradeoffs of remote pins vs hardcoded pins?',
  },
  {
    id: 'fc-pin-09',
    topicId: 'mobile-pinning',
    front: 'Why was HTTP Public Key Pinning (HPKP) deprecated in browsers?',
    back: 'HPKP created catastrophic outage risk from misconfiguration and was abused; browsers rely on CA system + Certificate Transparency instead.',
    mechanism:
      'Sites sent HPKP headers pinning keys; one mistake locked users out for max-age duration; mobile apps still implement custom pinning separately.',
    risk: 'Lessons apply to mobile: pinning mistakes are high-impact; operational discipline required.',
    example: 'Site pinned wrong backup key—users could not access site for 60 days until header expired (historical incidents).',
    followUp: 'What replaced HPKP for web applications?',
  },
  {
    id: 'fc-pin-10',
    topicId: 'mobile-pinning',
    front: 'How do user-installed CAs enable MITM on mobile?',
    back: 'User or malware installs custom root CA on device; system TLS trusts attacker-issued certs for any hostname.',
    mechanism:
      'Attacker proxies traffic, signs fake certs with installed CA private key; default validation passes without pinning.',
    risk: 'Common on jailbroken/rooted devices and some enterprise profiles; parental control apps use same technique.',
    example: 'Charles Proxy root cert on iOS allows decrypting HTTPS for apps without pinning during development.',
    followUp: 'How does Android Network Security Config relate to pinning?',
  },
  {
    id: 'fc-pin-11',
    topicId: 'mobile-pinning',
    front: 'When is certificate pinning NOT worth the cost?',
    back: 'Low-risk apps without high-value targets may accept standard CA validation to avoid rotation outages and maintenance burden.',
    mechanism:
      'Evaluate threat model: nation-state / financial fraud vs casual app. Pinning adds ops overhead (rotation, backup pins, testing).',
    risk: 'Pinning poorly is worse than not pinning—outages and false confidence from bypassable pinning on rooted devices.',
    example: 'News reader app uses system trust store; fintech app pins API keys—different risk profiles.',
    followUp: 'What mobile threats does pinning specifically address that CT logs do not?',
  },

  // ── cia-triad (11) ───────────────────────────────────────────────
  {
    id: 'fc-cia-01',
    topicId: 'cia-triad',
    front: 'What is confidentiality?',
    back: 'Ensuring information is accessible only to authorized parties—preventing unauthorized disclosure.',
    mechanism:
      'Encryption at rest and in transit, access controls, authentication, classification labels, and need-to-know policies.',
    risk: 'Over-collection and weak key management undermine confidentiality even when encryption is used.',
    example: 'Patient records encrypted with AES-256; only clinicians with RBAC role `physician` decrypt and view.',
    followUp: 'How does encryption at rest differ from encryption in transit?',
  },
  {
    id: 'fc-cia-02',
    topicId: 'cia-triad',
    front: 'What is integrity?',
    back: 'Ensuring data and systems are accurate, complete, and unmodified by unauthorized parties.',
    mechanism:
      'Hashing, digital signatures, HMAC, checksums, version control, input validation, and immutable audit logs detect tampering.',
    risk: 'Encryption without authentication (non-AEAD) may not detect ciphertext tampering.',
    example: 'Software update signed with vendor private key; client verifies signature before installing binary.',
    followUp: 'Why is authenticated encryption (AEAD) preferred over encrypt-then-MAC separately?',
  },
  {
    id: 'fc-cia-03',
    topicId: 'cia-triad',
    front: 'What is availability?',
    back: 'Ensuring systems and data are accessible and usable when needed by authorized users.',
    mechanism:
      'Redundancy, load balancing, failover, backups, disaster recovery, DDoS mitigation, capacity planning, and health monitoring.',
    risk: 'Ransomware and DDoS target availability; excessive security friction can also reduce effective availability.',
    example: 'E-commerce site uses multi-AZ deployment + CDN + rate limiting to stay online during traffic spikes.',
    followUp: 'How do confidentiality controls sometimes conflict with availability?',
  },
  {
    id: 'fc-cia-04',
    topicId: 'cia-triad',
    front: 'What is least privilege?',
    back: 'Granting users, services, and processes only the minimum permissions required to perform their function.',
    mechanism:
      'RBAC/ABAC with narrow roles, separate admin accounts, service accounts per microservice, just-in-time elevation for break-glass.',
    risk: 'Excessive privilege amplifies impact of any compromise—one stolen admin cred owns entire estate.',
    example: 'CI pipeline deploy role can push to staging only; production requires separate approval and role.',
    followUp: 'How does least privilege apply to database and cloud IAM design?',
  },
  {
    id: 'fc-cia-05',
    topicId: 'cia-triad',
    front: 'Hashing vs encryption?',
    back: 'Hashing is one-way fingerprinting for integrity/verification; encryption is reversible transformation for confidentiality.',
    mechanism:
      'Hash: password storage, file integrity (SHA-256). Encryption: AES-GCM protects readable data; requires key to decrypt.',
    risk: 'Encrypting passwords (reversible) instead of hashing allows recovery if key leaks; hashing alone does not hide data.',
    example: 'Store password with Argon2 hash; store SSN field with AES-GCM using KMS-managed key.',
    followUp: 'When would you use HMAC instead of plain hashing?',
  },
  {
    id: 'fc-cia-06',
    topicId: 'cia-triad',
    front: 'What is defense in depth in the CIA context?',
    back: 'Multiple controls across confidentiality, integrity, and availability so single failure does not lose all three properties.',
    mechanism:
      'Layer network segmentation, encryption, MFA, monitoring, backups, and WAF—each addresses different CIA facets.',
    risk: 'Checkbox compliance without integration—controls exist but gaps between layers remain exploitable.',
    example: 'Ransomware: backups (availability), signed binaries (integrity), encrypted backups (confidentiality of restores).',
    followUp: 'Map one control to each CIA pillar for a web application.',
  },
  {
    id: 'fc-cia-07',
    topicId: 'cia-triad',
    front: 'How do DDoS attacks threaten availability?',
    back: 'Flooding network, application, or DNS with traffic exhausts resources so legitimate users cannot access services.',
    mechanism:
      'Volumetric (UDP flood), protocol (SYN flood), application-layer (HTTP flood) attacks saturate bandwidth, connections, or CPU.',
    risk: 'Single-region deployment without CDN/scrubbing fails under moderate attacks; no failover means total outage.',
    example: 'Mirai botnet overwhelms Dyn DNS—major sites unreachable despite data remaining confidential and intact.',
    followUp: 'What is the difference between network and application-layer DDoS mitigation?',
  },
  {
    id: 'fc-cia-08',
    topicId: 'cia-triad',
    front: 'How do digital signatures support integrity and authenticity?',
    back: 'Signer\'s private key creates signature verifiable with public key—proves origin and detects modification.',
    mechanism:
      'Hash document, sign hash with private key; verifier hashes received content, checks signature with public key—mismatch indicates tampering.',
    risk: 'Compromised signing key allows forging authentic-looking malicious content.',
    example: 'Code signing certificate ensures macOS Gatekeeper trusts app binary was issued by registered developer.',
    followUp: 'How do signatures differ from MACs in threat model?',
  },
  {
    id: 'fc-cia-09',
    topicId: 'cia-triad',
    front: 'What is need-to-know?',
    back: 'Access principle limiting data visibility to individuals who require it for their specific job duties.',
    mechanism:
      'Beyond role-based access: compartmentalization, field-level encryption, data masking for support staff, audit of access.',
    risk: 'Broad admin access and flat networks violate need-to-know—increasing insider threat and breach blast radius.',
    example: 'HR payroll clerk sees salary; engineering manager sees headcount metrics only, not individual salaries.',
    followUp: 'How does need-to-know differ from least privilege?',
  },
  {
    id: 'fc-cia-10',
    topicId: 'cia-triad',
    front: 'Why doesn\'t encryption alone guarantee integrity?',
    back: 'Unauthenticated encryption (e.g., AES-CBC without MAC) may allow bit-flipping attacks; attacker can modify ciphertext without knowing key.',
    mechanism:
      'Use AEAD (AES-GCM, ChaCha20-Poly1305) or encrypt-then-MAC; separate integrity verification on stored hashes for static files.',
    risk: 'Assuming TLS or disk encryption covers tamper detection for stored data at rest without authentication.',
    example: 'CBC ciphertext manipulation changes decrypted plaintext blocks—GCM rejects tampered ciphertext on decrypt.',
    followUp: 'What is the encrypt-then-MAC construction?',
  },
  {
    id: 'fc-cia-11',
    topicId: 'cia-triad',
    front: 'What CIA tradeoffs appear in real systems?',
    back: 'Stronger confidentiality (more encryption) costs performance; high availability requires redundancy cost; audit logs aid integrity but affect privacy.',
    mechanism:
      'Risk assessment balances pillars by asset value—healthcare prioritizes confidentiality; trading platform prioritizes availability and integrity of orders.',
    risk: 'Optimizing one pillar neglects others—encrypted backups nobody can restore (availability fail) or always-on system with no integrity checks.',
    example: 'Strict geo-blocking improves confidentiality posture but reduces availability for traveling legitimate users.',
    followUp: 'How would ransomware shift your priority among CIA pillars during incident response?',
  },
];

export function getFlashcardsByTopic(topicId: string): Flashcard[] {
  return flashcards.filter((card) => card.topicId === topicId);
}

export function getFlashcardsShuffled(): Flashcard[] {
  const shuffled = [...flashcards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
