import type { PracticeQuestion } from '../../types';
import { createRubric } from '../rubrics/helpers';

export const ciaQuestions: PracticeQuestion[] = [
  {
    id: 'q-cia-01',
    topicId: 'cia-triad',
    category: 'scenario',
    difficulty: 'assessment',
    prompt: 'Give a confidentiality, integrity, and availability control for a healthcare application.',
    rubric: createRubric({
      requiredConcepts: [
        'one control per CIA pillar',
        'healthcare context such as PHI',
        'concrete not vague controls',
      ],
      mechanismSteps: [
        'Name confidentiality control for PHI',
        'Name integrity control for records',
        'Name availability control for clinical access',
      ],
      prohibitedClaims: ['encryption alone covers all CIA pillars'],
      terminologyKeywords: ['confidentiality', 'integrity', 'availability', 'PHI', 'healthcare'],
    }),
    modelAnswer: {
      id: 'q-cia-01-model',
      questionId: 'q-cia-01',
      topicId: 'cia-triad',
      estimatedSeconds: 80,
      definition:
        'Healthcare systems must protect patient data secrecy (confidentiality), prevent unauthorized changes (integrity), and keep clinical workflows online (availability).',
      mechanism:
        'Confidentiality: TLS in transit plus AES-256 encryption at rest for PHI fields with role-based access so only care teams read charts. Integrity: digital signatures or HMAC on prescription records and immutable audit logs detecting unauthorized edits. Availability: multi-AZ database replicas, hourly backups, and health-checked failover so ER staff access charts during outages.',
      benefit:
        'Maps regulatory expectations (HIPAA-style) to explicit controls auditors and engineers can verify.',
      risk:
        'Strict confidentiality can block emergency break-glass access; integrity logging adds latency; high availability increases cost and attack surface.',
      example:
        'EHR: RBAC + field encryption for notes, signed medication orders, hot standby DB with RPO under one hour.',
      conclusion:
        'Strong answers name one real control per pillar tied to patient care—not generic “encrypt everything.”',
    },
    hints: ['Pick one example per letter C-I-A.', 'Think PHI, tampered records, and ER uptime.'],
  },
  {
    id: 'q-cia-02',
    topicId: 'cia-triad',
    category: 'definition',
    difficulty: 'foundation',
    prompt: 'Define confidentiality, integrity, and availability in the CIA triad.',
    rubric: createRubric({
      requiredConcepts: [
        'confidentiality limits disclosure',
        'integrity prevents unauthorized modification',
        'availability ensures timely access',
      ],
      mechanismSteps: [
        'Define each pillar in one sentence',
        'Give a simple non-healthcare example each',
      ],
      terminologyKeywords: ['confidentiality', 'integrity', 'availability', 'CIA'],
    }),
    modelAnswer: {
      id: 'q-cia-02-model',
      questionId: 'q-cia-02',
      topicId: 'cia-triad',
      estimatedSeconds: 60,
      definition:
        'The CIA triad names three security goals: confidentiality (secrecy), integrity (correctness), and availability (reliable access).',
      mechanism:
        'Confidentiality ensures only authorized subjects read data—via encryption and access control. Integrity ensures data and systems are not altered without authorization—via hashing, signatures, and validation. Availability ensures authorized users can use systems when needed—via redundancy, monitoring, and recovery.',
      benefit:
        'Provides a vocabulary to classify controls and gaps instead of vague “make it secure.”',
      risk:
        'Optimizing one pillar can harm another—encrypting backups without key recovery hurts availability.',
      example:
        'Payroll: confidential salaries, integrity of pay amounts via audit trail, availability of portal on payday.',
      conclusion:
        'Every security decision should state which pillar(s) it primarily protects.',
    },
    hints: ['C = who can read?', 'I = can data change?', 'A = can users reach it?'],
  },
  {
    id: 'q-cia-03',
    topicId: 'cia-triad',
    category: 'mechanism',
    difficulty: 'foundation',
    prompt: 'How does least privilege support confidentiality?',
    rubric: createRubric({
      requiredConcepts: ['minimum permissions needed', 'reduces unauthorized read access', 'role-based example'],
      mechanismSteps: [
        'Define least privilege',
        'Link to limiting disclosure',
        'Give healthcare or general RBAC example',
      ],
      terminologyKeywords: ['least privilege', 'RBAC', 'access control'],
    }),
    modelAnswer: {
      id: 'q-cia-03-model',
      questionId: 'q-cia-03',
      topicId: 'cia-triad',
      estimatedSeconds: 65,
      definition:
        'Least privilege grants users and services only the permissions required for their role, shrinking who can read sensitive data.',
      mechanism:
        'RBAC maps jobs to permission sets—billing clerks see claims, not full clinical notes. Service accounts get scoped API tokens instead of admin DB credentials. Periodic access reviews revoke stale rights.',
      benefit:
        'Limits insider threat and blast radius when credentials are phished—attackers inherit only narrow access.',
      risk:
        'Overly tight roles block work; privilege creep if exceptions never expire; complex policies are misconfigured.',
      example:
        'Hospital nurse accesses assigned patients only; researcher gets de-identified dataset without names.',
      conclusion:
        'Least privilege is a primary confidentiality control complementing encryption.',
    },
    hints: ['Does every employee need admin?', 'What happens when creds are stolen?'],
  },
  {
    id: 'q-cia-04',
    topicId: 'cia-triad',
    category: 'architecture',
    difficulty: 'intermediate',
    prompt: 'Explain defense in depth using the CIA triad.',
    rubric: createRubric({
      requiredConcepts: ['multiple layers per pillar', 'one failure does not collapse security'],
      mechanismSteps: [
        'Define defense in depth',
        'Map layered controls to C I A',
        'Give brief example stack',
      ],
      terminologyKeywords: ['defense in depth', 'layered', 'CIA'],
    }),
    modelAnswer: {
      id: 'q-cia-04-model',
      questionId: 'q-cia-04',
      topicId: 'cia-triad',
      estimatedSeconds: 75,
      definition:
        'Defense in depth stacks independent controls so a single failure does not fully lose confidentiality, integrity, or availability.',
      mechanism:
        'Confidentiality layers: network segmentation, encryption, DLP, access logs. Integrity layers: input validation, signed updates, database constraints, audit trails. Availability layers: load balancers, replicas, backups, DDoS scrubbing.',
      benefit:
        'Attackers must defeat several mechanisms; misconfigurations in one layer are compensated elsewhere.',
      risk:
        'Duplicated controls waste budget; complexity obscures gaps; teams assume “many tools” equals coverage.',
      example:
        'Web app: WAF + TLS + app auth (C), code signing + DB checksums (I), multi-region + backups (A).',
      conclusion:
        'Classify each layer by which CIA pillar it serves to avoid blind spots.',
    },
    hints: ['What if only the firewall fails?', 'Name one layer per pillar.'],
  },
  {
    id: 'q-cia-05',
    topicId: 'cia-triad',
    category: 'scenario',
    difficulty: 'intermediate',
    prompt: 'How does ransomware primarily threaten availability, and what integrity risks remain?',
    rubric: createRubric({
      requiredConcepts: ['encrypts data blocking access', 'may exfiltrate or alter data', 'backups for recovery'],
      mechanismSteps: [
        'Describe encryption of files blocking use',
        'Note possible data theft or tampering',
        'Mention backup and restore strategy',
      ],
      terminologyKeywords: ['ransomware', 'availability', 'integrity', 'backup'],
    }),
    modelAnswer: {
      id: 'q-cia-05-model',
      questionId: 'q-cia-05',
      topicId: 'cia-triad',
      estimatedSeconds: 75,
      definition:
        'Ransomware chiefly destroys availability by encrypting systems, but attackers may also steal or alter data, threatening confidentiality and integrity.',
      mechanism:
        'Malware encrypts production files and databases; hospitals cannot access EHRs (availability loss). Double-extortion exfiltrates PHI (confidentiality). Some strains alter or delete backups and logs (integrity). Recovery needs offline immutable backups and tested restore.',
      benefit:
        'Framing ransomware across CIA drives complete response—restore, breach notification, log forensics—not just decryption payment debate.',
      risk:
        'Paying ransom does not guarantee restore; weak backups mean prolonged outage; restored data may already be tampered.',
      example:
        'Clinic offline three days; attackers publish stolen records; integrity verified by comparing backup checksums before restore.',
      conclusion:
        'Treat ransomware as availability crisis with confidentiality and integrity follow-on impacts.',
    },
    hints: ['Can staff open patient files during encryption?', 'Were files only encrypted or also copied out?'],
  },
  {
    id: 'q-cia-06',
    topicId: 'cia-triad',
    category: 'comparison',
    difficulty: 'intermediate',
    prompt: 'Why does encryption alone not guarantee integrity for stored healthcare records?',
    rubric: createRubric({
      requiredConcepts: ['encryption provides confidentiality not tamper detection', 'need MAC signature or AEAD'],
      mechanismSteps: [
        'State encryption purpose',
        'Explain ciphertext malleability or lack of auth',
        'Name integrity mechanisms',
      ],
      prohibitedClaims: ['AES encryption automatically detects tampering'],
      terminologyKeywords: ['encryption', 'integrity', 'AEAD', 'HMAC', 'signature'],
    }),
    modelAnswer: {
      id: 'q-cia-06-model',
      questionId: 'q-cia-06',
      topicId: 'cia-triad',
      estimatedSeconds: 70,
      definition:
        'Confidentiality encryption hides content but does not by itself prove data was not altered—integrity needs authenticated encryption or separate verification.',
      mechanism:
        'AES-CBC without MAC can be malleable; attackers with storage access might flip ciphertext bits. Use AES-GCM (AEAD), encrypt-then-MAC, or digital signatures on records. Audit hashes detect unauthorized database updates.',
      benefit:
        'Clinicians trust that displayed vitals match what was recorded, not just that outsiders cannot read them.',
      risk:
        'Misunderstanding leads to “encrypted therefore safe” designs; key management still required for both properties.',
      example:
        'Imaging files stored with AES-GCM; EHR row changes logged with HMAC-chained audit entries.',
      conclusion:
        'Pair confidentiality controls with explicit integrity verification for stored PHI.',
    },
    hints: ['Can ciphertext be modified without the key?', 'What is AEAD?'],
  },
  {
    id: 'q-cia-07',
    topicId: 'cia-triad',
    category: 'mechanism',
    difficulty: 'foundation',
    prompt: 'Name availability controls for a critical web API and how they detect failure.',
    rubric: createRubric({
      requiredConcepts: ['redundancy load balancing', 'health checks', 'backups or failover'],
      mechanismSteps: [
        'List infrastructure redundancy',
        'Explain monitoring and health probes',
        'Mention RTO/RPO conceptually',
      ],
      terminologyKeywords: ['availability', 'load balancer', 'health check', 'failover'],
    }),
    modelAnswer: {
      id: 'q-cia-07-model',
      questionId: 'q-cia-07',
      topicId: 'cia-triad',
      estimatedSeconds: 70,
      definition:
        'Availability controls keep services reachable through redundant capacity, automated failover, and observability that triggers recovery.',
      mechanism:
        'Deploy multiple instances behind a load balancer with HTTP health checks removing unhealthy nodes. Use multi-AZ databases with automatic failover. Backups and runbooks define recovery time. DDoS protection and rate limits preserve capacity. Alerts on error rate and latency SLO breaches.',
      benefit:
        'Users experience minimal downtime during single component failures or traffic spikes.',
      risk:
        'Split-brain failover corrupts data; untested backups fail during real incidents; cost of idle standby capacity.',
      example:
        'API runs in three AZs; Route53 fails over when `/health` fails; on-call paged if 5xx exceeds 1% for five minutes.',
      conclusion:
        'Availability is engineered with redundancy plus measured detection—not assumed from a single server.',
    },
    hints: ['What happens when one VM dies?', 'How do you know the API is down?'],
  },
  {
    id: 'q-cia-08',
    topicId: 'cia-triad',
    category: 'mechanism',
    difficulty: 'intermediate',
    prompt: 'How do audit logs support integrity in a financial or healthcare system?',
    rubric: createRubric({
      requiredConcepts: ['append-only record of changes', 'detect unauthorized modification', 'non-repudiation support'],
      mechanismSteps: [
        'Describe what events are logged',
        'Explain tamper detection',
        'Note separation of duties for log access',
      ],
      terminologyKeywords: ['audit log', 'integrity', 'tamper', 'non-repudiation'],
    }),
    modelAnswer: {
      id: 'q-cia-08-model',
      questionId: 'q-cia-08',
      topicId: 'cia-triad',
      estimatedSeconds: 75,
      definition:
        'Audit logs record who changed what and when, enabling detection of unauthorized modifications and supporting investigations.',
      mechanism:
        'Applications write append-only entries for create/update/delete on sensitive records with user ID, timestamp, and before/after hashes. Ship logs to WORM storage or SIEM with integrity chaining. Alerts on anomalous bulk edits or admin actions.',
      benefit:
        'Integrity violations become visible; regulators expect traceability for PHI and financial transactions.',
      risk:
        'Logs themselves can be tampered if co-located with attackers; excessive logging captures sensitive data; retention costs.',
      example:
        'EHR logs every chart view and edit to immutable S3 Object Lock bucket; nightly hash verification job.',
      conclusion:
        'Audit trails are integrity detective controls—pair with preventive access controls.',
    },
    hints: ['Can you see who changed a diagnosis?', 'How do you protect the logs too?'],
  },
  {
    id: 'q-cia-09',
    topicId: 'cia-triad',
    category: 'mechanism',
    difficulty: 'foundation',
    prompt: 'What confidentiality controls apply to data in transit versus data at rest?',
    rubric: createRubric({
      requiredConcepts: ['TLS for transit', 'encryption at rest for storage', 'key management'],
      mechanismSteps: [
        'Describe in-transit protection',
        'Describe at-rest protection',
        'Mention key handling difference',
      ],
      terminologyKeywords: ['TLS', 'encryption at rest', 'in transit', 'KMS'],
    }),
    modelAnswer: {
      id: 'q-cia-09-model',
      questionId: 'q-cia-09',
      topicId: 'cia-triad',
      estimatedSeconds: 70,
      definition:
        'Data in transit needs channel encryption like TLS; data at rest needs disk/database encryption with managed keys separate from storage media.',
      mechanism:
        'In transit: HTTPS/TLS 1.2+, certificate validation, optional mTLS between services. At rest: AES encryption on databases, object storage, and backups via KMS or HSM; access controlled by IAM. Keys rotated and not stored with ciphertext.',
      benefit:
        'Stolen laptops or intercepted Wi-Fi do not expose plaintext PHI or credentials.',
      risk:
        'TLS terminated early exposes data inside network; poor key rotation; encrypted data still readable to authorized DB admins.',
      example:
        'Patient portal uses TLS 1.3; PostgreSQL TDE with AWS KMS CMK; backups encrypted with separate key.',
      conclusion:
        'Apply both transit and rest controls—attackers target networks and stolen drives differently.',
    },
    hints: ['What protects packets on the internet?', 'What if someone steals the disk?'],
  },
  {
    id: 'q-cia-10',
    topicId: 'cia-triad',
    category: 'risk-tradeoff',
    difficulty: 'intermediate',
    prompt: 'Describe a tradeoff between strong confidentiality and availability in emergency healthcare access.',
    rubric: createRubric({
      requiredConcepts: ['break-glass emergency access', 'strict RBAC vs ER needs', 'logging emergency overrides'],
      mechanismSteps: [
        'State confidentiality goal',
        'Describe emergency availability need',
        'Propose balanced control like break-glass',
      ],
      terminologyKeywords: ['break-glass', 'tradeoff', 'emergency', 'PHI'],
    }),
    modelAnswer: {
      id: 'q-cia-10-model',
      questionId: 'q-cia-10',
      topicId: 'cia-triad',
      estimatedSeconds: 75,
      definition:
        'Strict confidentiality controls can delay life-saving care when clinicians cannot access records—emergency workflows must balance both pillars.',
      mechanism:
        'Normal RBAC limits chart access to assigned patients. ER “break-glass” allows temporary broader read with mandatory reason codes, heightened audit, and post-incident review. Availability of records during outages may require local cached copies with encryption.',
      benefit:
        'Protects privacy day-to-day while permitting care when seconds matter.',
      risk:
        'Break-glass abuse exposes PHI; cached copies widen loss if device stolen; auditors scrutinize overrides.',
      example:
        'Unconscious patient arrives; ER physician activates break-glass, views full history, security reviews log next day.',
      conclusion:
        'Document explicit tradeoffs—availability in emergencies without abandoning confidentiality accountability.',
    },
    hints: ['What if the doctor is not on the care team?', 'How do you audit overrides?'],
  },
  {
    id: 'q-cia-11',
    topicId: 'cia-triad',
    category: 'scenario',
    difficulty: 'intermediate',
    prompt: 'How does role-based access control (RBAC) map to the CIA triad in a hospital application?',
    rubric: createRubric({
      requiredConcepts: ['RBAC primarily confidentiality', 'can limit integrity actions', 'indirect availability if misconfigured'],
      mechanismSteps: [
        'Explain RBAC mechanism',
        'Map to confidentiality primary',
        'Note write permissions and integrity',
      ],
      terminologyKeywords: ['RBAC', 'roles', 'confidentiality', 'permissions'],
    }),
    modelAnswer: {
      id: 'q-cia-11-model',
      questionId: 'q-cia-11',
      topicId: 'cia-triad',
      estimatedSeconds: 75,
      definition:
        'RBAC assigns permissions to roles (nurse, physician, billing) primarily enforcing confidentiality while scoping who can modify records (integrity).',
      mechanism:
        'Roles define read vs write vs admin capabilities—nurses update vitals, billing reads claims without clinical notes. Separation of duties prevents one role from approving and recording payments. Misconfigured deny rules can block care teams (availability impact).',
      benefit:
        'Scales access management across thousands of staff with policy-aligned defaults.',
      risk:
        'Role explosion and stale grants; emergency access gaps; coarse roles over-share data.',
      example:
        'Radiologist role reads imaging only; pharmacist role writes medication orders but not diagnoses.',
      conclusion:
        'RBAC is chiefly a confidentiality and least-privilege tool with integrity implications on write scopes.',
    },
    hints: ['Which pillar limits who reads charts?', 'Do all roles get write access?'],
  },
  {
    id: 'q-cia-12',
    topicId: 'cia-triad',
    category: 'architecture',
    difficulty: 'intermediate',
    prompt: 'How do backups and disaster recovery primarily support availability, and what confidentiality concerns exist?',
    rubric: createRubric({
      requiredConcepts: ['restore after outage or ransomware', 'encrypted backups', 'offline immutable copies'],
      mechanismSteps: [
        'Define RTO/RPO role',
        'Explain restore workflow',
        'Note backup encryption and access control',
      ],
      terminologyKeywords: ['backup', 'disaster recovery', 'RTO', 'RPO', 'availability'],
    }),
    modelAnswer: {
      id: 'q-cia-12-model',
      questionId: 'q-cia-12',
      topicId: 'cia-triad',
      estimatedSeconds: 75,
      definition:
        'Backups and DR restore operations after outages, corruption, or ransomware—core availability controls—with copies that must themselves protect confidentiality.',
      mechanism:
        'Scheduled snapshots and offsite replicas meet RPO targets; runbooks and drills meet RTO. Encrypt backups at rest, restrict restore permissions, use immutable storage against ransomware. Test restores quarterly—untested backups are assumptions.',
      benefit:
        'Organization survives datacenter loss or encryption attacks without permanent data unavailability.',
      risk:
        'Unencrypted backups leak PHI if stolen; overly broad restore rights enable insider theft; stale backups miss recent data.',
      example:
        'Nightly encrypted DB backup to geo-redundant object storage; annual full restore drill to staging.',
      conclusion:
        'Backups are availability insurance that must be confidentiality-hardened and integrity-verified before trust.',
    },
    hints: ['What if production is encrypted by ransomware?', 'Who can download backups?'],
  },
  {
    id: 'q-cia-13',
    topicId: 'cia-triad',
    category: 'mechanism',
    difficulty: 'assessment',
    prompt: 'How do digital signatures on software updates support integrity and indirectly availability?',
    rubric: createRubric({
      requiredConcepts: ['verify publisher and file hash', 'block tampered updates', 'bad updates could cause outage'],
      mechanismSteps: [
        'Explain signing and verification',
        'Link to integrity of code',
        'Note availability if malicious update deployed',
      ],
      terminologyKeywords: ['digital signature', 'code signing', 'integrity', 'update'],
    }),
    modelAnswer: {
      id: 'q-cia-13-model',
      questionId: 'q-cia-13',
      topicId: 'cia-triad',
      estimatedSeconds: 80,
      definition:
        'Code signing proves update packages come from the vendor and were not altered—an integrity control that prevents malicious binaries from taking systems offline.',
      mechanism:
        'Vendor signs release artifacts with private key; clients or MDM verify signature and hash before install. Reject unsigned or modified packages. Compromised signing keys require revocation and key rotation.',
      benefit:
        'Blocks supply-chain tampering that could corrupt patient devices or hospital servers.',
      risk:
        'Stolen code-signing keys enable trusted malware; failed verification blocks legitimate urgent patches (availability); users bypass warnings.',
      example:
        'Hospital infusion pump firmware only installs images signed by manufacturer CA pinned in device bootloader.',
      conclusion:
        'Signed updates protect integrity of the software supply chain—availability depends on deploying only authentic code.',
    },
    hints: ['What proves the update is genuine?', 'What if malware is installed as an “update”?'],
  },
];
