import type { Topic } from '../../types';

export const ciaTriadTopic: Topic = {
  id: 'cia-triad',
  title: 'CIA Triad and Foundational Principles',
  day: 6,
  tags: ['confidentiality', 'integrity', 'availability', 'least-privilege', 'defense-in-depth'],
  plainDefinition:
    'The CIA triad is the three core security goals: keep data secret (confidentiality), correct (integrity), and accessible when needed (availability).',
  technicalDefinition:
    'Confidentiality limits disclosure to authorized parties; integrity ensures data and systems are not improperly modified; availability ensures timely, reliable access. Real systems map controls to each pillar.',
  mechanism: [
    'Confidentiality: encryption at rest and in transit, access control, classification, need-to-know.',
    'Integrity: hashing, digital signatures, checksums, version control, audit logs, input validation.',
    'Availability: redundancy, load balancing, failover, backups, disaster recovery, DDoS mitigation, monitoring.',
    'Least privilege restricts accounts and services to minimum required permissions.',
    'Defense in depth stacks controls so one failure does not collapse security.',
    'Tradeoffs: strong encryption can impact performance; high availability costs money; audit logs affect privacy.',
  ],
  securityBenefit:
    'Provides a framework to evaluate whether controls address disclosure, tampering, or outage risks for a given system.',
  risksAndTradeoffs: [
    'Over-focusing on confidentiality may neglect availability (ransomware recovery).',
    'Integrity without availability still halts business operations.',
    'Perfect availability without integrity serves corrupted or malicious data.',
    'Controls must match asset criticality and regulatory context (e.g., healthcare).',
  ],
  realWorldExample:
    'Healthcare app: TLS + field-level encryption (confidentiality), signed prescriptions and audit trails (integrity), multi-region deployment with backups and health checks (availability).',
  commonMisconception:
    'Encryption alone does not provide integrity for stored data—use authenticated encryption or separate MAC/signature where tampering matters.',
  modelAnswer: {
    id: 'cia-model-healthcare',
    topicId: 'cia-triad',
    estimatedSeconds: 80,
    definition:
      'CIA stands for confidentiality, integrity, and availability—the three foundational properties security controls protect.',
    mechanism:
      'Confidentiality uses encryption and access control to limit who reads PHI. Integrity uses signing, hashing, and audit logs to detect unauthorized changes to records. Availability uses replicated databases, backups, and monitoring so clinicians can access systems during failures or attacks.',
    benefit:
      'Gives a structured way to argue whether a design addresses the right risk for patient data and uptime requirements.',
    risk:
      'Balancing pillars is hard—strict access hurts emergency availability; weak backups destroy availability after ransomware.',
    example:
      'Electronic health record: role-based access to charts, checksums on imaging files, hot standby DB with hourly backups.',
    conclusion:
      'Strong security explicitly maps each control to confidentiality, integrity, or availability rather than vague "make it secure."',
  },
  weakAnswer:
    'CIA means encrypt everything and the system is secure.',
  weakAnswerExplanation:
    'Collapses all pillars into encryption; no integrity or availability controls; no concrete system example.',
  followUpQuestions: [
    'Give a real integrity failure example.',
    'How does ransomware affect availability?',
    'How does least privilege support confidentiality?',
    'Difference between hashing and encryption?',
  ],
  relatedTopicIds: ['tls-cryptography', 'defensive-security', 'sql-injection'],
};
