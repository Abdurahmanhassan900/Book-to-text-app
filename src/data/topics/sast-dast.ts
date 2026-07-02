import type { Topic } from '../../types';

export const sastDastTopic: Topic = {
  id: 'sast-dast',
  title: 'SAST, DAST, and Application Security Testing',
  day: 4,
  tags: ['sast', 'dast', 'cicd', 'sca', 'devsecops', 'false-positives'],
  plainDefinition:
    'SAST analyzes source code for vulnerabilities before running the app. DAST probes a running application from the outside like an attacker would.',
  technicalDefinition:
    'Static Application Security Testing (SAST) performs white-box analysis on source or bytecode without execution. Dynamic Application Security Testing (DAST) performs black-box testing against running endpoints to find runtime issues such as authentication flaws and injection.',
  mechanism: [
    'SAST: scanner (e.g., Semgrep, CodeQL, SonarQube) parses code, applies rules/taint analysis, reports findings in CI or IDE.',
    'DAST: scanner (e.g., OWASP ZAP, Burp) crawls URLs, sends payloads, observes responses for vulnerabilities.',
    'SCA/dependency scanning matches libraries to known CVEs (Snyk, Dependabot).',
    'Secret scanning detects committed credentials (Gitleaks).',
    'Container scanning checks image layers (Trivy); IaC scanning checks Terraform/K8s manifests (Checkov).',
    'CI/CD gates: PR SAST + secret scan; build SCA; staging DAST; release image/IaC scan.',
    'Findings triaged: false positives suppressed; true positives tracked to remediation.',
    'Manual penetration testing covers business logic SAST/DAST miss.',
  ],
  securityBenefit:
    'Shifts vulnerability discovery left (SAST/SCA) and validates real runtime behavior (DAST), covering different defect classes across the SDLC.',
  risksAndTradeoffs: [
    'SAST produces false positives; noisy gates slow teams without tuning.',
    'DAST misses code paths requiring auth or complex workflows; slower in pipelines.',
    'Neither replaces the other—SAST sees code DAST never executes; DAST sees deployment config SAST ignores.',
    'Tool names matter less than placement, tuning, and remediation workflow.',
    'Scanning without fixing creates false confidence.',
  ],
  realWorldExample:
    'On pull request, CodeQL runs on changed files; merge blocked on critical SQL injection pattern. Weekly OWASP ZAP baseline scan hits staging API. Trivy fails build if base image has critical CVE.',
  commonMisconception:
    'SAST and DAST are not interchangeable—running only one leaves major blind spots in both unexecuted code and production configuration.',
  modelAnswer: {
    id: 'sast-dast-model-compare',
    topicId: 'sast-dast',
    estimatedSeconds: 80,
    definition:
      'SAST is white-box static code analysis; DAST is black-box testing of a running application.',
    mechanism:
      'SAST parses source for dangerous patterns and data flows before deploy—fast feedback in CI. DAST sends HTTP requests to a live environment to find runtime issues like exposed endpoints or injection. SCA scans dependencies; secret and container scans cover supply chain and images.',
    benefit:
      'Combining methods catches design-time coding flaws early and validates exploitable behavior in realistic deployments.',
    risk:
      'False positives waste time; false negatives create gaps. DAST in CI can be slow and flaky; SAST without context misses runtime-only misconfigurations.',
    example:
      'Semgrep flags hardcoded SQL concatenation in PR; ZAP finds admin panel accessible without auth on staging.',
    conclusion:
      'Effective DevSecOps layers multiple scan types in the pipeline with triage—not reliance on a single tool.',
  },
  weakAnswer:
    'SAST and DAST are the same security scan. We run SonarQube in production and we are secure.',
  weakAnswerExplanation:
    'Treats tools as interchangeable; wrong runtime placement; no false positive/negative or mechanism distinction.',
  followUpQuestions: [
    'Where would you place SAST vs DAST in CI/CD?',
    'What can SAST miss that DAST finds?',
    'What is a false positive vs false negative?',
    'Why add dependency and secret scanning?',
  ],
  relatedTopicIds: ['sql-injection', 'jwt-authentication'],
};
