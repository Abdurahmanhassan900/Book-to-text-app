import type { PracticeQuestion } from '../../types';
import { createRubric } from '../rubrics/helpers';

export const apiQuestions: PracticeQuestion[] = [
  {
    id: 'q-api-01',
    topicId: 'api-rate-limiting',
    category: 'comparison',
    difficulty: 'intermediate',
    prompt: 'Compare fixed-window and token-bucket rate limiting.',
    rubric: createRubric({
      requiredConcepts: [
        'fixed window resets counter per time bucket',
        'token bucket refills tokens at steady rate',
        'boundary burst problem in fixed window',
        'controlled bursts allowed in token bucket',
      ],
      mechanismSteps: [
        'Describe fixed-window counter reset behavior',
        'Explain token refill and consumption per request',
        'Contrast burst tolerance at window edges vs bucket capacity',
        'State when each fits login vs general API traffic',
      ],
      prohibitedClaims: ['fixed window has no burst issues', 'token bucket blocks all bursts'],
      terminologyKeywords: ['fixed window', 'token bucket', 'burst', 'refill', 'counter'],
    }),
    modelAnswer: {
      id: 'q-api-01-model',
      questionId: 'q-api-01',
      topicId: 'api-rate-limiting',
      estimatedSeconds: 75,
      definition:
        'Fixed-window rate limiting counts requests per clock-aligned interval; token-bucket rate limiting refills tokens over time and spends one per request.',
      mechanism:
        'Fixed window increments a counter for each client per minute (or hour) and resets at the boundary—simple but can allow double traffic when requests cluster at window edges. Token bucket adds tokens at a steady refill rate up to a bucket capacity; each request consumes a token, allowing short bursts without exceeding the long-term average.',
      benefit:
        'Fixed window is easy to implement with one counter per window. Token bucket smooths traffic while permitting legitimate burst traffic such as page loads.',
      risk:
        'Fixed-window edge bursts can overwhelm backends; token bucket needs tuning of refill rate and capacity and more state per client.',
      example:
        'Login API uses token bucket at 5 tokens/min with bucket size 10 in Redis; public read API uses fixed 1000 req/hour per API key.',
      conclusion:
        'Choose fixed window for simplicity on low-risk endpoints; prefer token bucket when controlled bursts matter, such as login or bursty mobile clients.',
    },
    hints: ['Mention the window-edge burst problem.', 'How does refill rate differ from a hard reset?'],
  },
  {
    id: 'q-api-02',
    topicId: 'api-rate-limiting',
    category: 'scenario',
    difficulty: 'assessment',
    prompt: 'How would you protect an API login endpoint against credential stuffing?',
    rubric: createRubric({
      requiredConcepts: [
        'per-IP and per-username rate limits',
        'credential stuffing uses many IPs slowly',
        'layered controls beyond rate limits alone',
        'breached-password or anomaly detection',
      ],
      mechanismSteps: [
        'Apply strict rate limits on login route',
        'Add progressive delay or lockout signals',
        'Detect stuffing patterns across usernames',
        'Combine MFA, CAPTCHA, or bot management',
      ],
      prohibitedClaims: ['IP block alone stops stuffing', 'rate limits are sufficient alone'],
      terminologyKeywords: ['credential stuffing', 'rate limit', 'MFA', 'bot detection', 'breached password'],
    }),
    modelAnswer: {
      id: 'q-api-02-model',
      questionId: 'q-api-02',
      topicId: 'api-rate-limiting',
      estimatedSeconds: 80,
      definition:
        'Credential stuffing tests stolen username-password pairs at scale; login APIs need throttling and layered abuse controls, not a single counter.',
      mechanism:
        'Enforce tight per-IP and per-username limits (e.g., token bucket in Redis), add progressive delays after failures, check passwords against breach lists, and trigger CAPTCHA or MFA on risk signals. Monitor for many IPs each trying few passwords across many accounts.',
      benefit:
        'Slows automated login attempts, reduces successful account takeovers, and preserves capacity for legitimate users.',
      risk:
        'Shared NAT IPs block real users; aggressive friction hurts UX; distributed attackers bypass per-IP limits—needs username-level and behavioral detection.',
      example:
        'Gateway allows 10 login attempts per IP per 15 minutes and 5 per username per hour; after threshold, require CAPTCHA and alert SOC on distributed low-and-slow patterns.',
      conclusion:
        'Rate limiting is necessary but not sufficient—combine dimensioned limits with stuffing detection and strong authentication controls.',
    },
    hints: ['Stuffing spreads attempts across many IPs.', 'Why limit per username as well as per IP?'],
  },
  {
    id: 'q-api-03',
    topicId: 'api-rate-limiting',
    category: 'definition',
    difficulty: 'foundation',
    prompt: 'What is HTTP 429 Too Many Requests, and what should the response include?',
    rubric: createRubric({
      requiredConcepts: ['429 signals rate limit exceeded', 'Retry-After header or body guidance', 'client should back off'],
      mechanismSteps: [
        'Define when server returns 429',
        'Explain Retry-After semantics',
        'Describe client backoff behavior',
      ],
      prohibitedClaims: ['429 means server error 500', 'clients should retry immediately in a tight loop'],
      terminologyKeywords: ['429', 'Retry-After', 'rate limit', 'backoff'],
    }),
    modelAnswer: {
      id: 'q-api-03-model',
      questionId: 'q-api-03',
      topicId: 'api-rate-limiting',
      estimatedSeconds: 60,
      definition:
        'HTTP 429 Too Many Requests tells the client it has exceeded a rate limit and should slow down before retrying.',
      mechanism:
        'When a counter or token bucket rejects a request, the API returns 429 with a Retry-After header (seconds or HTTP-date) or equivalent JSON field indicating when retry is acceptable. Well-behaved clients exponential-backoff; abusive clients may be blocked further.',
      benefit:
        'Gives a standard signal for throttling instead of ambiguous 403/503 responses, helping SDKs and browsers backoff correctly.',
      risk:
        'Missing Retry-After causes thundering retries; overly long delays frustrate users; attackers may rotate identities to get fresh quotas.',
      example:
        'Search API returns 429 with Retry-After: 30 after 60 requests in one minute per API key.',
      conclusion:
        'Always pair 429 with clear retry guidance and monitor for clients that ignore backoff.',
    },
    hints: ['Which header tells clients how long to wait?', 'Why not use 503 for rate limits?'],
  },
  {
    id: 'q-api-04',
    topicId: 'api-rate-limiting',
    category: 'architecture',
    difficulty: 'intermediate',
    prompt: 'Why is Redis commonly used for rate limiting in multi-instance API deployments?',
    rubric: createRubric({
      requiredConcepts: [
        'shared counter across app servers',
        'atomic increment operations',
        'low-latency in-memory store',
        'TTL for window expiry',
      ],
      mechanismSteps: [
        'Explain per-node memory limits problem',
        'Describe Redis INCR with TTL or token scripts',
        'Note atomicity for concurrent requests',
        'Mention failure modes if Redis unavailable',
      ],
      prohibitedClaims: ['each app server can rate limit independently without shared state'],
      terminologyKeywords: ['Redis', 'distributed', 'INCR', 'TTL', 'atomic'],
    }),
    modelAnswer: {
      id: 'q-api-04-model',
      questionId: 'q-api-04',
      topicId: 'api-rate-limiting',
      estimatedSeconds: 70,
      definition:
        'Redis provides a fast, shared datastore so every API instance enforces the same per-client limits consistently.',
      mechanism:
        'Each request hashes a client key (IP, user ID, API key) and atomically increments a Redis counter or runs a Lua script for token bucket logic. TTL keys expire windows automatically. All nodes read/write the same keys, preventing per-server quota multiplication.',
      benefit:
        'Accurate global limits, sub-millisecond lookups, and mature patterns (sliding window logs, token bucket scripts) at scale.',
      risk:
        'Redis outage may fail open (no limits) or fail closed (block traffic); hot keys on viral clients; added network hop latency.',
      example:
        'Three Kubernetes pods share `ratelimit:{apiKey}` keys in Redis Cluster; INCR with 60-second TTL enforces 100 req/min.',
      conclusion:
        'Use Redis (or equivalent shared store) when horizontal scaling would otherwise multiply effective rate limits per instance.',
    },
    hints: ['What happens if each server keeps its own counter?', 'How does TTL support fixed windows?'],
  },
  {
    id: 'q-api-05',
    topicId: 'api-rate-limiting',
    category: 'mechanism',
    difficulty: 'foundation',
    prompt: 'Explain the fixed-window boundary burst problem with an example.',
    rubric: createRubric({
      requiredConcepts: ['requests at end and start of adjacent windows', 'double effective throughput briefly'],
      mechanismSteps: [
        'State limit per window',
        'Show burst at window boundary',
        'Quantify short-term exceedance',
      ],
      prohibitedClaims: ['fixed window perfectly enforces average rate at all times'],
      terminologyKeywords: ['fixed window', 'boundary', 'burst'],
    }),
    modelAnswer: {
      id: 'q-api-05-model',
      questionId: 'q-api-05',
      topicId: 'api-rate-limiting',
      estimatedSeconds: 65,
      definition:
        'Fixed-window limits can allow twice the nominal rate in a short span when traffic clusters at the end of one window and the start of the next.',
      mechanism:
        'If the limit is 100 requests per minute, a client may send 100 requests at 00:59 and another 100 at 01:00—200 requests in two seconds while each window appears compliant.',
      benefit:
        'Fixed windows remain attractive for simplicity and low memory when approximate limits suffice.',
      risk:
        'Backend spikes at boundaries can trigger latency or exhaustion on expensive endpoints.',
      example:
        'Scraper hits catalog API with 50 req/s at minute rollovers until blocked by downstream DB saturation, not the limiter math.',
      conclusion:
        'Mitigate with sliding windows, token buckets, or smaller sub-windows when boundary bursts matter.',
    },
    hints: ['Think about 00:59 and 01:00.', 'How many requests in two seconds?'],
  },
  {
    id: 'q-api-06',
    topicId: 'api-rate-limiting',
    category: 'comparison',
    difficulty: 'intermediate',
    prompt: 'How does a sliding-window rate limit differ from a fixed window?',
    rubric: createRubric({
      requiredConcepts: ['rolling time interval', 'smoother enforcement', 'more state or computation'],
      mechanismSteps: [
        'Define fixed window reset',
        'Define sliding window lookback',
        'Compare fairness and memory cost',
      ],
      terminologyKeywords: ['sliding window', 'fixed window', 'rolling'],
    }),
    modelAnswer: {
      id: 'q-api-06-model',
      questionId: 'q-api-06',
      topicId: 'api-rate-limiting',
      estimatedSeconds: 70,
      definition:
        'Sliding-window rate limiting counts requests over a rolling interval ending at the current time, rather than a rigid clock-aligned bucket.',
      mechanism:
        'Implementations store timestamps or sub-window counters for the last N seconds/minutes and reject when the rolling sum exceeds the threshold. This removes the sharp reset edge of fixed windows.',
      benefit:
        'Smoother traffic shaping and fairer limits for bursty but legitimate clients.',
      risk:
        'Higher memory per client (timestamp lists) or more complex Redis structures compared to a single counter.',
      example:
        'Redis sorted set stores request timestamps; ZREMRANGEBYSCORE drops entries older than 60 seconds before counting.',
      conclusion:
        'Sliding windows trade implementation cost for fairness when boundary artifacts are unacceptable.',
    },
    hints: ['Does the window move with each request?', 'Why is state heavier?'],
  },
  {
    id: 'q-api-07',
    topicId: 'api-rate-limiting',
    category: 'architecture',
    difficulty: 'intermediate',
    prompt: 'What dimensions would you rate-limit on for a public API with both anonymous and authenticated traffic?',
    rubric: createRubric({
      requiredConcepts: ['IP for anonymous', 'user ID or API key for authenticated', 'per-endpoint tiers'],
      mechanismSteps: [
        'Identify keys per traffic type',
        'Explain tiered limits per route cost',
        'Note composite key strategies',
      ],
      terminologyKeywords: ['API key', 'IP address', 'user ID', 'endpoint'],
    }),
    modelAnswer: {
      id: 'q-api-07-model',
      questionId: 'q-api-07',
      topicId: 'api-rate-limiting',
      estimatedSeconds: 75,
      definition:
        'Rate-limit dimensions are the identifiers used to bucket traffic—commonly IP, user, API key, or combinations—often with per-endpoint policies.',
      mechanism:
        'Anonymous routes limit by IP and maybe fingerprint; authenticated routes limit by API key or user ID with higher quotas. Expensive endpoints (`/export`, `/search`) get stricter limits than cheap reads. Composite keys like `userId:route` prevent one heavy endpoint from consuming entire quota.',
      benefit:
        'Protects shared infrastructure while giving paying customers predictable throughput.',
      risk:
        'NAT/shared IP unfairness; API key leakage bypasses IP limits; mis-keyed limits block legitimate power users.',
      example:
        'Free tier: 100 req/hour per API key; anonymous health check: 10/min per IP; `/reports/generate`: 5/hour per account.',
      conclusion:
        'Match the limit dimension to identity strength and endpoint cost, not one global counter for all routes.',
    },
    hints: ['Should login and search share the same quota?', 'What identifies a paying customer?'],
  },
  {
    id: 'q-api-08',
    topicId: 'api-rate-limiting',
    category: 'mechanism',
    difficulty: 'foundation',
    prompt: 'Describe how a leaky-bucket rate limiter shapes traffic.',
    rubric: createRubric({
      requiredConcepts: ['fixed output processing rate', 'queues or drops excess', 'smooths bursts'],
      mechanismSteps: [
        'Explain bucket drain rate',
        'Describe enqueue or drop behavior on overflow',
        'Contrast with token bucket burst allowance',
      ],
      terminologyKeywords: ['leaky bucket', 'queue', 'smooth'],
    }),
    modelAnswer: {
      id: 'q-api-08-model',
      questionId: 'q-api-08',
      topicId: 'api-rate-limiting',
      estimatedSeconds: 65,
      definition:
        'A leaky-bucket limiter processes requests at a constant outflow rate, queuing or dropping excess inbound traffic to smooth spikes.',
      mechanism:
        'Incoming requests fill a bucket; the bucket leaks at a fixed rate to the backend. If the bucket overflows, requests are delayed or rejected. Unlike token bucket, emphasis is on steady output rather than allowing large upfront bursts.',
      benefit:
        'Protects downstream systems with strict capacity from sudden floods.',
      risk:
        'Queues add latency; dropped requests may surprise clients expecting hard numeric quotas; tuning queue size is critical.',
      example:
        'Payment webhook processor accepts bursts into a queue but delivers to core banking at 50 TPS maximum.',
      conclusion:
        'Leaky bucket fits when downstream can only absorb steady traffic, not when clients need explicit burst budgets.',
    },
    hints: ['Is output rate constant?', 'How does this differ from token refill?'],
  },
  {
    id: 'q-api-09',
    topicId: 'api-rate-limiting',
    category: 'scenario',
    difficulty: 'intermediate',
    prompt: 'Where should rate limiting run—API gateway, reverse proxy, or application code—and why?',
    rubric: createRubric({
      requiredConcepts: ['edge enforcement drops traffic early', 'app-level allows business-aware keys', 'defense in depth'],
      mechanismSteps: [
        'Describe gateway/proxy role',
        'Describe app-level contextual limits',
        'Recommend layered placement',
      ],
      terminologyKeywords: ['API gateway', 'reverse proxy', 'nginx', 'Envoy', 'edge'],
    }),
    modelAnswer: {
      id: 'q-api-09-model',
      questionId: 'q-api-09',
      topicId: 'api-rate-limiting',
      estimatedSeconds: 75,
      definition:
        'Rate limiting can run at the edge (gateway/proxy) for coarse protection or in application code for context-rich policies—often both.',
      mechanism:
        'Gateways and proxies (nginx, Envoy, Cloudflare) enforce IP and API-key limits before traffic hits app servers, saving CPU. Application middleware applies limits using user roles, subscription tier, or endpoint cost that the edge cannot see.',
      benefit:
        'Edge limits stop floods cheaply; app limits align with business rules and authenticated identity.',
      risk:
        'Edge-only limits lack tenant context; app-only limits waste resources parsing abusive requests; inconsistent config between layers confuses debugging.',
      example:
        'CDN limits 10k req/s per POP; API gateway caps keys; login service adds per-username Redis limits.',
      conclusion:
        'Use edge for volumetric control and app for semantic limits—document precedence when both apply.',
    },
    hints: ['Which layer sees subscription tier?', 'Where is abuse cheapest to block?'],
  },
  {
    id: 'q-api-10',
    topicId: 'api-rate-limiting',
    category: 'risk-tradeoff',
    difficulty: 'intermediate',
    prompt: 'What are the tradeoffs of triggering CAPTCHA after rate-limit violations on a login API?',
    rubric: createRubric({
      requiredConcepts: ['adds bot friction', 'accessibility concerns', 'not a substitute for MFA'],
      mechanismSteps: [
        'Explain CAPTCHA as escalation step',
        'List UX and a11y impacts',
        'Note sophisticated bots bypassing CAPTCHA',
      ],
      terminologyKeywords: ['CAPTCHA', 'friction', 'accessibility', 'bot'],
    }),
    modelAnswer: {
      id: 'q-api-10-model',
      questionId: 'q-api-10',
      topicId: 'api-rate-limiting',
      estimatedSeconds: 70,
      definition:
        'CAPTCHA after rate limits adds a human verification step to slow automated abuse, at the cost of user friction and accessibility.',
      mechanism:
        'When IP or username counters exceed thresholds, the login flow requires CAPTCHA completion before password verification proceeds. Risk engines may skip CAPTCHA for known devices.',
      benefit:
        'Increases attacker cost after volumetric limits are hit; reduces scripted stuffing throughput.',
      risk:
        'Screen-reader and accessibility issues; user frustration; CAPTCHA farms and ML solvers reduce effectiveness; false positives on shared networks.',
      example:
        'After five failed logins from one IP in ten minutes, Cloudflare Turnstile must pass before the next attempt.',
      conclusion:
        'Use CAPTCHA as a layered speed bump with accessible alternatives, not the sole defense for account security.',
    },
    hints: ['Who suffers on a shared office IP?', 'Can bots solve modern CAPTCHAs?'],
  },
  {
    id: 'q-api-11',
    topicId: 'api-rate-limiting',
    category: 'troubleshooting',
    difficulty: 'assessment',
    prompt: 'Legitimate users behind a corporate NAT report constant 429 errors. How do you tune rate limiting?',
    rubric: createRubric({
      requiredConcepts: ['shared IP false positives', 'authenticated per-user limits', 'higher quotas with API keys'],
      mechanismSteps: [
        'Diagnose shared-IP clustering',
        'Shift limit key to user/session/API key',
        'Adjust quotas or allowlist enterprise egress',
      ],
      terminologyKeywords: ['NAT', 'false positive', 'API key', 'per-user'],
    }),
    modelAnswer: {
      id: 'q-api-11-model',
      questionId: 'q-api-11',
      topicId: 'api-rate-limiting',
      estimatedSeconds: 75,
      definition:
        'Corporate NAT concentrates many users behind one IP, so IP-only limits can throttle innocent traffic while attackers rotate addresses.',
      mechanism:
        'Move primary quota to authenticated identifiers (user ID, OAuth subject, API key). Keep a higher IP ceiling as a safety net. Offer enterprise customers dedicated keys or egress allowlists. Monitor 429 rates per IP vs per user to validate tuning.',
      benefit:
        'Restores service for dense networks while preserving abuse protection on anonymous endpoints.',
      risk:
        'Looser IP limits reopen volumetric abuse; allowlists require contract and revocation processes.',
      example:
        'SaaS raises anonymous IP limit from 100 to 500 req/min but enforces 2000 req/min per logged-in tenant ID.',
      conclusion:
        'Prefer strong identity keys for limits; treat raw IP limits as a coarse backstop, not the only control.',
    },
    hints: ['Why do many users share one public IP?', 'What identity do logged-in users provide?'],
  },
  {
    id: 'q-api-12',
    topicId: 'api-rate-limiting',
    category: 'risk-tradeoff',
    difficulty: 'pressure',
    prompt: 'Why cannot rate limiting alone stop a determined distributed credential-stuffing campaign?',
    rubric: createRubric({
      requiredConcepts: ['attackers rotate IPs and usernames', 'low-and-slow under thresholds', 'needs credential and auth controls'],
      mechanismSteps: [
        'Describe distributed low-volume pattern',
        'Explain per-IP limit bypass',
        'List complementary controls',
      ],
      prohibitedClaims: ['rate limits completely stop stuffing'],
      terminologyKeywords: ['distributed', 'credential stuffing', 'low and slow'],
    }),
    modelAnswer: {
      id: 'q-api-12-model',
      questionId: 'q-api-12',
      topicId: 'api-rate-limiting',
      estimatedSeconds: 80,
      definition:
        'Distributed stuffing stays under per-IP thresholds by using many addresses and trying few passwords per account, evading simple volumetric caps.',
      mechanism:
        'Botnets spread attempts across thousands of IPs, each making a handful of logins. Global IP limits rarely trigger; per-username limits help but can lock out victims if set aggressively. Attackers target many accounts slowly.',
      benefit:
        'Rate limits still raise baseline cost and catch noisy attackers.',
      risk:
        'Stuffing succeeds without breached-password checks, MFA, device trust, and anomaly detection.',
      example:
        '1M combos over a week from 50k residential IPs at one attempt per IP per hour stays under 100/hour IP caps.',
      conclusion:
        'Pair rate limits with stuffing-specific detection, strong MFA, and password hygiene—not limits in isolation.',
    },
    hints: ['How many IPs can attackers rent?', 'Is one try per account per day visible to IP counters?'],
  },
  {
    id: 'q-api-13',
    topicId: 'api-rate-limiting',
    category: 'architecture',
    difficulty: 'assessment',
    prompt: 'Design rate-limit policies for three endpoints: `/health`, `/login`, and `/reports/export`.',
    rubric: createRubric({
      requiredConcepts: ['different limits per cost and risk', 'strict login limits', 'expensive export throttled'],
      mechanismSteps: [
        'Assign policy per endpoint sensitivity',
        'State limit keys and algorithms',
        'Include 429 behavior',
      ],
      terminologyKeywords: ['per-endpoint', 'login', 'export', 'health check'],
    }),
    modelAnswer: {
      id: 'q-api-13-model',
      questionId: 'q-api-13',
      topicId: 'api-rate-limiting',
      estimatedSeconds: 85,
      definition:
        'Effective API rate limiting tiers policies by endpoint risk and resource cost rather than one global quota.',
      mechanism:
        '`/health`: generous IP limit (e.g., 1000/min) for monitors, no auth. `/login`: strict token bucket per IP and username (10/15min), 429 with Retry-After, optional CAPTCHA escalation. `/reports/export`: low per-user limit (5/hour), async job queue, 429 when queue saturated.',
      benefit:
        'Protects authentication and heavy workloads while keeping cheap probes available for operations.',
      risk:
        'Misconfigured health limits hide outages; export queues need status endpoints; login limits need NAT mitigations.',
      example:
        'Redis keys `rl:login:ip:{ip}`, `rl:login:user:{email}`, `rl:export:user:{id}` with Lua token-bucket scripts; gateway passes `X-RateLimit-Remaining`.',
      conclusion:
        'Document per-route limits in API contracts and alert when endpoints approach saturation separately.',
    },
    hints: ['Which route is brute-forced?', 'Which route hammers the database?'],
  },
];
