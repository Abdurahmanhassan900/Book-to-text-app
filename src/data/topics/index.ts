import type { Topic, TopicId } from '../../types';

// Phase 3 will expand every topic. Day 1 TLS is stubbed with structure only.
export const topics: Topic[] = [
  {
    id: 'tls-cryptography',
    title: 'TLS and Cryptography',
    day: 1,
    tags: ['tls', 'cryptography', 'certificates', 'handshake'],
    plainDefinition: 'TLS encrypts network traffic between a client and server and verifies the server identity.',
    technicalDefinition:
      'Transport Layer Security (TLS) is a cryptographic protocol that provides confidentiality, integrity, and authenticated communication over a transport connection, typically TCP port 443 for HTTPS.',
    mechanism: [
      'Client initiates TCP connection and sends ClientHello with supported TLS versions and cipher suites.',
      'Server responds with ServerHello, certificate chain, and key exchange parameters.',
      'Client validates certificate chain, hostname, expiration, and revocation status.',
      'Both parties derive a shared session key, often via ephemeral Diffie-Hellman (ECDHE).',
      'Symmetric encryption protects application data using the session key.',
    ],
    securityBenefit:
      'Protects data in transit from eavesdropping and tampering on untrusted networks while authenticating the server.',
    risksAndTradeoffs: [
      'Adds handshake latency and CPU overhead.',
      'Certificate misconfiguration can break connectivity or weaken trust.',
      'Compromised CAs or failure to validate chains enables MITM attacks.',
      'Legacy TLS versions and weak cipher suites reduce security.',
    ],
    realWorldExample:
      'A browser connecting to https://api.example.com validates the server certificate before sending an API request with an Authorization header.',
    commonMisconception:
      'TLS does not encrypt application data using only public-key cryptography for the entire session; it uses asymmetric crypto mainly during the handshake to establish a faster symmetric session key.',
    modelAnswer: {
      id: 'tls-model-handshake',
      topicId: 'tls-cryptography',
      estimatedSeconds: 75,
      definition:
        'TLS is a protocol that encrypts and authenticates communication between a client and server over a network connection.',
      mechanism:
        'The client sends ClientHello with TLS version and cipher suites. The server replies with ServerHello, its certificate, and key exchange parameters. The client validates the certificate chain, hostname, and signature, then both sides derive a session key—often with ECDHE—and switch to symmetric encryption for application data.',
      benefit:
        'It protects confidentiality and integrity on untrusted networks and verifies the server identity before sensitive data is sent.',
      risk: 'Handshake overhead, certificate expiry, weak ciphers, and poor validation can cause outages or security gaps.',
      example: 'Every HTTPS request from a mobile app to a cloud API on port 443.',
      conclusion:
        'TLS establishes an authenticated, encrypted channel so application data is not sent in plaintext over the internet.',
    },
    weakAnswer:
      'TLS makes websites secure by using encryption keys. The server sends a certificate and then data is encrypted.',
    weakAnswerExplanation:
      'Missing handshake steps, no mention of cipher negotiation, certificate validation, session keys, or tradeoffs. Sounds theoretical without operational detail.',
    followUpQuestions: [
      'Why does TLS use both asymmetric and symmetric cryptography?',
      'What is forward secrecy and why does ECDHE matter?',
      'What happens if hostname validation fails?',
    ],
    relatedTopicIds: ['cia-triad', 'mobile-pinning'],
  },
];

export const topicMap: Record<TopicId, Topic | undefined> = {
  'tls-cryptography': topics.find((t) => t.id === 'tls-cryptography'),
  'sql-injection': undefined,
  'jwt-authentication': undefined,
  'sast-dast': undefined,
  'api-rate-limiting': undefined,
  'defensive-security': undefined,
  'mobile-pinning': undefined,
  'cia-triad': undefined,
};

export function getTopic(id: TopicId): Topic | undefined {
  return topics.find((t) => t.id === id);
}

export function getAllTopicIds(): TopicId[] {
  return topics.map((t) => t.id);
}
