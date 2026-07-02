import type { Topic } from '../../types';

export const tlsTopic: Topic = {
  id: 'tls-cryptography',
  title: 'TLS and Cryptography',
  day: 1,
  tags: [
    'tls',
    'handshake',
    'certificates',
    'cipher-suites',
    'forward-secrecy',
    'public-key',
    'symmetric',
    'mitm',
  ],
  plainDefinition:
    'TLS is the protocol behind HTTPS. It encrypts data in transit and proves you are talking to the real server before sending sensitive information.',
  technicalDefinition:
    'Transport Layer Security (TLS) is a cryptographic protocol layered on TCP that negotiates algorithms, authenticates endpoints (typically the server via X.509 certificates), establishes shared session keys, and then protects application data with symmetric encryption and message authentication.',
  mechanism: [
    'TCP connection opens (e.g., client to server port 443).',
    'ClientHello: client offers TLS versions, cipher suites, random nonce, and extensions such as SNI (Server Name Indication).',
    'ServerHello: server selects TLS version and cipher suite, returns its random nonce.',
    'Server sends its certificate chain (leaf → intermediates → trust anchor) and key-exchange parameters (e.g., ECDHE public key).',
    'Optional: server may request a client certificate for mutual TLS (mTLS).',
    'Client validates the chain: trusted CA, unexpired, correct hostname (CN/SAN), not revoked (CRL/OCSP where configured).',
    'Client verifies the certificate signature using the issuer public key.',
    'Key exchange: parties combine key-exchange material (e.g., ECDHE) to derive a pre-master secret.',
    'Both sides derive session keys from the master secret using a key derivation function.',
    'ChangeCipherSpec / Finished messages confirm handshake integrity; application data flows encrypted with AES-GCM or ChaCha20-Poly1305.',
    'Session resumption (tickets or session IDs) can shorten later handshakes but must be configured safely.',
  ],
  securityBenefit:
    'Confidentiality and integrity for data on untrusted networks; server authentication prevents trivial man-in-the-middle against clients that validate certificates correctly.',
  risksAndTradeoffs: [
    'Handshake adds one to two round trips of latency plus CPU for crypto operations.',
    'Certificate expiry, hostname mismatch, or incomplete chain causes outages.',
    'Pinning or hard-coded trust without rotation planning breaks legitimate updates.',
    'Legacy TLS 1.0/1.1 or weak cipher suites (RC4, export-grade) weaken security.',
    'Compromised CA or failure to check revocation can enable MITM.',
    'Forward secrecy depends on ephemeral key exchange—static RSA key transport does not provide it.',
    'Operational burden: cert renewal, cipher policy, HSTS, and monitoring.',
  ],
  realWorldExample:
    'A mobile banking app opens HTTPS to api.bank.com. The OS trust store validates the Let\'s Encrypt chain, checks the SAN matches api.bank.com, negotiates TLS 1.3 with ECDHE and AES-256-GCM, then sends a JSON login request—the password never crosses the network in plaintext.',
  commonMisconception:
    'TLS does not encrypt the entire session with only public-key cryptography—that would be too slow. Asymmetric crypto authenticates and establishes keys during the handshake; bulk data uses symmetric session keys.',
  modelAnswer: {
    id: 'tls-model-full-connection',
    topicId: 'tls-cryptography',
    estimatedSeconds: 85,
    definition:
      'TLS is a protocol that provides encrypted, integrity-protected communication between a client and server over TCP, most commonly seen as HTTPS on port 443.',
    mechanism:
      'After TCP connects, the client sends ClientHello with supported TLS versions and cipher suites. The server responds with ServerHello, its certificate chain, and key-exchange parameters. The client validates the chain against trusted CAs, checks hostname and expiration, verifies signatures, then both sides perform key exchange—often ECDHE—to derive session keys. From that point, application data is encrypted with symmetric algorithms like AES-GCM.',
    benefit:
      'It stops passive eavesdropping and detects tampering on untrusted networks, and certificate validation helps ensure the client is talking to the intended server.',
    risk:
      'Misconfigured certificates, weak legacy protocols, missing forward secrecy, and validation bugs can break availability or allow MITM. Handshake cost matters at scale.',
    example:
      'Every browser loading https://github.com or an API gateway terminating TLS before routing to internal microservices.',
    conclusion:
      'TLS is the standard way modern systems protect data in transit by combining authenticated handshakes with fast symmetric encryption for the actual payload.',
  },
  weakAnswer:
    'TLS encrypts websites. The server has a certificate from a CA and then all traffic is secure.',
  weakAnswerExplanation:
    'No handshake steps, no cipher negotiation, no session keys, no hostname validation, no tradeoffs. Uses vague word "secure" without mechanism. Would score poorly on mechanism (25 pts) and risk (15 pts).',
  followUpQuestions: [
    'Why does TLS use both asymmetric and symmetric cryptography?',
    'Walk through certificate chain validation step by step.',
    'What is forward secrecy and how does ECDHE provide it?',
    'What happens during a man-in-the-middle attack if the client skips hostname validation?',
    'How do TLS 1.2 and 1.3 handshakes differ in round trips?',
    'What operational problems occur when a certificate expires?',
  ],
  relatedTopicIds: ['cia-triad', 'mobile-pinning'],
};
