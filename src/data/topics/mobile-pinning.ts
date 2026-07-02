import type { Topic } from '../../types';

export const mobilePinningTopic: Topic = {
  id: 'mobile-pinning',
  title: 'Mobile Security and Certificate Pinning',
  day: 6,
  tags: ['certificate-pinning', 'mobile', 'tls', 'mitm', 'rotation'],
  plainDefinition:
    'Certificate pinning makes a mobile app trust only specific certificates or public keys instead of any valid CA-issued cert—adding protection beyond default TLS validation.',
  technicalDefinition:
    'Certificate or public key pinning embeds expected SPKI hashes or certificates in the app so that, even if a user-installed CA or compromised CA issues a valid chain, the connection is rejected unless it matches the pin set.',
  mechanism: [
    'Normal TLS: device trusts system CA store; any CA-issued valid cert for hostname is accepted.',
    'Pinning: app compares server cert or public key hash to hardcoded or remotely configured pins.',
    'On mismatch, connection aborts—blocks many corporate proxies and MITM tools.',
    'Backup pins included so primary cert rotation does not brick all clients at once.',
    'Pin updates require app release or secure remote pin configuration with signing.',
    'Operational teams coordinate cert renewal with app updates or pin rollover windows.',
  ],
  securityBenefit:
    'Reduces MITM risk when attackers or malware install custom CAs or when CA compromise occurs—common motivation for high-security mobile apps.',
  risksAndTradeoffs: [
    'Missed rotation breaks all app connectivity until users update—severe outage.',
    'Pinning in browsers is largely deprecated (HPKP); mobile still uses custom implementations.',
    'Not needed for every app—adds maintenance burden.',
    'Debugging and corporate SSL inspection become harder.',
    'Pinning wrong key (leaf vs intermediate) causes fragile deployments.',
  ],
  realWorldExample:
    'Banking iOS app pins the API server public key SPKI hash; when infra renews cert with new key, release ships backup pin first, then switches primary pin next version.',
  commonMisconception:
    'Pinning is not free security—it creates serious operational risk if rotation and backup pins are not managed.',
  modelAnswer: {
    id: 'pinning-model-tradeoff',
    topicId: 'mobile-pinning',
    estimatedSeconds: 75,
    definition:
      'Certificate pinning is when a mobile app only accepts TLS connections that match preconfigured certificate or public key pins.',
    mechanism:
      'After standard TLS handshake, the app hashes the server public key or certificate and compares it to embedded pins. If none match, it closes the connection even when the chain is CA-valid.',
    benefit:
      'Blocks MITM that relies on user-installed or fraudulent CAs—useful for high-value mobile APIs.',
    risk:
      'Certificate rotation without coordinated pin updates bricks the app for users until they upgrade; backup pins and rollout planning are mandatory.',
    example:
      'Android app uses OkHttp CertificatePinner with primary and backup SHA-256 pins for api.fintech.com.',
    conclusion:
      'Pinning strengthens trust for specific threats but trades flexibility—use only when the threat model justifies the operational cost.',
  },
  weakAnswer:
    'Pinning makes TLS perfect so MITM is impossible and there are no downsides.',
  weakAnswerExplanation:
    'Ignores rotation outages, backup pins, and when pinning is inappropriate. Overclaims impossibility.',
  followUpQuestions: [
    'Public key pinning vs full certificate pinning?',
    'What happens if you pin only the leaf and cert renews?',
    'Why is pinning risky for most consumer apps?',
    'How do backup pins help rotation?',
  ],
  relatedTopicIds: ['tls-cryptography', 'cia-triad'],
};
