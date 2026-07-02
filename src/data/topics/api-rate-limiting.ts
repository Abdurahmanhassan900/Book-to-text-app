import type { Topic } from '../../types';

export const apiRateLimitingTopic: Topic = {
  id: 'api-rate-limiting',
  title: 'API Security and Rate Limiting',
  day: 5,
  tags: ['rate-limiting', 'api', 'token-bucket', 'brute-force', '429', 'redis'],
  plainDefinition:
    'Rate limiting caps how many requests a client can make in a time window to protect APIs from abuse, overload, and automated attacks.',
  technicalDefinition:
    'Rate limiting is a traffic-control mechanism that tracks request counts per dimension (IP, user, API key) and rejects or delays excess requests, typically responding with HTTP 429 Too Many Requests.',
  mechanism: [
    'Fixed window: count requests per clock window (e.g., 100/minute); simple but allows bursts at boundaries.',
    'Sliding window: smooths counts over rolling interval—fairer, more state per client.',
    'Token bucket: tokens refill at steady rate; requests consume tokens; allows controlled bursts.',
    'Leaky bucket: processes requests at fixed output rate—smooths traffic shape.',
    'Counters stored in memory (single node) or shared store (Redis) for distributed APIs.',
    'API gateway or reverse proxy (nginx, Envoy, Cloudflare) enforces limits before backend.',
    'On exceed: return 429 with Retry-After; optionally escalate to CAPTCHA or lockout on login.',
    'Layer with MFA, bot detection, and credential stuffing defenses.',
  ],
  securityBenefit:
    'Reduces brute-force login attempts, credential stuffing volume, scraping, and resource exhaustion (DoS) on expensive endpoints.',
  risksAndTradeoffs: [
    'Shared NAT IPs block legitimate users behind one address.',
    'Aggressive limits hurt UX; tuning per endpoint is required.',
    'Attackers distribute across IPs; rate limits alone do not stop determined abuse.',
    'CAPTCHA adds friction and accessibility concerns.',
    'Distributed counting adds latency and Redis dependency.',
  ],
  realWorldExample:
    'Login API allows 5 attempts per IP per minute via token bucket in Redis; `/search` allows 60/min per API key; gateway returns 429 with Retry-After: 30.',
  commonMisconception:
    'Account lockout or IP throttling alone does not stop distributed credential stuffing—attackers rotate IPs and usernames slowly.',
  modelAnswer: {
    id: 'rate-limit-model-compare',
    topicId: 'api-rate-limiting',
    estimatedSeconds: 75,
    definition:
      'Rate limiting restricts how many requests a client can make in a period to protect availability and reduce automated abuse.',
    mechanism:
      'Fixed window resets a counter each minute—simple but can allow double traffic at window edges. Sliding window tracks a rolling timeframe for smoother limits. Token bucket refills tokens over time and spends one per request, allowing short bursts without exceeding average rate.',
    benefit:
      'Slows brute-force and credential stuffing, protects database-heavy endpoints, and preserves service for legitimate users.',
    risk:
      'Shared IPs cause false positives; global limits may block good traffic; determined attackers use many IPs—needs layered controls.',
    example:
      'API gateway enforces 1000 req/hour per API key with Redis-backed token bucket; login route has stricter 10/min per IP.',
    conclusion:
      'Choose algorithm based on burst tolerance and fairness; combine with auth, MFA, and monitoring—not limits alone.',
  },
  weakAnswer:
    'Rate limiting blocks hackers. We set 100 requests and use CAPTCHA.',
  weakAnswerExplanation:
    'No algorithm comparison, no 429/Retry-After, no shared-IP tradeoff, no distributed abuse mention.',
  followUpQuestions: [
    'Compare fixed window vs token bucket for a login endpoint.',
    'How does Redis help in a multi-instance deployment?',
    'What is HTTP 429 used for?',
    'How would you protect against credential stuffing?',
  ],
  relatedTopicIds: ['defensive-security', 'jwt-authentication'],
};
