import type { Topic } from '../../types';

export const sqlInjectionTopic: Topic = {
  id: 'sql-injection',
  title: 'SQL Injection and Secure Database Access',
  day: 2,
  tags: ['sql-injection', 'parameterization', 'prepared-statements', 'orm', 'least-privilege'],
  plainDefinition:
    'SQL injection happens when untrusted input is combined with SQL code and changes what the database executes—often letting attackers bypass login or read data.',
  technicalDefinition:
    'SQL injection is an input-validation failure where attacker-controlled data alters the structure or logic of a SQL statement because the application treats user input as executable SQL syntax rather than bound data values.',
  mechanism: [
    'Application builds SQL by concatenating strings instead of using bound parameters (unsafe email-in-WHERE pattern).',
    'Attacker supplies input containing SQL metacharacters or clauses (e.g., quote termination, OR 1=1, UNION).',
    'Database parser interprets injected syntax as part of the query logic.',
    'Outcomes: authentication bypass, data exfiltration, modification, deletion, or in some stacks, extended exploitation.',
    'Defense: parameterized queries / prepared statements bind user values as data, not code.',
    'Driver sends query template and parameters separately; database never parses input as SQL structure.',
    'ORMs generate parameterized SQL by default but raw queries and dynamic identifiers can reintroduce risk.',
    'Input validation and least-privilege DB accounts limit blast radius; sanitization alone is unreliable.',
    'Verbose SQL errors in responses can leak schema details to attackers.',
  ],
  securityBenefit:
    'Parameterized access and least privilege prevent untrusted input from changing query intent and limit damage if a query is abused.',
  risksAndTradeoffs: [
    'Dynamic table/column names cannot always be parameterized—require allowlists.',
    'ORM raw SQL and stored procedures built via concatenation remain vulnerable.',
    'Overly privileged DB users amplify injection impact.',
    'Sanitization is error-prone and context-dependent (escaping rules differ).',
    'Blind injection is harder to detect but still dangerous.',
  ],
  realWorldExample:
    'A login form passes email/password into a concatenated query. Input `admin\'--` comments out the password check. Fix: `SELECT * FROM users WHERE email = ?` with bound parameters via a prepared statement.',
  commonMisconception:
    'Input sanitization or escaping alone is not a reliable substitute for parameterization—one missed context (ORDER BY, LIKE, identifier) can still allow injection.',
  modelAnswer: {
    id: 'sql-model-parameterization',
    topicId: 'sql-injection',
    estimatedSeconds: 75,
    definition:
      'SQL injection is when attacker-controlled input alters a SQL query because the application mixes user data into SQL code instead of sending it as separate parameters.',
    mechanism:
      'In unsafe code, strings are concatenated into the query, so quotes and SQL keywords in input change query logic. Parameterized queries send a fixed template like `SELECT * FROM users WHERE email = ?` and bind the email as a value. The database treats parameters as data, not executable syntax, so injection payloads cannot change query structure.',
    benefit:
      'Prevents attackers from rewriting WHERE clauses, bypassing authentication, or extracting arbitrary rows.',
    risk:
      'Raw SQL in ORMs, dynamic identifiers, and over-privileged DB accounts can still allow abuse. Sanitization is fragile compared to binding.',
    example:
      'Unsafe string concatenation in WHERE clause vs safer prepared statement with ? placeholder for email.',
    conclusion:
      'The core fix is separation of SQL code from user data through parameterization, supported by least privilege and safe error handling.',
  },
  weakAnswer:
    'SQL injection is bad input. You should sanitize user input and use an ORM so it never happens.',
  weakAnswerExplanation:
    'Claims ORM always prevents injection (false). No mechanism for how injection works or how parameters help. No tradeoffs or example.',
  followUpQuestions: [
    'Show how `\' OR 1=1 --` can bypass a login query.',
    'Why cannot you parameterize a table name?',
    'When can an ORM still be unsafe?',
    'Why is least privilege important after an injection?',
  ],
  relatedTopicIds: ['jwt-authentication', 'defensive-security'],
};
