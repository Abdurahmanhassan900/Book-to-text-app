import type { PracticeQuestion } from '../../types';
import { createRubric } from '../rubrics/helpers';

export const mobilePinningQuestions: PracticeQuestion[] = [
  {
    id: 'q-pin-01',
    topicId: 'mobile-pinning',
    category: 'definition',
    difficulty: 'intermediate',
    prompt: 'What is certificate pinning, and what operational problem can it create?',
    rubric: createRubric({
      requiredConcepts: [
        'app trusts only specific cert or public key pins',
        'blocks non-matching CA-valid chains',
        'rotation without coordination breaks connectivity',
      ],
      mechanismSteps: [
        'Define pinning vs default CA trust',
        'Explain SPKI or cert hash comparison',
        'Describe outage when pins are not updated',
      ],
      prohibitedClaims: ['pinning has no operational downsides', 'pinning makes MITM impossible'],
      terminologyKeywords: ['certificate pinning', 'SPKI', 'rotation', 'MITM'],
    }),
    modelAnswer: {
      id: 'q-pin-01-model',
      questionId: 'q-pin-01',
      topicId: 'mobile-pinning',
      estimatedSeconds: 75,
      definition:
        'Certificate pinning is when a mobile app accepts TLS connections only if the server certificate or public key matches preconfigured pins, not merely any chain trusted by the system CA store.',
      mechanism:
        'After the TLS handshake, the app hashes the server SPKI or certificate and compares it to embedded pins. On mismatch, the connection aborts even if the chain is CA-valid—blocking many MITM proxies and malicious CAs.',
      benefit:
        'Reduces MITM risk when users install custom CAs or when a CA is compromised—common for banking and high-value APIs.',
      risk:
        'The major operational problem is certificate rotation: if infra renews with a new key and pins are not updated in a coordinated app release, all users lose connectivity until they upgrade— a severe outage.',
      example:
        'iOS banking app pins api.bank.com SPKI; cert renewal with new key without backup pin bricks v2.1 clients until App Store update ships.',
      conclusion:
        'Pinning trades operational flexibility for stronger trust—only justified when rotation playbooks and backup pins are in place.',
    },
    hints: ['What happens at renewal if the public key changes?', 'Does a valid CA-issued cert always pass?'],
  },
  {
    id: 'q-pin-02',
    topicId: 'mobile-pinning',
    category: 'comparison',
    difficulty: 'intermediate',
    prompt: 'Compare public key pinning versus full certificate pinning.',
    rubric: createRubric({
      requiredConcepts: ['SPKI pinning survives cert reissue with same key', 'cert pinning breaks on any cert field change'],
      mechanismSteps: [
        'Define what each pin hashes',
        'Explain renewal impact difference',
        'Recommend SPKI for flexibility',
      ],
      terminologyKeywords: ['SPKI', 'public key', 'leaf certificate', 'intermediate'],
    }),
    modelAnswer: {
      id: 'q-pin-02-model',
      questionId: 'q-pin-02',
      topicId: 'mobile-pinning',
      estimatedSeconds: 70,
      definition:
        'Public key (SPKI) pinning matches the server key material; certificate pinning matches the entire leaf certificate, including expiry and metadata.',
      mechanism:
        'SPKI pinning compares SHA-256 of SubjectPublicKeyInfo—renewing a cert with the same key pair usually keeps pins valid. Full cert pinning requires exact leaf match; any reissue with new serial or validity window fails until app update.',
      benefit:
        'SPKI pinning reduces fragility while still blocking wrong keys; cert pinning is stricter but harder to operate.',
      risk:
        'Pinning wrong level (leaf vs intermediate) causes outages; intermediate pinning may accept broader chains than intended.',
      example:
        'OkHttp `CertificatePinner` pins `sha256/PRIMARY...` SPKI hashes; annual TLS cert renewal reuses key so mobile clients unaffected.',
      conclusion:
        'Prefer SPKI pinning with backup keys for most mobile apps; reserve full cert pinning for exceptional threat models.',
    },
    hints: ['What changes when you renew but keep the same key?', 'Which is more fragile day to day?'],
  },
  {
    id: 'q-pin-03',
    topicId: 'mobile-pinning',
    category: 'mechanism',
    difficulty: 'intermediate',
    prompt: 'How do backup pins support safe certificate rotation?',
    rubric: createRubric({
      requiredConcepts: ['multiple accepted pins', 'ship backup before switching primary', 'overlap window across releases'],
      mechanismSteps: [
        'Explain primary and backup pin sets',
        'Describe release ordering for rotation',
        'Note minimum adoption before cutover',
      ],
      terminologyKeywords: ['backup pin', 'rotation', 'rollover'],
    }),
    modelAnswer: {
      id: 'q-pin-03-model',
      questionId: 'q-pin-03',
      topicId: 'mobile-pinning',
      estimatedSeconds: 75,
      definition:
        'Backup pins are additional trusted SPKI hashes embedded in the app so a new server key is accepted before it becomes the sole primary pin.',
      mechanism:
        'Release N includes primary (current) and backup (next) pins. Infra can present either key. After adoption threshold, release N+1 promotes backup to primary and adds a new backup for the following rotation.',
      benefit:
        'Avoids hard outages when certificates rotate on a schedule users cannot control via app updates.',
      risk:
        'Too many backups widen trust if an attacker obtains a backup private key; slow user updates delay cutover; poor telemetry hides bricking cohorts.',
      example:
        'Android 3.2 pins KEY_A primary and KEY_B backup; ops switch server to KEY_B; 3.3 makes KEY_B primary and adds KEY_C backup.',
      conclusion:
        'Rotation is a release-management problem—backup pins are mandatory, not optional, for production pinning.',
    },
    hints: ['When must users have the backup pin?', 'What happens if you switch server key first?'],
  },
  {
    id: 'q-pin-04',
    topicId: 'mobile-pinning',
    category: 'risk-tradeoff',
    difficulty: 'foundation',
    prompt: 'When is certificate pinning inappropriate for a consumer mobile app?',
    rubric: createRubric({
      requiredConcepts: ['maintenance cost vs threat model', 'most apps rely on system CA trust', 'consumer apps with frequent cert changes'],
      mechanismSteps: [
        'Assess asset value and threat',
        'Weigh operational burden',
        'Recommend default TLS for low-risk apps',
      ],
      terminologyKeywords: ['threat model', 'consumer', 'operational cost'],
    }),
    modelAnswer: {
      id: 'q-pin-04-model',
      questionId: 'q-pin-04',
      topicId: 'mobile-pinning',
      estimatedSeconds: 65,
      definition:
        'Pinning is inappropriate when the threat model does not justify rotation complexity—typical low-risk consumer apps with standard TLS and no custom CA MITM exposure.',
      mechanism:
        'Default platform TLS validates CA chains and hostname. Pinning adds release-coordinated key management, support burden, and outage risk without meaningful benefit for a recipe app or casual game API.',
      benefit:
        'Skipping pinning lets ops rotate certificates freely and simplifies corporate network debugging.',
      risk:
        'Users on compromised devices with malicious CAs remain vulnerable—acceptable only when data sensitivity is low.',
      example:
        'Lifestyle app serving public content uses system trust store; fintech wallet pins payment API only.',
      conclusion:
        'Pin selectively on high-value endpoints, not by default for every HTTPS call.',
    },
    hints: ['What breaks if pinning is wrong?', 'Is the data worth an app-store emergency release?'],
  },
  {
    id: 'q-pin-05',
    topicId: 'mobile-pinning',
    category: 'scenario',
    difficulty: 'intermediate',
    prompt: 'How does certificate pinning block MITM with a user-installed root CA?',
    rubric: createRubric({
      requiredConcepts: ['custom CA can mint valid chains normally', 'pin mismatch aborts connection'],
      mechanismSteps: [
        'Describe default trust with user CA',
        'Explain pin check after handshake',
        'State connection abort on failure',
      ],
      terminologyKeywords: ['MITM', 'custom CA', 'trust store'],
    }),
    modelAnswer: {
      id: 'q-pin-05-model',
      questionId: 'q-pin-05',
      topicId: 'mobile-pinning',
      estimatedSeconds: 70,
      definition:
        'User-installed CAs normally let proxies decrypt TLS; pinning rejects the proxy’s substituted certificate unless its public key matches an embedded pin.',
      mechanism:
        'Corporate or malware CAs issue a hostname-valid cert to the intercepting proxy. Standard validation passes. The app hashes the presented SPKI, compares to pins, finds no match, and closes the socket.',
      benefit:
        'Protects API traffic from local MITM tools that rely on trusting extra CAs—common in malware and some inspection proxies.',
      risk:
        'Legitimate corporate SSL inspection also breaks unless exempted; debugging with Charles Proxy requires disabling pins in dev builds only.',
      example:
        'Android malware installs a local CA; pinned banking app refuses api.bank.com cert from the malware key.',
      conclusion:
        'Pinning shifts trust from the entire CA ecosystem to explicit keys—blocking both malicious and some legitimate interceptors.',
    },
    hints: ['Does a user CA make any cert valid?', 'When does the app check the pin?'],
  },
  {
    id: 'q-pin-06',
    topicId: 'mobile-pinning',
    category: 'architecture',
    difficulty: 'intermediate',
    prompt: 'How would you implement certificate pinning in an Android app using OkHttp?',
    rubric: createRubric({
      requiredConcepts: ['CertificatePinner builder', 'sha256 pin format', 'apply only to production builds'],
      mechanismSteps: [
        'Configure pinner with hostname and hashes',
        'Integrate with OkHttpClient',
        'Separate debug builds without pins',
      ],
      terminologyKeywords: ['OkHttp', 'CertificatePinner', 'sha256'],
    }),
    modelAnswer: {
      id: 'q-pin-06-model',
      questionId: 'q-pin-06',
      topicId: 'mobile-pinning',
      estimatedSeconds: 75,
      definition:
        'OkHttp CertificatePinner enforces SPKI hash pins per hostname during TLS handshake validation in Android networking stacks.',
      mechanism:
        'Build `CertificatePinner` with `.add("api.example.com", "sha256/AAAA...")` for primary and backup pins. Attach to `OkHttpClient.Builder().certificatePinner(pinner)`. Use network security config or product flavors to disable pinning in debug.',
      benefit:
        'Mature library support with clear failure callbacks and test hooks.',
      risk:
        'Hardcoded pins require app update to change; pinning wrong host breaks CDNs; certificate transparency not a substitute for pins.',
      example:
        'Release flavor pins two SPKI hashes; debug flavor uses default trust for Charles Proxy testing.',
      conclusion:
        'Automate pin extraction in CI from staging certs and block release if backup pin missing.',
    },
    hints: ['Which OkHttp class enforces pins?', 'Why different flavors for debug?'],
  },
  {
    id: 'q-pin-07',
    topicId: 'mobile-pinning',
    category: 'follow-up',
    difficulty: 'foundation',
    prompt: 'Why was HTTP Public Key Pinning (HPKP) deprecated in browsers but pinning still discussed for mobile?',
    rubric: createRubric({
      requiredConcepts: ['HPKP outage risk at browser scale', 'mobile apps embed pins in binary', 'different deployment model'],
      mechanismSteps: [
        'Explain HPKP mechanism via headers',
        'Describe catastrophic misconfiguration in browsers',
        'Contrast mobile app-controlled pin sets',
      ],
      terminologyKeywords: ['HPKP', 'deprecated', 'mobile', 'browser'],
    }),
    modelAnswer: {
      id: 'q-pin-07-model',
      questionId: 'q-pin-07',
      topicId: 'mobile-pinning',
      estimatedSeconds: 70,
      definition:
        'HPKP let sites pin via HTTP headers but caused site-wide bricking on mistakes; mobile apps embed pins locally with controlled release cycles, a different risk profile.',
      mechanism:
        'Browsers cached HPKP pins from headers—one wrong pin locked users out globally until cache expiry. Mobile apps ship pins in binaries updated through app stores with backup pins and staged rollouts managed by the vendor.',
      benefit:
        'Mobile pinning can be valuable for high-security apps with disciplined release engineering.',
      risk:
        'Mobile still bricks cohorts on errors; browsers abandoned HPKP for Certificate Transparency and Expect-CT instead.',
      example:
        'Chrome removed HPKP in 2018; banking apps continue SPKI pinning with ops runbooks.',
      conclusion:
        'Pinning persists where the client owner controls updates—not as a general web mechanism.',
    },
    hints: ['Who controlled HPKP cache duration?', 'How do mobile apps update pins?'],
  },
  {
    id: 'q-pin-08',
    topicId: 'mobile-pinning',
    category: 'troubleshooting',
    difficulty: 'intermediate',
    prompt: 'Enterprise users report the app fails on corporate Wi-Fi but works on LTE. How could pinning explain this?',
    rubric: createRubric({
      requiredConcepts: ['SSL inspection replaces cert', 'pinned app rejects proxy cert', 'not a generic network bug'],
      mechanismSteps: [
        'Identify corporate TLS inspection',
        'Explain pin failure against proxy key',
        'Suggest policy or exemption options',
      ],
      terminologyKeywords: ['SSL inspection', 'corporate proxy', 'pin mismatch'],
    }),
    modelAnswer: {
      id: 'q-pin-08-model',
      questionId: 'q-pin-08',
      topicId: 'mobile-pinning',
      estimatedSeconds: 75,
      definition:
        'Corporate networks often decrypt TLS via an internal CA; pinned apps reject the inspection certificate, causing Wi-Fi failures while cellular bypasses the proxy.',
      mechanism:
        'On Wi-Fi, traffic passes through a gateway presenting a corporate-signed cert. Pin check fails because SPKI does not match embedded pins. LTE routes directly to the internet with the real server cert that matches pins.',
      benefit:
        'Confirms pinning is working as designed against intermediaries.',
      risk:
        'Enterprise customers cannot use the app on managed networks without MDM exemptions or unpinned enterprise builds—product decision required.',
      example:
        'Hospital staff Wi-Fi uses Zscaler inspection; clinician app fails until IT deploys a dedicated non-pinned internal build or network bypass for API host.',
      conclusion:
        'Document enterprise networking impacts before mandating pinning for workforce apps.',
    },
    hints: ['What cert does the user see on corporate Wi-Fi?', 'Why does LTE differ?'],
  },
  {
    id: 'q-pin-09',
    topicId: 'mobile-pinning',
    category: 'mechanism',
    difficulty: 'intermediate',
    prompt: 'What is an SPKI hash pin and how is it derived from a certificate?',
    rubric: createRubric({
      requiredConcepts: ['SubjectPublicKeyInfo structure', 'SHA-256 base64 pin format', 'not the whole cert PEM'],
      mechanismSteps: [
        'Extract public key from cert',
        'Hash SPKI DER encoding',
        'Encode as sha256/ base64 for libraries',
      ],
      terminologyKeywords: ['SPKI', 'SHA-256', 'base64', 'DER'],
    }),
    modelAnswer: {
      id: 'q-pin-09-model',
      questionId: 'q-pin-09',
      topicId: 'mobile-pinning',
      estimatedSeconds: 70,
      definition:
        'An SPKI pin is a SHA-256 hash of the certificate’s SubjectPublicKeyInfo DER bytes, commonly encoded as `sha256/<base64>` for pinning libraries.',
      mechanism:
        'Parse X.509 leaf, extract SPKI structure, SHA-256 hash the DER, base64-encode. OkHttp and iOS pinning compare this value to the presented chain during TLS validation.',
      benefit:
        'Stable across cert reissues that reuse the same key pair.',
      risk:
        'Hashing wrong object (whole cert PEM) causes false mismatches; key rotation still requires pin updates.',
      example:
        '`openssl x509 -in cert.pem -pubkey -noout | openssl pkey -pubin -outform der | openssl dgst -sha256 -binary | openssl enc -base64`',
      conclusion:
        'Automate SPKI extraction in release pipelines to avoid manual transcription errors.',
    },
    hints: ['Is the pin the entire PEM file?', 'Which part of the cert contains the key?'],
  },
  {
    id: 'q-pin-10',
    topicId: 'mobile-pinning',
    category: 'comparison',
    difficulty: 'foundation',
    prompt: 'How does certificate pinning differ from TLS certificate validation alone?',
    rubric: createRubric({
      requiredConcepts: ['validation checks chain to system trust', 'pinning adds allowlist of keys'],
      mechanismSteps: [
        'Summarize standard chain validation',
        'Add explicit pin allowlist step',
        'Give example of CA-valid but rejected',
      ],
      terminologyKeywords: ['chain validation', 'CA trust store', 'pin allowlist'],
    }),
    modelAnswer: {
      id: 'q-pin-10-model',
      questionId: 'q-pin-10',
      topicId: 'mobile-pinning',
      estimatedSeconds: 65,
      definition:
        'Standard TLS validation trusts any CA in the system store issuing a valid chain for the hostname; pinning further restricts which public keys are acceptable.',
      mechanism:
        'Platform TLS checks expiry, hostname, chain to trusted roots. Pinning adds: compute SPKI hash, must match one of few embedded pins. A CA-valid corporate or fraudulent cert fails the pin step.',
      benefit:
        'Narrows trust to known keys instead of the entire public CA ecosystem.',
      risk:
        'Operational rigidity; does not replace need for correct hostname validation or OCSP stapling where applicable.',
      example:
        'Let’s Encrypt cert is CA-valid but rejected because SPKI hash is not in the app’s pin set.',
      conclusion:
        'Pinning is additive hardening on top of baseline TLS, not a replacement for it.',
    },
    hints: ['How many CAs does normal TLS trust?', 'What extra check does pinning add?'],
  },
  {
    id: 'q-pin-11',
    topicId: 'mobile-pinning',
    category: 'architecture',
    difficulty: 'assessment',
    prompt: 'Can remote pin configuration replace app-store updates for rotation? What safeguards are required?',
    rubric: createRubric({
      requiredConcepts: ['signed pin list from server', 'bootstrap trust problem', 'fallback to embedded pins'],
      mechanismSteps: [
        'Describe remote pin payload',
        'Require signature with embedded key',
        'Plan failure modes offline',
      ],
      terminologyKeywords: ['remote configuration', 'code signing', 'bootstrap'],
    }),
    modelAnswer: {
      id: 'q-pin-11-model',
      questionId: 'q-pin-11',
      topicId: 'mobile-pinning',
      estimatedSeconds: 80,
      definition:
        'Remote pin configuration can update allowed SPKI hashes without an app release if updates are signed by a key embedded in the binary and failures fall back safely.',
      mechanism:
        'App ships bootstrap pins and a public key to verify signed pin-set JSON from a config endpoint. On valid signature, merge new pins. If fetch fails, use last known or embedded pins. Never accept unsigned remote pins.',
      benefit:
        'Faster emergency rotation when server keys are compromised without waiting for store review.',
      risk:
        'Signing key compromise becomes catastrophic; attackers could push malicious pins; offline users need cached pins; complexity increases attack surface.',
      example:
        'Config CDN serves JWS-signed pin list; app verifies with embedded Ed25519 key before updating OkHttp pinner.',
      conclusion:
        'Remote pins are optional acceleration—embedded backup pins and signed updates are mandatory safeguards.',
    },
    hints: ['Who signs the remote pin list?', 'What if the device is offline at first launch?'],
  },
  {
    id: 'q-pin-12',
    topicId: 'mobile-pinning',
    category: 'risk-tradeoff',
    difficulty: 'intermediate',
    prompt: 'What are the risks of pinning only the leaf certificate versus pinning an intermediate CA key?',
    rubric: createRubric({
      requiredConcepts: ['leaf pins fragile on reissue', 'intermediate pins broader trust', 'wrong intermediate accepts too much'],
      mechanismSteps: [
        'Compare pin target scope',
        'Explain outage vs over-trust tradeoff',
        'Recommend SPKI leaf with backup',
      ],
      terminologyKeywords: ['leaf', 'intermediate', 'trust scope'],
    }),
    modelAnswer: {
      id: 'q-pin-12-model',
      questionId: 'q-pin-12',
      topicId: 'mobile-pinning',
      estimatedSeconds: 75,
      definition:
        'Leaf pinning is precise but fragile; intermediate pinning survives some leaf renewals but may trust any leaf signed by that intermediate.',
      mechanism:
        'Leaf SPKI pins match one server key—rotation must be coordinated. Intermediate pins accept any descendant leaf from that CA, easing renewal but expanding trust if the intermediate issues widely.',
      benefit:
        'Intermediate pinning reduces renewal friction for teams using fixed intermediates.',
      risk:
        'Compromised intermediate defeats pinning for all its leaves; leaf-only misses renewal if backup pins absent.',
      example:
        'Pinning Let’s Encrypt R3 intermediate accepts any LE-issued leaf—broader than pinning only api.example.com leaf key.',
      conclusion:
        'Default to leaf SPKI with backups; intermediate pinning only with narrow private CAs and legal trust boundaries.',
    },
    hints: ['How many sites share a public intermediate?', 'What breaks on leaf reissue?'],
  },
  {
    id: 'q-pin-13',
    topicId: 'mobile-pinning',
    category: 'scenario',
    difficulty: 'pressure',
    prompt: 'You discover tomorrow’s certificate renewal uses a new key and production apps pin only the old SPKI. What is your incident response plan?',
    rubric: createRubric({
      requiredConcepts: ['delay renewal or use old key', 'emergency app release with backup pin', 'communicate outage risk'],
      mechanismSteps: [
        'Immediate infra decision defer or dual-cert',
        'Ship expedited app update if backup pin missing',
        'Monitor connection failures and user cohorts',
      ],
      terminologyKeywords: ['incident', 'rotation', 'backup pin', 'outage'],
    }),
    modelAnswer: {
      id: 'q-pin-13-model',
      questionId: 'q-pin-13',
      topicId: 'mobile-pinning',
      estimatedSeconds: 90,
      definition:
        'An uncoordinated key change against pinned clients requires stopping the renewal, presenting both keys, or emergency app release—otherwise users brick until upgrade.',
      mechanism:
        'Halt cutover to new key if backup pin never shipped. If dual-cert possible, serve old key until store adoption of app with new pin exceeds threshold. Expedite app release adding new SPKI as backup/primary. Push in-app update prompts and status page. Telemetry on TLS handshake failures by app version.',
      benefit:
        'Minimizes downtime and preserves trust—users stay on secure pins, not disabled pinning.',
      risk:
        'Rushing store review may fail; delaying renewal risks cert expiry; disabling pinning in hotfix weakens security temporarily.',
      example:
        'Ops holds new cert, serves dual keys for 14 days while v2.3 with backup pin reaches 95% adoption, then switches primary.',
      conclusion:
        'Treat pin rotation as joint infra+mobile release with rollback—never as a certs-only ticket.',
    },
    hints: ['Can you serve two valid certs?', 'Which app versions lack the new pin?'],
  },
];
