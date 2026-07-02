import type { PracticeQuestion } from '../../types';
import { createRubric } from '../rubrics/helpers';

export const sastDastQuestions: PracticeQuestion[] = [
  {
    id: 'sast-dast-q1-compare',
    topicId: 'sast-dast',
    category: 'comparison',
    difficulty: 'foundation',
    prompt: 'Compare SAST and DAST. How do they differ in approach, timing, and what they detect?',
    rubric: createRubric({
      requiredConcepts: [
        'SAST is white-box static analysis of source or bytecode',
        'DAST is black-box testing of running application',
        'SAST runs early in SDLC without execution',
        'DAST finds runtime and configuration issues',
        'complementary not interchangeable',
      ],
      mechanismSteps: [
        'Define SAST: parses code, rules, taint analysis, no running app',
        'Define DAST: HTTP crawler sends payloads to live endpoints',
        'Contrast when each runs (PR/CI vs staging/production-like)',
        'Give example finding type for each',
        'State both are needed for coverage',
      ],
      prohibitedClaims: [
        'SAST and DAST are the same',
        'one tool replaces the other',
        'SAST tests production traffic',
      ],
      terminologyKeywords: ['SAST', 'DAST', 'white-box', 'black-box', 'static', 'dynamic', 'CI'],
    }),
    modelAnswer: {
      id: 'sast-dast-ma-q1-compare',
      questionId: 'sast-dast-q1-compare',
      topicId: 'sast-dast',
      estimatedSeconds: 85,
      definition:
        'SAST (Static Application Security Testing) analyzes application source or compiled code without executing it. DAST (Dynamic Application Security Testing) probes a running application from the outside like an attacker.',
      mechanism:
        'SAST parsers walk code paths, match dangerous patterns, and perform taint analysis to flag issues such as SQL concatenation or hardcoded secrets before deploy—typically in IDE or pull-request CI. DAST crawls URLs, submits fuzzed inputs, and inspects HTTP responses against a live stack in staging to find runtime problems: exposed admin panels, injection in deployed config, auth bypass, or TLS misconfiguration. SAST sees all code branches including unexecuted ones; DAST sees only what the running deployment exposes.',
      benefit:
        'SAST shifts discovery left with fast developer feedback; DAST validates real integration, middleware, and deployment settings that static analysis cannot see.',
      risk:
        'SAST misses environment-only flaws and produces false positives without tuning. DAST misses unexecuted code paths, needs reachable environments, and can be slow or flaky in pipelines.',
      example:
        'Semgrep flags string-built SQL in a Java repository during PR. OWASP ZAP finds an unauthenticated `/debug` endpoint on staging that never appeared in source scans.',
      conclusion:
        'SAST and DAST are complementary layers—static depth early plus dynamic validation of deployed behavior—not substitutes for each other.',
    },
    hints: [
      'White-box vs black-box is the core contrast.',
      'SAST = code without running; DAST = live HTTP probing.',
      'Give one example finding for each.',
    ],
  },
  {
    id: 'sast-dast-q2-pipeline-placement',
    topicId: 'sast-dast',
    category: 'architecture',
    difficulty: 'intermediate',
    prompt: 'Where would you place SAST, DAST, dependency scanning, secret scanning, and container scanning in a CI/CD pipeline?',
    rubric: createRubric({
      requiredConcepts: [
        'SAST and secret scan on pull request',
        'SCA/dependency scan at build',
        'DAST against staging after deploy',
        'container scan before image push or deploy',
        'gates proportional to severity',
      ],
      mechanismSteps: [
        'PR/commit: SAST on changed files, secret scan, IaC scan',
        'Build: SCA on lockfiles and SBOM generation',
        'Package: container image scan (Trivy, Grype)',
        'Post-deploy staging: DAST baseline or full scan',
        'Triage findings before blocking production release',
      ],
      prohibitedClaims: [
        'run DAST only in production on live users',
        'scan once a year is sufficient',
        'all scans must block every commit regardless of severity',
      ],
      terminologyKeywords: ['CI/CD', 'PR gate', 'SCA', 'staging', 'Trivy', 'shift-left', 'SBOM'],
    }),
    modelAnswer: {
      id: 'sast-dast-ma-q2-pipeline-placement',
      questionId: 'sast-dast-q2-pipeline-placement',
      topicId: 'sast-dast',
      estimatedSeconds: 90,
      definition:
        'Effective DevSecOps places each scan where it has the required artifacts and environment: code at commit time, dependencies at build, images before registry push, and DAST after a realistic deployment exists.',
      mechanism:
        'On pull request: run fast SAST (CodeQL, Semgrep) on deltas, Gitleaks for secrets, Checkov for Terraform/K8s manifests. At build: SCA tools (Snyk, Dependabot, OSV) scan lockfiles and fail or warn on critical CVEs; generate SBOM. When building container images: scan layers with Trivy before pushing to registry. After deploying to staging: trigger OWASP ZAP baseline or authenticated DAST against stable URLs. Production: continuous container/registry rescan and periodic pen tests—not first DAST on prod traffic.',
      benefit:
        'Early gates catch cheap-to-fix issues; later stages validate assembled system behavior without blocking every commit with slow dynamic scans.',
      risk:
        'DAST too early against ephemeral preview apps yields noise. SAST only on main misses issues in long-lived branches. Scanning without remediation workflow creates false confidence.',
      example:
        'GitHub Actions: Semgrep on PR → Maven build with OWASP Dependency-Check → Trivy scan image → deploy staging → ZAP API scan → promote to prod if no critical open findings.',
      conclusion:
        'Layer scans across the pipeline by artifact type—code, dependencies, infrastructure, image, runtime—rather than running everything at one stage.',
    },
    hints: [
      'Match scan type to what exists at that stage.',
      'DAST needs a running environment—usually staging.',
      'Secrets and SAST fit pull-request time.',
    ],
  },
  {
    id: 'sast-dast-q3-false-positive',
    topicId: 'sast-dast',
    category: 'definition',
    difficulty: 'foundation',
    prompt: 'What is a false positive in application security scanning, and how should teams handle noisy SAST results?',
    rubric: createRubric({
      requiredConcepts: [
        'false positive = tool reports vulnerability that is not exploitable',
        'common in pattern-based SAST',
        'triage and suppress with justification',
        'tuning rules and custom sanitization context',
      ],
      mechanismSteps: [
        'Define false positive vs true positive',
        'Explain why SAST rules over-approximate',
        'Describe manual triage workflow',
        'Document suppressions in tool or as code annotations',
        'Revisit suppressions periodically',
      ],
      prohibitedClaims: [
        'all SAST findings must be fixed immediately',
        'false positives mean the tool is useless',
        'ignore all medium findings',
      ],
      terminologyKeywords: ['false positive', 'triage', 'suppression', 'true positive', 'noise', 'baseline'],
    }),
    modelAnswer: {
      id: 'sast-dast-ma-q3-false-positive',
      questionId: 'sast-dast-q3-false-positive',
      topicId: 'sast-dast',
      estimatedSeconds: 75,
      definition:
        'A false positive is when a scanner reports a security issue that is not actually exploitable in context—safe code flagged by an overly broad rule.',
      mechanism:
        'SAST tools use pattern matching and taint analysis that cannot fully model framework sanitizers, custom validators, or unreachable paths. A rule may flag every `executeQuery` with string input even when parameters are bound elsewhere. Teams triage each finding: reproduce, trace data flow, confirm exploitability. Non-issues are suppressed with ticket reference and owner review. Tune rule packs, add framework-specific configs, and scope scans to changed files to reduce noise. Track true positives to remediation.',
      benefit:
        'Disciplined triage keeps CI gates trustworthy—developers learn to respect alerts instead of ignoring endless noise.',
      risk:
        'Blanket suppression without review hides real bugs. No triage process leads to alert fatigue and skipped fixes.',
      example:
        'SonarQube flags XSS on a React component that auto-escapes output; triage marks false positive with link to safe rendering pattern.',
      conclusion:
        'Expect false positives from SAST; invest in triage, documented suppressions, and rule tuning—not blind trust or blind ignore.',
    },
    hints: [
      'False positive = alert but not really vulnerable.',
      'SAST rules err on the side of reporting.',
      'Triage + documented suppression is the workflow.',
    ],
  },
  {
    id: 'sast-dast-q4-false-negative',
    topicId: 'sast-dast',
    category: 'definition',
    difficulty: 'intermediate',
    prompt: 'What is a false negative in security testing, and why can relying on only SAST or only DAST create dangerous blind spots?',
    rubric: createRubric({
      requiredConcepts: [
        'false negative = missed real vulnerability',
        'SAST misses runtime config and environment issues',
        'DAST misses unexecuted code and complex auth flows',
        'layered testing reduces gaps',
      ],
      mechanismSteps: [
        'Define false negative',
        'List classes SAST typically misses',
        'List classes DAST typically misses',
        'Explain business logic gaps in both',
        'Recommend complementary controls and manual testing',
      ],
      prohibitedClaims: [
        'clean scan means secure application',
        'DAST finds every code-level bug',
        'SAST finds all production misconfigurations',
      ],
      terminologyKeywords: ['false negative', 'blind spot', 'coverage', 'business logic', 'misconfiguration'],
    }),
    modelAnswer: {
      id: 'sast-dast-ma-q4-false-negative',
      questionId: 'sast-dast-q4-false-negative',
      topicId: 'sast-dast',
      estimatedSeconds: 80,
      definition:
        'A false negative occurs when a real vulnerability exists but the scanner does not report it—creating a false sense of security.',
      mechanism:
        'SAST false negatives arise from unsupported languages, reflection, complex framework magic, missing rules, or novel vulnerability classes. It cannot see WAF rules, reverse proxy auth, or cloud IAM misconfigurations at runtime. DAST false negatives occur when endpoints require intricate multi-step auth, are unreachable from the scanner network, use anti-automation, or involve business logic flaws (pay $1 for $1000 item) that payload fuzzing does not detect. Either tool alone leaves major gaps.',
      benefit:
        'Understanding false negatives drives defense in depth: multiple scan types, pen tests, bug bounty, and secure design review.',
      risk:
        'Teams treat green pipeline as proof of safety; attackers exploit unexecuted admin tools, race conditions, or IDOR that scanners miss.',
      example:
        'SAST passes but staging DAST finds open S3 bucket linked from JS. DAST passes but code review finds IDOR in `/api/order/{id}` never crawled with two user sessions.',
      conclusion:
        'Scanners are incomplete—plan for false negatives with layered testing and manual validation of critical flows.',
    },
    hints: [
      'False negative = missed real bug.',
      'SAST blind to runtime; DAST blind to unhit code.',
      'Neither catches all business logic flaws.',
    ],
  },
  {
    id: 'sast-dast-q5-dependency-scanning',
    topicId: 'sast-dast',
    category: 'mechanism',
    difficulty: 'foundation',
    prompt: 'What is software composition analysis (SCA) / dependency scanning, and why is it separate from SAST?',
    rubric: createRubric({
      requiredConcepts: [
        'SCA matches third-party libraries to known CVEs',
        'analyzes lockfiles and SBOM not application logic',
        'transitive dependency risk',
        'patch or upgrade remediation',
      ],
      mechanismSteps: [
        'Build produces dependency manifest or SBOM',
        'Scanner queries vulnerability databases (NVD, OSV, GitHub Advisory)',
        'Reports CVE, severity, affected version range',
        'Recommend upgrade or mitigation',
        'Integrate at build/CI separate from source rule SAST',
      ],
      prohibitedClaims: [
        'SAST automatically scans npm packages for CVEs',
        'only direct dependencies matter',
        'no CVE means dependency is safe',
      ],
      terminologyKeywords: ['SCA', 'CVE', 'transitive', 'Dependabot', 'Snyk', 'SBOM', 'lockfile'],
    }),
    modelAnswer: {
      id: 'sast-dast-ma-q5-dependency-scanning',
      questionId: 'sast-dast-q5-dependency-scanning',
      topicId: 'sast-dast',
      estimatedSeconds: 75,
      definition:
        'SCA (software composition analysis) identifies known vulnerabilities in open-source and third-party dependencies by matching package names and versions against advisory databases.',
      mechanism:
        'During CI the tool reads package-lock.json, pom.xml, go.sum, or generated SBOM, resolves direct and transitive versions, and compares to CVE feeds. Findings include severity, fixed version, and license issues. Remediation is typically upgrading the dependency or applying vendor patches—not rewriting application source. SAST analyzes your code logic; SCA analyzes the supply chain of libraries you import, including vulnerabilities in code you never wrote.',
      benefit:
        'Catches widespread issues like Log4Shell quickly across the estate when manifests are scanned continuously.',
      risk:
        'Transitive deps hide vulnerable jars deep in the tree. Version ranges and repackaged artifacts cause missed matches. Upgrades may break compatibility—needs test coverage.',
      example:
        'Snyk reports `lodash@4.17.15` via `react-scripts` transitive chain with CVE and suggests bump to 4.17.21 in lockfile.',
      conclusion:
        'Dependency scanning is supply-chain assurance complementary to SAST—both belong in CI with distinct inputs and remediation paths.',
    },
    hints: [
      'SCA = known CVEs in libraries you depend on.',
      'Uses lockfiles/SBOM, not your source logic rules.',
      'Transitive dependencies matter.',
    ],
  },
  {
    id: 'sast-dast-q6-secret-scanning',
    topicId: 'sast-dast',
    category: 'mechanism',
    difficulty: 'foundation',
    prompt: 'Why run secret scanning in the pipeline, and what should happen when credentials are found in git history?',
    rubric: createRubric({
      requiredConcepts: [
        'committed secrets are exposed to anyone with repo access',
        'scanners detect API keys, passwords, private keys patterns',
        'pre-commit and CI scanning',
        'rotation required—not just deletion',
      ],
      mechanismSteps: [
        'Gitleaks/trufflehog scans commits and PR diffs',
        'High-entropy strings and provider-specific patterns matched',
        'Block merge on confirmed secret',
        'Rotate credential and audit usage',
        'Consider history rewrite only with team coordination',
      ],
      prohibitedClaims: [
        'deleting the file in next commit removes exposure',
        'private repos are safe for secrets',
        'base64 encoding hides secrets from scanners',
      ],
      terminologyKeywords: ['Gitleaks', 'rotation', 'pre-commit', 'entropy', 'API key', 'git history'],
    }),
    modelAnswer: {
      id: 'sast-dast-ma-q6-secret-scanning',
      questionId: 'sast-dast-q6-secret-scanning',
      topicId: 'sast-dast',
      estimatedSeconds: 75,
      definition:
        'Secret scanning detects passwords, API tokens, and private keys accidentally committed to version control where they are copied, forked, and logged indefinitely.',
      mechanism:
        'Tools like Gitleaks, GitGuardian, or GitHub secret scanning match patterns (AWS keys, Stripe tokens, PEM headers) and entropy in commits and PRs. Pre-commit hooks block local commits; CI fails builds on findings. When a secret is found, assume compromise: revoke and rotate the credential, audit cloud logs for abuse, and replace with vault or CI secret store injection. Removing the file in a later commit does not erase history—rotation is mandatory; history rewrite (BFG) is optional and disruptive.',
      benefit:
        'Stops credential sprawl early before repos are forked or CI logs leak values.',
      risk:
        'Custom secrets without known patterns evade regex. Developers bypass hooks with `--no-verify`. Leaked keys in public repos are harvested in minutes.',
      example:
        'PR adds `.env` with `AWS_SECRET_ACCESS_KEY`; Gitleaks blocks merge; team rotates IAM key and moves secrets to GitHub Actions secrets.',
      conclusion:
        'Scan every commit for secrets, block exposure, and always rotate—deletion alone is insufficient.',
    },
    hints: [
      'Git history keeps secrets forever.',
      'Rotation is required after leak.',
      'Pre-commit + CI scanning.',
    ],
  },
  {
    id: 'sast-dast-q7-container-scanning',
    topicId: 'sast-dast',
    category: 'mechanism',
    difficulty: 'intermediate',
    prompt: 'What does container image scanning check, and when should it run relative to deployment?',
    rubric: createRubric({
      requiredConcepts: [
        'scans OS packages and application layers in image',
        'matches CVEs in base image and installed packages',
        'run before push to registry or before deploy',
        'distroless/minimal base reduces findings',
      ],
      mechanismSteps: [
        'Build produces container image',
        'Trivy/Grype/Snyk Container inspect each layer',
        'Report CVEs in apk/deb/rpm and app deps',
        'Gate on critical/high per policy',
        'Rescan images in registry on new CVE disclosures',
      ],
      prohibitedClaims: [
        'container scan replaces SAST',
        'only application code layers matter not base image',
        'scan once at first build is enough forever',
      ],
      terminologyKeywords: ['Trivy', 'CVE', 'base image', 'registry', 'distroless', 'layer', 'OS package'],
    }),
    modelAnswer: {
      id: 'sast-dast-ma-q7-container-scanning',
      questionId: 'sast-dast-q7-container-scanning',
      topicId: 'sast-dast',
      estimatedSeconds: 80,
      definition:
        'Container scanning analyzes built OCI/Docker images for known vulnerabilities in the base OS, installed packages, and sometimes embedded language dependencies.',
      mechanism:
        'After `docker build`, tools like Trivy enumerate packages in each layer—e.g., vulnerable OpenSSL in Debian base or old Python wheel copied in. CI fails or warns when critical CVEs exceed policy. Scan before pushing to registry and again on deploy promotion. Registry integrations rescan stored tags when NVD updates. Remediation: rebuild on patched base (`node:20-alpine` update), upgrade packages, or remove unused tools from image.',
      benefit:
        'Catches vulnerabilities introduced by base images and ops tooling that SAST of app source never sees.',
      risk:
        'Unpinned tags (`latest`) cause drift. False sense if only app code scanned. Huge full OS images increase attack surface and finding count.',
      example:
        'Trivy fails CI: `python:3.9-slim` contains CVE-2024-xxxx in libsqlite; rebuild on patched digest unblocks deploy.',
      conclusion:
        'Scan images before they reach production registries and rebuild when base CVEs land—container security is supply-chain plus ops hygiene.',
    },
    hints: [
      'Images bundle OS packages + your app.',
      'Trivy-style tools match layer packages to CVEs.',
      'Run at build/push; rescan registry periodically.',
    ],
  },
  {
    id: 'sast-dast-q8-sast-misses',
    topicId: 'sast-dast',
    category: 'comparison',
    difficulty: 'intermediate',
    prompt: 'What classes of vulnerabilities can DAST find that SAST typically misses?',
    rubric: createRubric({
      requiredConcepts: [
        'deployment and server misconfiguration',
        'runtime-only exposed endpoints',
        'TLS/certificate issues',
        'WAF and reverse proxy behavior',
        'default credentials on running services',
      ],
      mechanismSteps: [
        'State SAST analyzes code not deployed stack',
        'DAST probes live HTTP responses and headers',
        'Give examples: open admin UI, verbose errors, weak TLS',
        'Note authentication integration issues at runtime',
        'Mention environment-specific secrets in config',
      ],
      prohibitedClaims: [
        'SAST sees production TLS configuration',
        'DAST only duplicates SAST findings',
        'SAST finds all exposed endpoints',
      ],
      terminologyKeywords: ['misconfiguration', 'TLS', 'exposed endpoint', 'runtime', 'headers', 'staging'],
    }),
    modelAnswer: {
      id: 'sast-dast-ma-q8-sast-misses',
      questionId: 'sast-dast-q8-sast-misses',
      topicId: 'sast-dast',
      estimatedSeconds: 75,
      definition:
        'DAST discovers issues visible only in a running deployment—configuration, exposed surfaces, and integration behavior that static code analysis never executes.',
      mechanism:
        'SAST reads source but cannot observe whether nginx blocks `/admin`, if debug mode is enabled via env var in K8s, or if TLS cipher suites are weak. DAST crawls the live URL space, checks security headers (CSP, HSTS), tests cookie flags on Set-Cookie responses, probes injection on actual parameter names, and detects directory listing or default Tomcat pages. It validates the assembled system including third-party appliances.',
      benefit:
        'Closes the gap between secure code and insecure deployment—the classic "works on my machine" security failure.',
      risk:
        'DAST coverage depends on crawl depth and credentials; still misses unlinked endpoints and logic flaws.',
      example:
        'Code has auth middleware, but staging misconfig leaves `/actuator/env` public—ZAP finds it; SAST saw protected route in source.',
      conclusion:
        'Use DAST to validate what attackers see at runtime—especially config, exposure, and transport issues invisible to SAST.',
    },
    hints: [
      'Think deployment vs source code.',
      'Examples: public admin page, missing HSTS, debug endpoints.',
      'SAST never makes real HTTP requests.',
    ],
  },
  {
    id: 'sast-dast-q9-dast-misses',
    topicId: 'sast-dast',
    category: 'comparison',
    difficulty: 'intermediate',
    prompt: 'What can SAST find that DAST often misses?',
    rubric: createRubric({
      requiredConcepts: [
        'unreachable or dead code paths',
        'hardcoded secrets in source',
        'dangerous APIs in undeployed branches',
        'taint from source to sink in complex code',
      ],
      mechanismSteps: [
        'SAST analyzes full codebase including unexecuted branches',
        'DAST only hits reachable endpoints with test payloads',
        'Examples: dead admin feature, hardcoded key, SQLi in unused module',
        'SAST taint tracks data flow across functions',
        'DAST needs working auth and route discovery',
      ],
      prohibitedClaims: [
        'DAST reads all source files',
        'if DAST passes no code vulnerabilities exist',
        'SAST cannot find hardcoded secrets',
      ],
      terminologyKeywords: ['taint analysis', 'dead code', 'hardcoded', 'coverage', 'unreachable', 'source to sink'],
    }),
    modelAnswer: {
      id: 'sast-dast-ma-q9-dast-misses',
      questionId: 'sast-dast-q9-dast-misses',
      topicId: 'sast-dast',
      estimatedSeconds: 75,
      definition:
        'SAST examines the entire codebase—including branches not yet deployed or reachable—surfacing dangerous patterns DAST never triggers in HTTP tests.',
      mechanism:
        'Static taint analysis can follow user input from controller to SQL execute call even if staging lacks test data to exploit it. SAST flags hardcoded AWS keys in a utility class, weak crypto in a library not wired in prod yet, or vulnerable deserialization in a feature behind feature flag. DAST limited crawl may miss internal-only routes, requires guessing parameters, and cannot see dead code paths removed before next release but still in main branch.',
      benefit:
        'Finds latent defects before features ship or attackers discover obscure endpoints.',
      risk:
        'SAST may report issues in code paths truly unreachable—triage needed. Without deployment, cannot confirm exploitability at runtime.',
      example:
        'CodeQL finds command injection in `/internal/migrate` route not linked in staging crawl; developer fixes before feature flag enables it.',
      conclusion:
        'SAST provides breadth over the whole code graph; DAST confirms exploitability in the live attack surface—both views differ.',
    },
    hints: [
      'DAST only tests what it can reach via HTTP.',
      'Hardcoded secrets and dead code are SAST sweet spots.',
      'Taint analysis tracks code paths not exercised in staging.',
    ],
  },
  {
    id: 'sast-dast-q10-triage',
    topicId: 'sast-dast',
    category: 'troubleshooting',
    difficulty: 'assessment',
    prompt: 'Describe a practical triage workflow when SAST and DAST produce hundreds of findings before a release.',
    rubric: createRubric({
      requiredConcepts: [
        'severity and exploitability ranking',
        'deduplication across tools',
        'assign owners and SLAs',
        'suppress false positives with audit trail',
        'block release on critical unmitigated issues',
      ],
      mechanismSteps: [
        'Aggregate findings into single tracker (DefectDojo, Jira)',
        'Prioritize by severity, asset criticality, exploitability',
        'Deduplicate same CWE across SAST/DAST/SCA',
        'Security reviews true positives; dev fixes or mitigates',
        'Document accepted risk for deferred items with expiry',
      ],
      prohibitedClaims: [
        'close all as false positive to ship',
        'fix findings in random order',
        'no need to track suppressions',
      ],
      terminologyKeywords: ['triage', 'severity', 'SLA', 'false positive', 'accepted risk', 'CWE', 'DefectDojo'],
    }),
    modelAnswer: {
      id: 'sast-dast-ma-q10-triage',
      questionId: 'sast-dast-q10-triage',
      topicId: 'sast-dast',
      estimatedSeconds: 90,
      definition:
        'Triage is the process of sorting scanner output into actionable fixes, false positives, and risk-accepted items so teams focus on real exploitable issues before release.',
      mechanism:
        'Import SAST, DAST, SCA, and container results into a central platform. Sort by CVSS or tool severity, then re-rank by reachability (internet-facing?), data sensitivity, and known exploit. Deduplicate duplicate SQLi reports from two tools. Security engineer validates top criticals; developers patch or add compensating controls. Mark false positives with rule ID and reviewer. Defer low issues with ticket and revisit SLA. Release policy: no open critical/high on exposed paths without signed exception.',
      benefit:
        'Prevents alert paralysis and ensures scarce fix capacity targets real customer risk.',
      risk:
        'Rubber-stamping suppressions reintroduces vulnerabilities. Without SLAs, backlog grows until breach.',
      example:
        '200 Semgrep + 40 ZAP findings: 12 critical deduped to 8 unique; 3 XSS false positives suppressed; 5 SQLi fixed; 1 critical accepted with WAF rule and 30-day remediation ticket.',
      conclusion:
        'Successful AppSec triage combines tool output with human exploitability judgment, audit trails, and release gates—not raw finding counts.',
    },
    hints: [
      'Prioritize by severity and whether prod is exposed.',
      'Dedupe same bug from multiple scanners.',
      'Document suppressions and accepted risk.',
    ],
  },
  {
    id: 'sast-dast-q11-iac-scanning',
    topicId: 'sast-dast',
    category: 'architecture',
    difficulty: 'intermediate',
    prompt: 'How does Infrastructure-as-Code (IaC) scanning fit alongside SAST and DAST?',
    rubric: createRubric({
      requiredConcepts: [
        'IaC scans Terraform, CloudFormation, K8s manifests',
        'detects misconfig before deploy',
        'examples: public S3, open security groups, privileged containers',
        'runs at PR time like SAST',
      ],
      mechanismSteps: [
        'Define IaC scanning (Checkov, tfsec, KICS)',
        'Parse templates for insecure resource settings',
        'Run on PR when infra files change',
        'Complement app SAST and runtime DAST',
        'Fix misconfig in code not production console',
      ],
      prohibitedClaims: [
        'DAST finds Terraform mistakes',
        'IaC scan replaces cloud CSPM entirely',
        'only application code matters for security',
      ],
      terminologyKeywords: ['IaC', 'Checkov', 'Terraform', 'Kubernetes', 'misconfiguration', 'shift-left'],
    }),
    modelAnswer: {
      id: 'sast-dast-ma-q11-iac-scanning',
      questionId: 'sast-dast-q11-iac-scanning',
      topicId: 'sast-dast',
      estimatedSeconds: 75,
      definition:
        'IaC scanning statically analyzes Terraform, CloudFormation, and Kubernetes YAML for insecure resource definitions before infrastructure is applied.',
      mechanism:
        'Tools like Checkov or tfsec evaluate templates for rules: S3 bucket ACL public, security group 0.0.0.0/0 on port 22, missing RDS encryption, containers running as root. Runs in CI on pull requests touching infra/, similar timing to SAST. It catches cloud misconfiguration at definition time. DAST might later confirm an app is reachable but IaC prevents creating wide-open resources. CSPM tools monitor deployed drift; IaC scanning prevents bad definitions entering the pipeline.',
      benefit:
        'Shifts cloud misconfiguration left—cheaper than incident response after public bucket exposure.',
      risk:
        'Templates may not reflect manual console changes (drift). Rules need customization per org standards.',
      example:
        'Checkov fails PR: `aws_s3_bucket` missing `block_public_acls=true`; engineer fixes Terraform before `terraform apply`.',
      conclusion:
        'IaC scanning is a static sibling to app SAST—covering cloud and platform config while DAST validates the running app layer.',
    },
    hints: [
      'IaC = Terraform/K8s YAML static checks.',
      'Catches public buckets, open SGs before deploy.',
      'PR-time like SAST, different file types.',
    ],
  },
  {
    id: 'sast-dast-q12-gate-policy',
    topicId: 'sast-dast',
    category: 'risk-tradeoff',
    difficulty: 'assessment',
    prompt: 'How should teams set CI/CD security gate policies without blocking all development on noisy tools?',
    rubric: createRubric({
      requiredConcepts: [
        'severity-based thresholds',
        'new vs existing findings baseline',
        'incremental scans on changed code',
        'warn vs fail distinction',
        'improvement over time',
      ],
      mechanismSteps: [
        'Start with warn-only or critical-only fail',
        'Use baseline to block only new issues on touched files',
        'Set SLAs for legacy backlog',
        'Tune rules after measuring false positive rate',
        'Escalate gates for production-bound branches',
      ],
      prohibitedClaims: [
        'fail build on every medium SAST finding day one',
        'never fail pipeline on security',
        'disable gates when noisy',
      ],
      terminologyKeywords: ['gate', 'baseline', 'severity', 'incremental', 'SLA', 'warn', 'break build'],
    }),
    modelAnswer: {
      id: 'sast-dast-ma-q12-gate-policy',
      questionId: 'sast-dast-q12-gate-policy',
      topicId: 'sast-dast',
      estimatedSeconds: 85,
      definition:
        'Security gates are CI policies that pass or fail builds based on scan results. Effective gates balance risk reduction with developer velocity through severity focus and incremental adoption.',
      mechanism:
        'Phase 1: report-only on all severities to measure noise. Phase 2: fail on new critical/high findings in changed files only (diff-aware SAST). Maintain baseline for legacy debt with remediation SLAs. Use warn for medium until false positives drop. Stricter gates on release/main than feature branches. Container and secret scans often warrant zero-tolerance on critical. DAST may run nightly rather than every commit due to duration. Track metrics: time to fix, false positive rate, open critical count.',
      benefit:
        'Teams fix real regressions immediately without boiling the ocean on thousand-finding legacy repos.',
      risk:
        'Perpetual warn-only never improves posture. Overly strict gates drive `--no-verify` culture and tool bypass.',
      example:
        'Semgrep blocks PR only if new critical rule hits diff; 400 legacy lows tracked in backlog with quarterly burn-down; main branch requires clean container criticals.',
      conclusion:
        'Gate policies should be severity-scoped, incremental, and tightened over time—not binary all-or-nothing.',
    },
    hints: [
      'Block new criticals, not entire legacy backlog at once.',
      'Diff-scoped scans reduce noise.',
      'Stricter on main/release than feature branches.',
    ],
  },
  {
    id: 'sast-dast-q13-auth-dast',
    topicId: 'sast-dast',
    category: 'scenario',
    difficulty: 'assessment',
    prompt: 'Why is authenticated DAST important, and what challenges does it introduce in CI pipelines?',
    rubric: createRubric({
      requiredConcepts: [
        'most vulnerabilities behind login',
        'scanner needs test credentials or token flow',
        'session handling and MFA complications',
        'slower and more brittle than baseline scan',
      ],
      mechanismSteps: [
        'Identify large app surface requires auth',
        'Configure ZAP/Burp script or API token login',
        'Store test creds in CI secrets',
        'Crawl as user role; test IDOR and authz',
        'Schedule in staging; handle MFA via test bypass or service account',
      ],
      prohibitedClaims: [
        'unauthenticated ZAP is sufficient for APIs',
        'use production admin credentials in CI',
        'authenticated scan has no false negatives',
      ],
      terminologyKeywords: ['authenticated scan', 'ZAP', 'session', 'IDOR', 'test account', 'MFA', 'coverage'],
    }),
    modelAnswer: {
      id: 'sast-dast-ma-q13-auth-dast',
      questionId: 'sast-dast-q13-auth-dast',
      topicId: 'sast-dast',
      estimatedSeconds: 85,
      definition:
        'Authenticated DAST logs into the application (or uses API tokens) before crawling, exposing post-login endpoints that anonymous baseline scans never reach.',
      mechanism:
        'Configure scanner with test user credentials, OAuth client, or API key from CI secrets. Record session cookies or JWT and spider protected routes. Test role-specific access (user vs admin) for IDOR and privilege escalation. Challenges: MFA blocks automation unless test environment bypasses it; flaky login flows fail pipelines; scans take longer; test data mutations need reset fixtures; creds must be least-privilege test accounts never shared with prod.',
      benefit:
        'Finds authorization bugs and injection in authenticated workflows—the majority of real app surface.',
      risk:
        'Poorly scoped test creds in pipelines leak via logs. Destructive fuzzing against shared staging corrupts data. Single-role scan misses admin-only bugs.',
      example:
        'ZAP context file logs into staging with `test_user`/`vault-secret`, crawls `/account/*`, detects IDOR on `/api/invoice/123` accessible cross-user.',
      conclusion:
        'Plan authenticated DAST for realistic coverage; invest in test env, cred management, and stable automation—not just unauthenticated baselines.',
    },
    hints: [
      'Most app is behind login.',
      'Need test creds from vault in CI.',
      'MFA and flaky login complicate automation.',
    ],
  },
  {
    id: 'sast-dast-q14-layered-program',
    topicId: 'sast-dast',
    category: 'architecture',
    difficulty: 'pressure',
    prompt: 'Design a minimal but effective AppSec scanning program for a team shipping a containerized API with a React frontend. Which tools run when?',
    rubric: createRubric({
      requiredConcepts: [
        'SAST for frontend and backend code on PR',
        'secret scan on PR',
        'SCA on lockfiles at build',
        'container scan before registry push',
        'DAST on staging API',
        'manual pen test or bug bounty for logic',
      ],
      mechanismSteps: [
        'PR: Semgrep/CodeQL on TS and API code + Gitleaks',
        'Build: npm/maven SCA + unit tests',
        'Image: Trivy scan API container',
        'Deploy staging: ZAP against API + React host',
        'Periodic: pen test; production registry rescan',
      ],
      prohibitedClaims: [
        'SonarQube alone in production is enough',
        'skip container scan if SAST passes',
        'only scan backend not frontend',
      ],
      terminologyKeywords: [
        'layered',
        'Semgrep',
        'Trivy',
        'ZAP',
        'SCA',
        'Gitleaks',
        'staging',
        'container',
      ],
    }),
    modelAnswer: {
      id: 'sast-dast-ma-q14-layered-program',
      questionId: 'sast-dast-q14-layered-program',
      topicId: 'sast-dast',
      estimatedSeconds: 95,
      definition:
        'A minimal effective program layers fast static checks on every change, supply-chain scans at build, image validation before deploy, and dynamic staging tests—without relying on a single tool.',
      mechanism:
        'PR: Semgrep or CodeQL on React and API service code; Gitleaks on diff; optional Checkov if Terraform present. Fail new criticals. Build: `npm audit`/Snyk and pip/Maven SCA on lockfiles; run tests. Container: build API image, Trivy scan, block critical unfixed CVEs, push to registry. Staging deploy: OWASP ZAP API scan with auth against OpenAPI spec; weekly full scan. Frontend: SAST for XSS patterns plus DAST passive scan of built SPA. Production: monitor registry for new CVEs on pinned digests. Annual pen test for business logic.',
      benefit:
        'Covers code flaws, leaked secrets, vulnerable deps, image OS CVEs, and runtime exposure with proportional CI cost.',
      risk:
        'Skipping frontend SAST misses DOM XSS; API-only DAST misses CDN misconfig; no manual review misses authorization logic bugs.',
      example:
        'Monorepo PR triggers Semgrep on `src/` + Gitleaks → CI builds `api:latest` → Trivy pass → deploy staging → ZAP OpenAPI scan → promote.',
      conclusion:
        'Match each tool to an artifact and stage; keep gates severity-focused; add human testing where automation ends.',
    },
    hints: [
      'Map tool to artifact: code, deps, image, running app.',
      'PR = SAST + secrets; build = SCA; deploy = DAST.',
      'Mention both React and API coverage.',
    ],
  },
];
