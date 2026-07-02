import type { PracticeQuestion } from '../../types';
import { createRubric } from '../rubrics/helpers';

export const tlsQuestions: PracticeQuestion[] = [
  {
    id: 'q-tls-01',
    topicId: 'tls-cryptography',
    category: 'definition',
    difficulty: 'foundation',
    prompt: 'What is TLS, and how does it relate to HTTPS?',
    rubric: createRubric({
      requiredConcepts: [
        'TLS is a cryptographic protocol for secure communication over TCP',
        'HTTPS is HTTP layered on top of TLS',
        'TLS provides confidentiality and integrity for data in transit',
      ],
      mechanismSteps: [
        'Application data travels over TCP',
        'TLS encrypts and authenticates the channel before HTTP payloads flow',
        'Default HTTPS port is 443',
      ],
      prohibitedClaims: [
        'TLS only uses public key cryptography for all application data',
        'HTTPS and TLS are completely unrelated protocols',
        'TLS encrypts data at rest on the server',
      ],
      terminologyKeywords: ['TLS', 'HTTPS', 'TCP', 'encryption', 'port 443'],
    }),
    modelAnswer: {
      id: 'ma-q-tls-01',
      topicId: 'tls-cryptography',
      estimatedSeconds: 45,
      definition:
        'TLS (Transport Layer Security) is a cryptographic protocol that secures communication between a client and server over TCP. HTTPS is simply HTTP running inside a TLS-protected connection.',
      mechanism:
        'When you visit an HTTPS URL, TCP connects first, then TLS negotiates encryption and server identity through a handshake. Only after the handshake succeeds does the browser send HTTP requests and receive responses over the encrypted channel.',
      benefit:
        'Sensitive data such as passwords, session cookies, and API tokens are not sent in plaintext across untrusted networks like public Wi-Fi.',
      risk:
        'TLS protects data in transit only. It does not fix server-side vulnerabilities, weak authentication, or misconfigured certificates.',
      example:
        'Loading https://example.com in a browser: TCP to port 443, TLS handshake, then encrypted GET /index.html.',
      conclusion:
        'TLS is the security layer behind HTTPS; understanding it is essential for any system that moves sensitive data across networks.',
    },
    hints: [
      'Start with what TLS protects (data in transit) before mentioning HTTPS.',
      'Mention TCP as the underlying transport.',
      'Do not confuse TLS with server-side encryption at rest.',
    ],
  },
  {
    id: 'q-tls-02',
    topicId: 'tls-cryptography',
    category: 'mechanism',
    difficulty: 'foundation',
    prompt: 'Walk me through a TLS handshake.',
    rubric: createRubric({
      requiredConcepts: [
        'ClientHello advertises supported TLS versions and cipher suites',
        'ServerHello selects parameters and sends certificate chain',
        'Key exchange establishes shared session keys',
        'Finished messages confirm handshake integrity before application data',
      ],
      mechanismSteps: [
        'TCP connection established',
        'ClientHello with versions, cipher suites, random, SNI',
        'ServerHello with selected suite and server random',
        'Server sends certificate chain and key-exchange parameters',
        'Client validates certificate and performs key exchange',
        'Both sides derive session keys and send Finished',
        'Application data encrypted with symmetric AEAD',
      ],
      prohibitedClaims: [
        'TLS only uses public key for all data',
        'The handshake encrypts application data with RSA for the entire session',
        'No certificate is needed for HTTPS',
      ],
      terminologyKeywords: [
        'ClientHello',
        'ServerHello',
        'certificate chain',
        'key exchange',
        'session keys',
        'Finished',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-tls-02',
      topicId: 'tls-cryptography',
      estimatedSeconds: 90,
      definition:
        'The TLS handshake is the initial negotiation phase where client and server agree on protocol parameters, authenticate the server, and establish shared keys before any application data is sent.',
      mechanism:
        'After TCP connects, the client sends ClientHello listing supported TLS versions, cipher suites, a random nonce, and extensions like SNI. The server replies with ServerHello selecting the version and cipher suite, sends its certificate chain, and provides key-exchange material (often ECDHE). The client validates the certificate, verifies signatures up the chain to a trusted CA, checks hostname and expiry, then both parties combine key-exchange secrets to derive session keys. ChangeCipherSpec and Finished messages confirm the handshake was not tampered with. From that point, HTTP or API payloads flow encrypted with symmetric algorithms like AES-GCM.',
      benefit:
        'The handshake establishes a trusted, encrypted channel so eavesdroppers cannot read or modify traffic without detection.',
      risk:
        'Skipping validation steps, using deprecated TLS versions, or weak cipher suites undermines the entire handshake. Each extra round trip adds latency.',
      example:
        'A mobile app connecting to api.example.com:443 performs ClientHello/ServerHello, validates a Let\'s Encrypt chain, negotiates TLS 1.3 with ECDHE, then sends a JSON login request encrypted.',
      conclusion:
        'The handshake is the foundation of HTTPS: negotiate algorithms, prove server identity, derive keys, then switch to fast symmetric encryption for bulk data.',
    },
    hints: [
      'Walk through messages in order: ClientHello → ServerHello → certificate → key exchange → Finished.',
      'Name at least one symmetric cipher used after the handshake.',
      'Include certificate validation as part of the client\'s role.',
    ],
  },
  {
    id: 'q-tls-03',
    topicId: 'tls-cryptography',
    category: 'mechanism',
    difficulty: 'intermediate',
    prompt: 'Why does TLS use both asymmetric and symmetric encryption?',
    rubric: createRubric({
      requiredConcepts: [
        'Asymmetric crypto is slow but solves authentication and key agreement',
        'Symmetric crypto is fast for bulk data encryption',
        'Handshake uses asymmetric operations to establish symmetric session keys',
      ],
      mechanismSteps: [
        'Server proves identity via certificate signed by CA',
        'Key exchange (e.g., ECDHE) produces shared secret',
        'KDF derives session keys from shared secret',
        'Bulk application data encrypted with AES-GCM or ChaCha20-Poly1305',
      ],
      prohibitedClaims: [
        'TLS only uses public key for all data',
        'Symmetric encryption is never used in TLS',
        'RSA encrypts every HTTP byte for the whole session',
      ],
      terminologyKeywords: [
        'asymmetric',
        'symmetric',
        'session key',
        'ECDHE',
        'AES-GCM',
        'key derivation',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-tls-03',
      topicId: 'tls-cryptography',
      estimatedSeconds: 70,
      definition:
        'TLS combines asymmetric cryptography for authentication and key establishment with symmetric cryptography for efficient bulk encryption of application data.',
      mechanism:
        'Public-key operations (certificate signatures, ECDHE key exchange) are computationally expensive but solve the problem of agreeing on secrets with someone you have not met before. Once both sides derive session keys through a key derivation function, all HTTP requests, responses, and API payloads are encrypted with fast symmetric AEAD ciphers. Asymmetric crypto appears mainly during the handshake, not for every packet.',
      benefit:
        'You get strong authentication and secure key agreement without the performance cost of encrypting megabytes of traffic with RSA or ECDSA on every byte.',
      risk:
        'If session keys are reused improperly or static RSA key transport is used without forward secrecy, recorded ciphertext may be decryptable later. Weak symmetric cipher choices also matter.',
      example:
        'Downloading a 50 MB file over HTTPS: ECDHE and certificate verification happen once at handshake; AES-256-GCM encrypts the entire file transfer.',
      conclusion:
        'TLS is a hybrid design—asymmetric for trust and key setup, symmetric for speed—because neither approach alone is practical for modern web traffic.',
    },
    hints: [
      'Contrast performance: asymmetric is slow, symmetric is fast.',
      'Explain when each type is used in the connection lifecycle.',
      'Mention session keys as the bridge between the two.',
    ],
  },
  {
    id: 'q-tls-04',
    topicId: 'tls-cryptography',
    category: 'mechanism',
    difficulty: 'intermediate',
    prompt: 'What does a TLS client check during certificate validation?',
    rubric: createRubric({
      requiredConcepts: [
        'Certificate chain must trace to a trusted root CA in the trust store',
        'Hostname must match CN or SAN in the leaf certificate',
        'Certificate must be within its validity period (not expired or not yet valid)',
        'Signature on each cert must verify with issuer public key',
      ],
      mechanismSteps: [
        'Receive server certificate chain from handshake',
        'Build chain from leaf to intermediate to trusted root',
        'Verify each signature using issuer public key',
        'Check notBefore/notAfter dates',
        'Match requested hostname against SAN/CN',
        'Optionally check revocation via OCSP or CRL',
      ],
      prohibitedClaims: [
        'Any certificate is trusted if it is presented by the server',
        'Certificate validation only checks expiry and nothing else',
        'Self-signed certificates are automatically trusted by browsers',
      ],
      terminologyKeywords: [
        'certificate chain',
        'CA',
        'SAN',
        'hostname validation',
        'expiry',
        'OCSP',
        'trust store',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-tls-04',
      topicId: 'tls-cryptography',
      estimatedSeconds: 75,
      definition:
        'Certificate validation is the client-side process of verifying that the server\'s X.509 certificate is authentic, currently valid, and issued for the hostname being accessed.',
      mechanism:
        'During the handshake the server presents a chain (leaf certificate plus intermediates). The client must build a path to a trusted root CA in its trust store (OS or browser). Each link\'s signature is verified using the issuer\'s public key. The leaf certificate\'s Subject Alternative Name (SAN) or Common Name must match the host in the URL (e.g., api.example.com). Validity dates are checked so expired or not-yet-valid certs are rejected. Where configured, revocation status may be checked via OCSP stapling or CRL.',
      benefit:
        'Proper validation prevents clients from accepting impersonator servers that present forged or wrong-domain certificates during MITM attempts.',
      risk:
        'Misconfigured chains, missing intermediates, hostname mismatches, and expired certs cause outages. Disabled revocation checks or compromised CAs weaken assurance.',
      example:
        'Connecting to https://mail.google.com: the browser verifies Google\'s leaf cert SAN includes mail.google.com, chain leads to a trusted root, and dates are current.',
      conclusion:
        'Certificate validation is not optional decoration—it is how TLS ties cryptographic identity to the server you intended to reach.',
    },
    hints: [
      'Cover chain of trust, hostname, and dates as the three pillars.',
      'Mention SAN specifically—modern browsers rely on it over CN.',
      'Note that revocation checking is often optional but important.',
    ],
  },
  {
    id: 'q-tls-05',
    topicId: 'tls-cryptography',
    category: 'mechanism',
    difficulty: 'intermediate',
    prompt: 'What is forward secrecy in TLS, and how is it achieved?',
    rubric: createRubric({
      requiredConcepts: [
        'Forward secrecy means compromise of long-term private key does not decrypt past sessions',
        'Ephemeral key exchange (ECDHE, DHE) generates per-session secrets',
        'Static RSA key transport without ephemeral DH does not provide forward secrecy',
      ],
      mechanismSteps: [
        'Server generates ephemeral key pair for the session',
        'Client contributes ephemeral key material',
        'Shared secret derived and discarded after session ends',
        'Long-term certificate private key used only for authentication signature',
      ],
      prohibitedClaims: [
        'All TLS connections have forward secrecy by default',
        'Forward secrecy means certificates never expire',
        'TLS only uses public key for all data',
      ],
      terminologyKeywords: [
        'forward secrecy',
        'perfect forward secrecy',
        'ECDHE',
        'ephemeral',
        'session keys',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-tls-05',
      topicId: 'tls-cryptography',
      estimatedSeconds: 65,
      definition:
        'Forward secrecy (also called perfect forward secrecy) ensures that even if an attacker later steals the server\'s long-term private key, they cannot decrypt previously recorded TLS sessions.',
      mechanism:
        'With ephemeral Diffie-Hellman (ECDHE or DHE), each handshake generates fresh ephemeral key pairs. The shared secret is derived from these ephemeral values and used to derive session keys that are discarded when the connection ends. The certificate\'s long-term private key signs the handshake but does not directly encrypt the bulk of session traffic. Legacy RSA key transport (encrypting a pre-master secret with the server\'s RSA public key) lacks forward secrecy because the static private key can decrypt all past sessions if compromised.',
      benefit:
        'Nation-state or criminal adversaries who record encrypted traffic cannot retroactively decrypt it after a key leak or server compromise.',
      risk:
        'Older cipher suites or misconfigured servers that disable ECDHE lose this protection. Ephemeral DH adds modest CPU cost per handshake.',
      example:
        'TLS 1.3 mandates forward-secure key exchange; a CDN terminating millions of connections uses ECDHE so a leaked cert key does not expose yesterday\'s user sessions.',
      conclusion:
        'Forward secrecy separates authentication (long-term cert) from confidentiality (ephemeral session keys)—a critical property for modern TLS deployments.',
    },
    hints: [
      'Define what happens if the server private key is stolen tomorrow.',
      'Contrast ECDHE with old RSA key transport.',
      'TLS 1.3 requires forward-secure key exchange—mention that.',
    ],
  },
  {
    id: 'q-tls-06',
    topicId: 'tls-cryptography',
    category: 'scenario',
    difficulty: 'assessment',
    prompt:
      'An attacker on the same coffee-shop Wi-Fi runs a transparent proxy and presents their own certificate for bank.example.com. How does TLS protect the user, and when does MITM succeed?',
    rubric: createRubric({
      requiredConcepts: [
        'MITM intercepts traffic by terminating TLS on both sides',
        'Certificate validation should reject certs not signed by trusted CA for correct hostname',
        'User bypassing warnings or installing attacker CA enables MITM',
      ],
      mechanismSteps: [
        'Client initiates TLS to perceived server',
        'Attacker presents forged or wrong certificate',
        'Client validates chain, hostname, and trust',
        'Validation failure should abort connection with warning',
        'If user accepts bad cert, attacker decrypts and re-encrypts traffic',
      ],
      prohibitedClaims: [
        'TLS makes MITM impossible in all cases',
        'TLS only uses public key for all data',
        'Users never need to check certificate warnings',
      ],
      terminologyKeywords: [
        'MITM',
        'man-in-the-middle',
        'certificate validation',
        'trust store',
        'proxy',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-tls-06',
      topicId: 'tls-cryptography',
      estimatedSeconds: 80,
      definition:
        'A man-in-the-middle (MITM) attack on TLS places an attacker between client and server, often by presenting a fraudulent certificate to impersonate the legitimate server.',
      mechanism:
        'On compromised Wi-Fi, the attacker intercepts TCP traffic and responds to the client\'s TLS handshake with their own certificate. If the client validates properly, it checks that the certificate chains to a trusted CA and that SAN matches bank.example.com. A self-signed or wrong-CA cert should trigger a browser warning and abort. MITM succeeds when the user clicks through the warning, when a corporate or malicious root CA is installed on the device, or when validation is disabled in code (common mobile app misconfiguration).',
      benefit:
        'Correct certificate validation is the primary client-side defense against casual MITM on untrusted networks.',
      risk:
        'Social engineering around cert warnings, compromised CAs, and apps that pin poorly or skip validation all enable successful interception.',
      example:
        'Burp Suite or mitmproxy used in security testing: analysts install a custom CA on a test device; production users should never do this for banking apps without explicit security review.',
      conclusion:
        'TLS encryption alone is insufficient—the client must verify it is talking to the real server via rigorous certificate validation.',
    },
    hints: [
      'Describe both the attack setup and the client\'s validation response.',
      'Explain when warnings appear and what happens if ignored.',
      'Mention installed rogue CAs as an enabler.',
    ],
  },
  {
    id: 'q-tls-07',
    topicId: 'tls-cryptography',
    category: 'mechanism',
    difficulty: 'intermediate',
    prompt: 'How does cipher suite negotiation work during a TLS handshake?',
    rubric: createRubric({
      requiredConcepts: [
        'Client advertises supported cipher suites in ClientHello',
        'Server selects one mutually supported suite in ServerHello',
        'Cipher suite defines key exchange, authentication, and bulk encryption algorithms',
        'Server policy and security configuration determine the final choice',
      ],
      mechanismSteps: [
        'Client lists cipher suites in preference order',
        'Server picks highest mutually acceptable suite per its policy',
        'Selected suite determines key exchange and symmetric cipher',
        'Both parties use agreed algorithms for remainder of session',
      ],
      prohibitedClaims: [
        'The client alone decides the cipher suite without server input',
        'Cipher negotiation happens after all application data is sent',
        'All cipher suites are equally secure',
      ],
      terminologyKeywords: [
        'cipher suite',
        'ClientHello',
        'ServerHello',
        'ECDHE',
        'AES-GCM',
        'TLS 1.3',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-tls-07',
      topicId: 'tls-cryptography',
      estimatedSeconds: 70,
      definition:
        'Cipher suite negotiation is the process where client and server agree on the cryptographic algorithms used for key exchange, authentication, and bulk encryption during a TLS session.',
      mechanism:
        'In ClientHello the client sends an ordered list of supported cipher suites (each naming key exchange, certificate type, and symmetric cipher/MAC). The server examines the list against its own enabled suites and security policy, then selects one in ServerHello. For example, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 means ECDHE key exchange, RSA certificate authentication, AES-256-GCM bulk encryption. In TLS 1.3, negotiation is simplified—key exchange and signature algorithms are negotiated separately, and only AEAD ciphers remain.',
      benefit:
        'Negotiation allows interoperability between diverse clients and servers while letting administrators disable weak legacy algorithms.',
      risk:
        'Servers that support obsolete suites (RC4, export-grade, TLS 1.0) may be downgraded by active attackers unless TLS_FALLBACK_SCSV and modern minimum versions are enforced. Overly broad cipher lists increase attack surface.',
      example:
        'An nginx server configured with ssl_ciphers prioritizing ECDHE+AESGCM; a modern browser ClientHello matches TLS_AES_256_GCM_SHA384 under TLS 1.3.',
      conclusion:
        'Cipher negotiation balances compatibility and security—operators must curate enabled suites, not rely on defaults from a decade ago.',
    },
    hints: [
      'Explain who offers the list and who makes the final pick.',
      'Break down what a cipher suite name encodes.',
      'Contrast TLS 1.2 suite strings with TLS 1.3 simplification.',
    ],
  },
  {
    id: 'q-tls-08',
    topicId: 'tls-cryptography',
    category: 'troubleshooting',
    difficulty: 'intermediate',
    prompt:
      'Users report that https://api.example.com suddenly fails with a certificate error after a deployment. What certificate expiry issues should you investigate?',
    rubric: createRubric({
      requiredConcepts: [
        'Leaf certificate has notBefore and notAfter validity window',
        'Expired leaf cert causes immediate client rejection',
        'Missing intermediate certificates can cause validation failures mistaken for expiry',
        'Automated renewal (ACME) failures leave expired certs in production',
      ],
      mechanismSteps: [
        'Check leaf certificate notAfter date with openssl or browser inspector',
        'Verify full chain including intermediates is served',
        'Confirm renewal job or ACME client succeeded recently',
        'Check clock skew on servers and clients',
        'Validate new cert covers correct SAN entries',
      ],
      prohibitedClaims: [
        'Certificate expiry only affects old browsers',
        'Clients ignore expiry if the hostname matches',
        'TLS only uses public key for all data',
      ],
      terminologyKeywords: [
        'certificate expiry',
        'notAfter',
        'ACME',
        'Let\'s Encrypt',
        'intermediate chain',
        'renewal',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-tls-08',
      topicId: 'tls-cryptography',
      estimatedSeconds: 75,
      definition:
        'Certificate expiry occurs when the current date passes the notAfter field on an X.509 certificate, causing compliant TLS clients to reject the connection as untrusted.',
      mechanism:
        'Every certificate has a finite validity period. When the leaf cert expires, clients fail validation even if the key and hostname are otherwise correct. Common operational causes: forgotten manual renewal, failed ACME/Let\'s Encrypt automation, deploying the new cert to the wrong load balancer, or serving an old cert from a secondary node. Incomplete chains can also surface as errors around renewal time when intermediates change. Monitoring should alert days before expiry and verify the served chain from external vantage points.',
      benefit:
        'Short-lived certificates (90-day Let\'s Encrypt) limit the window of abuse if a private key leaks, encouraging automated renewal discipline.',
      risk:
        'Expired certs cause complete outages for external users. Poor monitoring, multi-region deploy drift, and staging certs accidentally promoted to production are frequent culprits.',
      example:
        'A SaaS API\'s cert expired at midnight UTC; mobile apps using certificate pinning may hard-fail without user override until an app update ships new pins.',
      conclusion:
        'Certificate expiry is an availability and security event—treat renewal as critical infrastructure with automated checks, not a calendar reminder.',
    },
    hints: [
      'Distinguish expired leaf cert from missing intermediate chain.',
      'Mention automated renewal failure as a common root cause.',
      'Suggest concrete diagnostic tools like openssl s_client.',
    ],
  },
  {
    id: 'q-tls-09',
    topicId: 'tls-cryptography',
    category: 'comparison',
    difficulty: 'intermediate',
    prompt: 'Compare the TLS 1.2 and TLS 1.3 handshakes. What improved in 1.3?',
    rubric: createRubric({
      requiredConcepts: [
        'TLS 1.3 reduces round trips (1-RTT full handshake, 0-RTT resumption with caveats)',
        'TLS 1.3 removes weak legacy algorithms and mandates forward secrecy',
        'TLS 1.2 handshake has more optional messages and downgrade risk',
      ],
      mechanismSteps: [
        'TLS 1.2: often 2-RTT full handshake with more cipher suite complexity',
        'TLS 1.3: ServerHello + encrypted extensions in fewer flights',
        '1.3 encrypts handshake earlier',
        'Both still require certificate validation',
      ],
      prohibitedClaims: [
        'TLS 1.3 eliminates the need for certificates',
        'TLS 1.2 and 1.3 handshakes are identical',
        'TLS only uses public key for all data',
      ],
      terminologyKeywords: ['TLS 1.2', 'TLS 1.3', 'round trip', '0-RTT', 'forward secrecy'],
    }),
    modelAnswer: {
      id: 'ma-q-tls-09',
      topicId: 'tls-cryptography',
      estimatedSeconds: 70,
      definition:
        'TLS 1.3 is a streamlined revision of TLS that reduces handshake latency, removes insecure algorithms, and mandates modern cryptographic practices compared to TLS 1.2.',
      mechanism:
        'A full TLS 1.2 handshake typically takes two round trips: ClientHello, then ServerHello with certificate and key exchange, then client finishes. TLS 1.3 compresses this to one round trip for new sessions by sending key shares in ClientHello and encrypting more of the handshake sooner. TLS 1.3 dropped RSA key transport, CBC-mode ciphers without AEAD, and static DH without ephemeral properties. Optional 0-RTT early data can resume sessions faster but has replay considerations. TLS 1.2 remains common but requires careful cipher curation.',
      benefit:
        'Faster page loads, smaller attack surface, and forward secrecy by default improve both performance and security posture.',
      risk:
        'Legacy clients or middleboxes that only understand TLS 1.2 may break if 1.2 is disabled abruptly. 0-RTT data is replayable and must not carry non-idempotent operations without safeguards.',
      example:
        'Cloudflare and major browsers default to TLS 1.3; a legacy embedded device on TLS 1.2 with only RC4 suites would fail against a hardened server.',
      conclusion:
        'Migrate to TLS 1.3 where possible, but plan compatibility testing—1.3 is faster and safer, not just a version bump.',
    },
    hints: [
      'Focus on round-trip count and removed weak algorithms.',
      'Mention 0-RTT as optional with replay caveats.',
      'Note that certificate validation still happens in both versions.',
    ],
  },
  {
    id: 'q-tls-10',
    topicId: 'tls-cryptography',
    category: 'architecture',
    difficulty: 'assessment',
    prompt:
      'Your API uses TLS termination at a load balancer before traffic reaches application servers on a private network. What security implications does this architecture have?',
    rubric: createRubric({
      requiredConcepts: [
        'TLS terminates at load balancer—LB decrypts traffic',
        'Traffic between LB and app servers may be plaintext on private network',
        'Certificate and key management concentrated at edge',
        'mTLS or re-encryption may be needed for compliance',
      ],
      mechanismSteps: [
        'Client establishes TLS to load balancer public endpoint',
        'LB validates/decrypts and forwards HTTP to backend pool',
        'Backend may see unencrypted HTTP on VPC network',
        'Optional: LB-to-backend TLS or service mesh mTLS',
      ],
      prohibitedClaims: [
        'TLS termination means end-to-end encryption to the application process automatically',
        'Private networks never need encryption',
        'TLS only uses public key for all data',
      ],
      terminologyKeywords: [
        'TLS termination',
        'load balancer',
        'mTLS',
        'defense in depth',
        'VPC',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-tls-10',
      topicId: 'tls-cryptography',
      estimatedSeconds: 80,
      definition:
        'TLS termination at a load balancer means the public TLS session ends at the edge proxy, which decrypts traffic before forwarding it to backend application servers.',
      mechanism:
        'Clients connect to the LB\'s certificate on port 443. The LB completes the handshake, validates nothing on behalf of backends for inbound client certs unless configured, and forwards plain HTTP or re-encrypted HTTPS to internal hosts. This centralizes certificate renewal and WAF inspection but creates a trust zone boundary: anyone with access to the private network or LB logs sees decrypted payloads. Compliance regimes (PCI, HIPAA) may require TLS or mTLS on the hop between LB and app.',
      benefit:
        'Simplifies cert management, enables centralized rate limiting and DDoS protection, and offloads crypto CPU from application servers.',
      risk:
        'Insider threat or VPC compromise exposes plaintext. Misconfigured security groups, verbose LB access logs, and missing backend encryption are common gaps.',
      example:
        'AWS ALB terminates TLS with an ACM certificate, forwards HTTP to EC2 on port 8080; security team adds mesh mTLS after internal pen test finding.',
      conclusion:
        'TLS termination is an architectural tradeoff—secure the client-to-edge hop, then consciously decide whether the internal hop also needs protection.',
    },
    hints: [
      'Draw the trust boundary at the load balancer.',
      'Discuss plaintext on internal network as a risk.',
      'Mention mTLS or re-encryption as mitigations.',
    ],
  },
  {
    id: 'q-tls-11',
    topicId: 'tls-cryptography',
    category: 'risk-tradeoff',
    difficulty: 'intermediate',
    prompt: 'What are the main operational tradeoffs of deploying TLS at scale?',
    rubric: createRubric({
      requiredConcepts: [
        'Handshake latency and CPU cost per connection',
        'Certificate lifecycle management and renewal automation',
        'Cipher policy maintenance and legacy client compatibility',
        'Monitoring and incident response for cert or protocol failures',
      ],
      mechanismSteps: [
        'Each new connection pays handshake RTT and crypto CPU',
        'Certs must be renewed before expiry across all endpoints',
        'Cipher suites must be updated as threats evolve',
        'Session resumption reduces repeat handshake cost',
      ],
      prohibitedClaims: [
        'TLS has zero performance cost',
        'Once configured, TLS requires no ongoing maintenance',
        'TLS only uses public key for all data',
      ],
      terminologyKeywords: [
        'latency',
        'handshake',
        'certificate renewal',
        'cipher policy',
        'HSTS',
        'session resumption',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-tls-11',
      topicId: 'tls-cryptography',
      estimatedSeconds: 65,
      definition:
        'Deploying TLS at scale introduces tradeoffs between security strength, performance, operational complexity, and compatibility with diverse clients.',
      mechanism:
        'Every HTTPS connection incurs handshake round trips and asymmetric crypto before symmetric bulk encryption begins. High-traffic APIs mitigate this with TLS 1.3, session tickets, and connection pooling. Operators must automate certificate issuance and renewal (ACME), monitor expiry across regions, and maintain cipher policies that block weak algorithms without breaking embedded clients. HSTS, OCSP stapling, and key rotation add operational steps but improve security.',
      benefit:
        'Despite costs, TLS is non-negotiable for confidentiality and integrity on the public internet—the tradeoff is how to implement it efficiently, not whether to use it.',
      risk:
        'Under-investment in automation leads to outages. Over-aggressive hardening (TLS 1.3 only, short cert lifetimes without staging) can break partners. CPU spikes during traffic surges if resumption is disabled.',
      example:
        'A fintech API handles 10k RPS: engineers enable TLS session tickets and ECDHE to cut handshake CPU 40%, while Datadog alerts fire 14 days before cert expiry.',
      conclusion:
        'Treat TLS as living infrastructure—balance security, latency, and ops burden with automation and measured rollout of policy changes.',
    },
    hints: [
      'Name at least two costs: latency/CPU and cert management.',
      'Include session resumption as a mitigation.',
      'Give a concrete operational example.',
    ],
  },
  {
    id: 'q-tls-12',
    topicId: 'tls-cryptography',
    category: 'follow-up',
    difficulty: 'pressure',
    prompt:
      'Follow-up: You said ECDHE provides forward secrecy. What happens to recorded traffic if the server\'s certificate private key is stolen next month—but ephemeral keys were used correctly?',
    rubric: createRubric({
      requiredConcepts: [
        'Ephemeral DH secrets are not recoverable from stolen cert private key alone',
        'Past session keys were derived from ephemeral values and discarded',
        'Attacker could impersonate server going forward with stolen key',
      ],
      mechanismSteps: [
        'Recorded ciphertext exists from past sessions',
        'Stolen key is long-term authentication key, not session key',
        'Without ephemeral secrets, past traffic stays confidential',
        'New connections at risk if attacker can also obtain valid cert or MITM',
      ],
      prohibitedClaims: [
        'Stolen private key always decrypts all historical TLS traffic',
        'Forward secrecy protects against future impersonation automatically',
        'TLS only uses public key for all data',
      ],
      terminologyKeywords: [
        'forward secrecy',
        'ECDHE',
        'ephemeral',
        'private key compromise',
        'recorded traffic',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-tls-12',
      topicId: 'tls-cryptography',
      estimatedSeconds: 60,
      definition:
        'With proper forward secrecy, stealing the certificate\'s long-term private key does not allow decryption of previously recorded TLS sessions that used ephemeral key exchange.',
      mechanism:
        'Each past session used unique ephemeral ECDHE parameters to derive session keys. Those ephemeral private values were discarded at session end and were never encrypted solely with the long-term RSA/ECDSA authentication key in modern ECDHE suites. The attacker holding the stolen cert key can sign fraudulent handshakes and impersonate the server to new victims, but cannot rewind and derive old session keys from ciphertext they captured earlier.',
      benefit:
        'Forward secrecy limits blast radius of key compromise to future impersonation, not bulk historical decryption.',
      risk:
        'Immediate cert revocation and reissuance are still required. If sessions used legacy RSA key transport without ephemeral DH, historical traffic may be decryptable. Poor key storage could also leak ephemeral material.',
      example:
        'Heartbleed-era lessons: even after patching, forward-secure sessions protected past traffic better than static key transport would have.',
      conclusion:
        'Forward secrecy decouples past confidentiality from long-term key compromise—enable ECDHE and plan for cert revocation when keys leak.',
    },
    hints: [
      'Separate past decryption from future impersonation risks.',
      'Emphasize ephemeral secrets are gone after the session.',
      'Mention cert revocation is still urgent.',
    ],
  },
  {
    id: 'q-tls-13',
    topicId: 'tls-cryptography',
    category: 'scenario',
    difficulty: 'assessment',
    prompt:
      'A mobile app developer disables certificate hostname validation to fix a staging environment bug and ships it to production. Describe the security impact.',
    rubric: createRubric({
      requiredConcepts: [
        'Skipping hostname validation accepts any valid-chain cert for wrong host',
        'Enables MITM even when encryption is present',
        'Differs from pinning but equally dangerous when validation is off',
      ],
      mechanismSteps: [
        'App opens TLS connection',
        'Server presents certificate for different hostname',
        'Validation bypass accepts cert anyway',
        'Attacker on network can intercept with own cert',
      ],
      prohibitedClaims: [
        'TLS encryption alone prevents MITM without validation',
        'Disabling validation only affects staging if the same build goes to prod',
        'TLS only uses public key for all data',
      ],
      terminologyKeywords: [
        'hostname validation',
        'certificate pinning',
        'MITM',
        'trust manager',
        'production',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-tls-13',
      topicId: 'tls-cryptography',
      estimatedSeconds: 70,
      definition:
        'Disabling TLS hostname validation means the app accepts any certificate that chains to a trusted CA regardless of whether it was issued for the server being contacted, enabling trivial MITM attacks.',
      mechanism:
        'Proper validation checks that the certificate SAN matches the API hostname. A developer who overrides TrustManager or NSURLSession delegate to always return true destroys this check. An attacker on the same network presents a legitimate cert for attacker.com signed by a public CA; the app encrypts traffic to the attacker, who decrypts, logs credentials, and forwards to the real API. Encryption is present but misdirected—the user is not talking to the intended party.',
      benefit:
        'There is no security benefit; the fix belongs in staging infrastructure (correct DNS, cert, or debug-only build flags), not production validation bypass.',
      risk:
        'Credential theft, session hijacking, and regulatory breach. App store review may not catch custom networking code. Pinning without backup pins adds separate outage risk.',
      example:
        'A fintech app hardcodes trust-all in OkHttp CertificatePinner bypass; coffee-shop attacker harvests OAuth tokens using a cheap rogue AP.',
      conclusion:
        'Never ship validation bypasses to production—use proper staging certs, build flavors, or corporate proxy trust stores for debugging only.',
    },
    hints: [
      'Explain that encryption to the wrong party is still a MITM.',
      'Contrast staging workaround vs production requirement.',
      'Mention build flavors or debug-only flags as the right fix.',
    ],
  },
  {
    id: 'q-tls-14',
    topicId: 'tls-cryptography',
    category: 'definition',
    difficulty: 'foundation',
    prompt: 'What is Server Name Indication (SNI), and why is it used in TLS?',
    rubric: createRubric({
      requiredConcepts: [
        'SNI is a TLS extension carrying the target hostname in ClientHello',
        'Enables virtual hosting of multiple HTTPS sites on one IP address',
        'Server selects correct certificate based on SNI hostname',
      ],
      mechanismSteps: [
        'Client includes server_name extension in ClientHello',
        'Server reads hostname before sending certificate',
        'Server returns cert matching that hostname',
        'Without SNI, server may send default cert causing mismatch',
      ],
      prohibitedClaims: [
        'SNI encrypts the hostname so nobody can see which site you visit',
        'SNI replaces certificate validation entirely',
        'TLS only uses public key for all data',
      ],
      terminologyKeywords: ['SNI', 'Server Name Indication', 'ClientHello', 'virtual host', 'SAN'],
    }),
    modelAnswer: {
      id: 'ma-q-tls-14',
      topicId: 'tls-cryptography',
      estimatedSeconds: 55,
      definition:
        'Server Name Indication (SNI) is a TLS extension that lets the client send the intended hostname in ClientHello so the server can present the correct certificate when multiple sites share one IP.',
      mechanism:
        'Before SNI, HTTPS virtual hosting on a shared IP was problematic because the server sent a single default certificate before HTTP Host header was available. SNI carries the hostname (e.g., www.example.com) in cleartext during ClientHello. The server uses it to pick the right cert from its store. The client still must validate that cert\'s SAN matches the hostname.',
      benefit:
        'Millions of websites share hosting infrastructure economically without dedicating an IP per domain.',
      risk:
        'SNI is visible to network observers—it is not privacy protection (ESNI/ECH aim to address that separately). Missing SNI on old clients can cause cert mismatch errors.',
      example:
        'A CDN edge serves thousands of customer domains from one anycast IP; each ClientHello SNI triggers the matching customer TLS certificate.',
      conclusion:
        'SNI is essential plumbing for modern HTTPS hosting—know it is sent in cleartext and distinct from encrypted application data.',
    },
    hints: [
      'Explain the multiple-sites-one-IP problem SNI solves.',
      'Note SNI is in ClientHello, before the cert is sent.',
      'Clarify SNI does not hide the hostname from the network.',
    ],
  },
];
