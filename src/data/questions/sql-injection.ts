import type { PracticeQuestion } from '../../types';
import { createRubric } from '../rubrics/helpers';

export const sqlQuestions: PracticeQuestion[] = [
  {
    id: 'q-sql-01',
    topicId: 'sql-injection',
    category: 'definition',
    difficulty: 'foundation',
    prompt: 'What is SQL injection, and why is it still a top web application risk?',
    rubric: createRubric({
      requiredConcepts: [
        'Untrusted input alters SQL query structure or logic',
        'Occurs when user data is concatenated into SQL strings',
        'Can lead to auth bypass, data exposure, or unauthorized modification',
      ],
      mechanismSteps: [
        'Application builds SQL from strings plus user input',
        'Database parser treats injected syntax as SQL code',
        'Query logic changes from developer intent',
        'Attacker achieves unintended database operations',
      ],
      prohibitedClaims: [
        'SQL injection only affects old applications',
        'Sanitization alone prevents SQLi',
        'ORM always safe',
      ],
      terminologyKeywords: ['SQL injection', 'untrusted input', 'query logic', 'concatenation'],
    }),
    modelAnswer: {
      id: 'ma-q-sql-01',
      topicId: 'sql-injection',
      estimatedSeconds: 50,
      definition:
        'SQL injection is a vulnerability where attacker-controlled input is interpreted as part of a SQL command, changing what the database executes beyond the developer\'s intended query.',
      mechanism:
        'When applications embed user input directly into SQL strings, metacharacters like quotes, comments, and boolean operators can break out of the intended data context and inject new clauses. The database cannot distinguish attacker SQL from developer SQL because everything arrives as one parsed statement.',
      benefit:
        'Understanding injection mechanics drives adoption of parameterized queries, least-privilege DB accounts, and secure SDLC practices that eliminate entire vulnerability classes.',
      risk:
        'Impact ranges from login bypass to bulk data theft. ORMs, legacy code, and dynamic query builders still reintroduce risk when misused.',
      example:
        'A login form building `SELECT * FROM users WHERE email = \'<user>\'` lets crafted input alter the WHERE clause logic.',
      conclusion:
        'SQL injection persists because it exploits a fundamental mistake—mixing code and data—so defenses must enforce separation at the database API layer.',
    },
    hints: [
      'Define injection as changing query logic, not just bad characters.',
      'Mention concatenation as the root cause.',
      'Give one impact example without a step-by-step attack recipe.',
    ],
  },
  {
    id: 'q-sql-02',
    topicId: 'sql-injection',
    category: 'mechanism',
    difficulty: 'foundation',
    prompt: 'How do parameterized queries prevent SQL injection?',
    rubric: createRubric({
      requiredConcepts: [
        'SQL template sent separately from parameter values',
        'Database binds parameters as data, not executable syntax',
        'Query structure fixed before parameters are applied',
        'Driver/protocol sends placeholders and values distinctly',
      ],
      mechanismSteps: [
        'Developer writes query with placeholders (? or $1)',
        'Application supplies user input as bound parameter values',
        'Database driver sends template and values separately',
        'Parser never interprets parameter content as SQL keywords',
      ],
      prohibitedClaims: [
        'Sanitization alone prevents SQLi',
        'Parameterized queries work for dynamic table names without allowlists',
        'ORM always safe',
      ],
      terminologyKeywords: [
        'parameterized query',
        'prepared statement',
        'bind parameter',
        'placeholder',
        'separation of code and data',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-sql-02',
      topicId: 'sql-injection',
      estimatedSeconds: 70,
      definition:
        'Parameterized queries (prepared statements) send a fixed SQL template with placeholders to the database and supply user input as bound values, so the database never parses input as SQL syntax.',
      mechanism:
        "Instead of concatenating email into SELECT WHERE email = ..., the developer uses SELECT with ? placeholder and passes email via stmt.setString(1, email). The driver transmits query structure and parameters separately. The parser compiles the template first; bound values are typed data that cannot alter WHERE, UNION, or comment structure.",
      benefit:
        'Eliminates the primary injection vector for value positions in queries—authentication, search filters, and inserts become safe when consistently parameterized.',
      risk:
        'Identifiers (table/column names), ORDER BY fields, and dynamic IN-list construction still need allowlists or framework-specific safe APIs. String-built stored procedures can reintroduce injection.',
      example:
        'Java JDBC: `PreparedStatement ps = conn.prepareStatement("SELECT id FROM users WHERE email = ?"); ps.setString(1, userEmail);`',
      conclusion:
        'Parameterization enforces code/data separation at the protocol level—it is the default correct pattern for all untrusted values in SQL.',
    },
    hints: [
      'Contrast concatenation with placeholders and bound values.',
      'Explain that the parser sees structure before data.',
      'Note limitations for dynamic identifiers separately.',
    ],
  },
  {
    id: 'q-sql-03',
    topicId: 'sql-injection',
    category: 'risk-tradeoff',
    difficulty: 'intermediate',
    prompt: 'Can an ORM completely prevent SQL injection?',
    rubric: createRubric({
      requiredConcepts: [
        'ORMs generate parameterized SQL for standard query APIs',
        'Raw SQL, string interpolation, and dynamic identifiers bypass ORM protections',
        'ORM is a tool—developer misuse reintroduces vulnerability',
      ],
      mechanismSteps: [
        'ORM maps objects to parameterized queries by default',
        'Developer calls safe API (e.g., WHERE email = :email)',
        'Raw query or string concat in ORM reverts to injection risk',
        'Defense requires code review and safe patterns for edge cases',
      ],
      prohibitedClaims: [
        'ORM always safe',
        'Using an ORM means SQL injection is impossible',
        'Sanitization alone prevents SQLi',
      ],
      terminologyKeywords: ['ORM', 'raw SQL', 'parameterized', 'query builder', 'Hibernate', 'Sequelize'],
    }),
    modelAnswer: {
      id: 'ma-q-sql-03',
      topicId: 'sql-injection',
      estimatedSeconds: 65,
      definition:
        'An ORM reduces SQL injection risk by generating parameterized queries for typical operations, but it cannot guarantee safety if developers bypass it with raw SQL or unsafe dynamic construction.',
      mechanism:
        'Frameworks like Hibernate, SQLAlchemy, or Sequelize bind parameters when you use their query APIs (`User.findOne({ where: { email } })`). However, methods such as `sequelize.query("... " + userInput)`, `createNativeQuery` with concatenation, or building ORDER BY from request params without allowlists recreate injection. The ORM does not magically sanitize strings—it only protects paths that use its binding layer.',
      benefit:
        'ORMs eliminate boilerplate and make the safe path the easy path for CRUD operations, reducing accidental concatenation.',
      risk:
        'Teams assume ORM = safe and skip review of the 5% raw queries where incidents happen. Complex reporting queries and DBA-written stored procs are frequent weak points.',
      example:
        "A Rails app uses ActiveRecord safely except one admin report with execute and string-interpolated LIKE clause from params—injectable.",
      conclusion:
        'Treat ORM as parameterized-by-default, not injection-proof—audit raw SQL, dynamic identifiers, and stored procedure construction.',
    },
    hints: [
      'Answer clearly: no, not completely—then explain when ORMs help.',
      'Give a raw SQL bypass example in an ORM.',
      'Mention dynamic ORDER BY as a common edge case.',
    ],
  },
  {
    id: 'q-sql-04',
    topicId: 'sql-injection',
    category: 'scenario',
    difficulty: 'assessment',
    prompt:
      'Describe how SQL injection could bypass authentication on a login form that uses a concatenated query like `SELECT * FROM users WHERE email = \'<input>\' AND password = \'<input>\'`. What is the secure fix?',
    rubric: createRubric({
      requiredConcepts: [
        'Injection can alter boolean logic of WHERE clause',
        'Quote termination and comment syntax can neutralize password check',
        'Fix is parameterized query plus proper password verification (hash compare)',
      ],
      mechanismSteps: [
        'Attacker input breaks out of string literal context',
        'Injected OR condition makes WHERE always true',
        'Comment sequence ignores remainder of intended query',
        'Secure fix: prepared statement and compare password hashes in application',
      ],
      prohibitedClaims: [
        'Sanitization alone prevents SQLi',
        'ORM always safe without code review',
        'Storing plaintext passwords is acceptable if queries are parameterized',
      ],
      terminologyKeywords: [
        'authentication bypass',
        'concatenation',
        'parameterized query',
        'password hash',
        'WHERE clause',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-sql-04',
      topicId: 'sql-injection',
      estimatedSeconds: 75,
      definition:
        'Authentication bypass via SQL injection occurs when crafted login input changes the SQL WHERE clause so the database returns a valid user row without knowing the correct password.',
      mechanism:
        'With concatenation, input such as a quote followed by OR logic and a comment marker can close the email string, add a tautology like OR 1=1, and comment out the password check. The database executes altered logic and may return the first user row. The application, seeing any row, grants access. Defense: use `SELECT id, password_hash FROM users WHERE email = ?` with bound email only, fetch at most one row, then verify the supplied password against the stored bcrypt/Argon2 hash in application code—never compare plaintext passwords in SQL.',
      benefit:
        'Parameterization keeps the query structure fixed; separating authentication logic from SQL prevents injected boolean tricks from logging attackers in.',
      risk:
        'Verbose SQL errors revealing query structure aid attackers. Overprivileged DB accounts let bypass escalate to data exfiltration. Client-side-only validation does not help.',
      example:
        'Educational pattern: email input containing quote-OR-tautology-comment bypasses naive login; fixed version uses JDBC PreparedStatement and `bcrypt.compare()`.',
      conclusion:
        'Auth bypass is the classic SQLi demo—fix with parameterization plus proper credential verification, not input blacklists.',
    },
    hints: [
      'Explain the mechanism conceptually: break string, alter logic, comment rest.',
      'Do not provide copy-paste attack strings—focus on why it works.',
      'Secure fix needs both binding and hashed password verification.',
    ],
  },
  {
    id: 'q-sql-05',
    topicId: 'sql-injection',
    category: 'comparison',
    difficulty: 'intermediate',
    prompt: 'Compare input sanitization (escaping) versus parameterization for preventing SQL injection.',
    rubric: createRubric({
      requiredConcepts: [
        'Sanitization tries to make input safe within a concatenated string',
        'Parameterization separates data from SQL structure entirely',
        'Escaping is context-dependent and error-prone (quotes, LIKE, identifiers)',
        'Parameterization is the primary defense for value positions',
      ],
      mechanismSteps: [
        'Sanitization: escape quotes/backslashes before concatenation',
        'Parameterization: bind value after query template compiled',
        'Sanitization fails when context changes or escape logic has bugs',
        'Parameterization handled by database driver reliably for values',
      ],
      prohibitedClaims: [
        'Sanitization alone prevents SQLi',
        'Escaping is always equivalent to prepared statements',
        'ORM always safe',
      ],
      terminologyKeywords: [
        'sanitization',
        'escaping',
        'parameterization',
        'prepared statement',
        'defense in depth',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-sql-05',
      topicId: 'sql-injection',
      estimatedSeconds: 70,
      definition:
        'Input sanitization attempts to neutralize dangerous characters before embedding input in SQL strings, while parameterization sends user data as separate bound values that the database never parses as SQL.',
      mechanism:
        'Escaping doubles single quotes or uses vendor-specific escape functions so concatenated strings remain syntactically valid. This breaks when developers forget a field, use the wrong escape for LIKE wildcards, handle Unicode edge cases, or switch databases. Parameterization fixes the query skeleton (`WHERE id = ?`) and supplies values through the wire protocol as typed parameters—the parser has already fixed structure. Sanitization is fragile; parameterization is structural.',
      benefit:
        'Parameterization is simpler to audit and consistently correct for user-supplied values. Input validation (length, format) still helps as defense in depth but is not a SQLi substitute.',
      risk:
        'Teams relying on custom sanitizers often miss second-order injection or ORDER BY contexts. Neither approach parameterizes table names—allowlists required.',
      example:
        'PHP mysql_real_escape_string era vs modern PDO prepared statements: the latter eliminates quote-escaping bugs in login forms.',
      conclusion:
        'Choose parameterization first; treat sanitization as supplemental validation, not the primary SQLi control.',
    },
    hints: [
      'Frame as fragile vs structural defense.',
      'List contexts where escaping fails (LIKE, identifiers).',
      'Note validation is still useful but not a replacement.',
    ],
  },
  {
    id: 'q-sql-06',
    topicId: 'sql-injection',
    category: 'mechanism',
    difficulty: 'intermediate',
    prompt: 'Why is string concatenation dangerous when building SQL queries?',
    rubric: createRubric({
      requiredConcepts: [
        'SQL parser cannot distinguish developer intent from attacker syntax in one string',
        'Quotes and SQL keywords in input change query semantics',
        'Concatenation mixes code (SQL) and data (user input) in same channel',
      ],
      mechanismSteps: [
        'Developer embeds variable in SQL string',
        'User supplies characters with SQL syntactic meaning',
        'Parser executes combined statement as single program',
        'Resulting logic diverges from intended query',
      ],
      prohibitedClaims: [
        'Concatenation is safe if input is alphanumeric only',
        'Sanitization alone prevents SQLi',
        'ORM always safe even with string-built queries',
      ],
      terminologyKeywords: ['concatenation', 'SQL parser', 'metacharacters', 'code and data'],
    }),
    modelAnswer: {
      id: 'ma-q-sql-06',
      topicId: 'sql-injection',
      estimatedSeconds: 55,
      definition:
        'String concatenation builds SQL by joining literal code fragments with untrusted input, giving the database a single statement where attacker data can be interpreted as executable SQL syntax.',
      mechanism:
        "Languages concatenate literal SQL with untrusted input into one string sent to the DB. If input contains a quote, the string literal boundary shifts. Attackers add operators or comments because the parser processes the entire blob uniformly—no boundary between template and value unless binding enforces it.",
      benefit:
        'Recognizing concatenation as the anti-pattern motivates prepared statements, query builders with bindings, and static analysis rules that flag string SQL.',
      risk:
        'Even partial concatenation in an otherwise safe app creates one exploitable endpoint. Log injection and ORM escape hatches share the same root cause.',
      example:
        "Node.js anti-pattern: db.query with template string embedding req.query.sku directly—one metacharacter breaks logic.",
      conclusion:
        'Never concatenate untrusted input into SQL—use bound parameters so data never shares a syntactic channel with code.',
    },
    hints: [
      'Use the code vs data mixing framing.',
      'Explain parser sees one statement, not two parts.',
      'Give a language-agnostic concatenation example.',
    ],
  },
  {
    id: 'q-sql-07',
    topicId: 'sql-injection',
    category: 'troubleshooting',
    difficulty: 'intermediate',
    prompt:
      'After a pen test, you find verbose SQL errors returned to API clients (e.g., full PostgreSQL syntax error with query fragment). Why is this a security concern related to SQL injection?',
    rubric: createRubric({
      requiredConcepts: [
        'Detailed errors reveal table/column names and query structure',
        'Aids attackers in crafting and refining injection payloads',
        'Secure apps return generic errors and log details server-side',
      ],
      mechanismSteps: [
        'Attacker sends malformed or injected input',
        'Database error includes syntax context or object names',
        'Attacker iterates payloads using error feedback',
        'Blind injection becomes easier with partial error leakage',
      ],
      prohibitedClaims: [
        'SQL errors in API responses help legitimate users and have no security downside',
        'Sanitization alone prevents SQLi',
        'ORM always safe',
      ],
      terminologyKeywords: [
        'verbose errors',
        'information disclosure',
        'blind SQL injection',
        'error handling',
        'logging',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-sql-07',
      topicId: 'sql-injection',
      estimatedSeconds: 60,
      definition:
        'Returning verbose SQL errors to clients is an information disclosure weakness that helps attackers understand database schema and refine SQL injection attacks.',
      mechanism:
        'When injection attempts fail, databases often respond with messages like "syntax error at or near ..." including nearby query text or column names. Attackers use this feedback loop to infer table structure, confirm injectable parameters, and distinguish boolean-based outcomes. Even before successful exploitation, schema leakage reduces attack cost.',
      benefit:
        'Generic client errors ("Invalid request") with detailed server-side logging help developers debug while denying attackers a oracle.',
      risk:
        'Combined with injectable parameters, error-based techniques accelerate compromise. Production stacks should disable display_errors equivalents for database layers.',
      example:
        'API returns `ERROR: column "passwd" does not exist` — attacker learns password column naming and adjusts UNION queries.',
      conclusion:
        'Fix injection with parameterization, but also enforce safe error handling—never teach attackers your schema through HTTP responses.',
    },
    hints: [
      'Link errors to attacker reconnaissance, not just UX.',
      'Recommend generic client message plus server logging.',
      'Mention schema and column name leakage.',
    ],
  },
  {
    id: 'q-sql-08',
    topicId: 'sql-injection',
    category: 'architecture',
    difficulty: 'assessment',
    prompt:
      'How does the principle of least privilege for database accounts limit SQL injection impact?',
    rubric: createRubric({
      requiredConcepts: [
        'Application DB user should have only required DML on specific tables',
        'No admin, FILE, or xp_cmdshell privileges for app accounts',
        'Injection cannot exceed granted permissions',
        'Separate read vs write roles where architecture allows',
      ],
      mechanismSteps: [
        'Define minimal grants per application function',
        'App connects with low-privilege credential',
        'Successful injection limited to permitted operations',
        'Monitor and rotate credentials; no shared superuser',
      ],
      prohibitedClaims: [
        'Least privilege replaces need for parameterization',
        'ORM always safe',
        'Sanitization alone prevents SQLi',
      ],
      terminologyKeywords: [
        'least privilege',
        'GRANT',
        'database roles',
        'blast radius',
        'defense in depth',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-sql-08',
      topicId: 'sql-injection',
      estimatedSeconds: 70,
      definition:
        'Database least privilege means the application connects with a DB account that can only perform the minimum SQL operations on the specific tables required—limiting damage if injection occurs.',
      mechanism:
        'Instead of `root` or `sa`, the web app uses `app_readwrite` with SELECT/INSERT/UPDATE on `orders` and `users` only—no DROP, no access to `admin_secrets`, no server-level extended procedures. If an attacker injects UNION or stacked queries, they cannot read other databases or write files because the DBMS enforces grants regardless of how the SQL arrived. Read replicas and read-only accounts further segment reporting workloads.',
      benefit:
        'Defense in depth: even imperfect code or a missed parameter may not become full database compromise.',
      risk:
        'Overprivileged legacy accounts, shared credentials across services, and migration scripts running as superuser undermine the model. Least privilege does not fix injection—it contains it.',
      example:
        'E-commerce checkout service uses credentials without DELETE on `users`; injection in search may leak product rows but not drop tables or read payment vault tables.',
      conclusion:
        'Pair parameterization with least-privilege DB users so injection failures are contained, not catastrophic.',
    },
    hints: [
      'Stress least privilege is containment, not prevention.',
      'Name privileges to avoid (DDL, admin, file write).',
      'Give a concrete grant scoping example.',
    ],
  },
  {
    id: 'q-sql-09',
    topicId: 'sql-injection',
    category: 'scenario',
    difficulty: 'intermediate',
    prompt:
      'An application has no SQL errors in responses, but a pen tester claims "blind SQL injection" is possible on a search endpoint. What does blind SQL injection mean, and how is it detected?',
    rubric: createRubric({
      requiredConcepts: [
        'Blind SQLi: no direct query output or errors, inference via behavior',
        'Boolean-based: true vs false payloads change response content or status',
        'Time-based: SLEEP/pg_sleep causes measurable delays',
        'Detection via differential response analysis, not destructive payloads',
      ],
      mechanismSteps: [
        'Tester injects conditions that evaluate true or false',
        'Observes page length, content, or HTTP status differences',
        'Alternatively uses time delay functions to confirm execution',
        'Confirms injectable parameter without seeing query results',
      ],
      prohibitedClaims: [
        'Blind SQL injection requires seeing full database error messages',
        'Sanitization alone prevents SQLi',
        'ORM always safe',
      ],
      terminologyKeywords: [
        'blind SQL injection',
        'boolean-based',
        'time-based',
        'inference',
        'differential response',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-sql-09',
      topicId: 'sql-injection',
      estimatedSeconds: 75,
      definition:
        'Blind SQL injection is when an attacker can influence query logic but cannot directly read query results or error messages, inferring success through indirect signals like response differences or timing.',
      mechanism:
        'In a boolean-based blind attack, injected AND conditions cause the app to return a normal search page when true and an empty result when false—leaking one bit per request. Time-based blind uses database sleep functions: if input is injectable, responses delay predictably. Testers automate binary search to extract data slowly. Detection in assessments uses controlled true/false tests and timing measurement—not destructive DROP or DELETE statements.',
      benefit:
        'Understanding blind techniques motivates parameterized queries even when apps hide errors and output, because side channels still leak information.',
      risk:
        'Blind extraction is slow but practical for stealing admin emails or session tokens. WAFs may miss subtle boolean payloads.',
      example:
        'Product search with hidden SQLi: `AND 1=1` returns 50 results, `AND 1=2` returns zero—tester confirms injection without any SQL error in JSON response.',
      conclusion:
        'No visible errors does not mean safety—blind SQLi proves injectable parameters must be parameterized regardless of response hygiene.',
    },
    hints: [
      'Define blind as inference without direct output.',
      'Cover boolean and time-based at a high level.',
      'Keep examples educational—focus on detection concept.',
    ],
  },
  {
    id: 'q-sql-10',
    topicId: 'sql-injection',
    category: 'follow-up',
    difficulty: 'pressure',
    prompt:
      'Follow-up: You recommended parameterized queries. The team asks why they cannot parameterize `ORDER BY <user-supplied column>`. How do you respond?',
    rubric: createRubric({
      requiredConcepts: [
        'SQL placeholders bind values, not identifiers or keywords',
        'ORDER BY column names are identifiers, not string/numeric values',
        'Safe pattern is allowlist mapping user input to known column names',
      ],
      mechanismSteps: [
        'Prepared statement API rejects identifier placeholders',
        'User requests sort column via API parameter',
        'Server maps input to fixed set of allowed column names',
        'Query built only with allowlisted identifier, values still bound',
      ],
      prohibitedClaims: [
        'Sanitization alone prevents SQLi for ORDER BY',
        'You can use prepared statement ? placeholder for column names safely',
        'ORM always safe for dynamic ORDER BY without allowlists',
      ],
      terminologyKeywords: ['ORDER BY', 'identifier', 'allowlist', 'parameter binding', 'dynamic SQL'],
    }),
    modelAnswer: {
      id: 'ma-q-sql-10',
      topicId: 'sql-injection',
      estimatedSeconds: 65,
      definition:
        'SQL parameter placeholders bind literal values (strings, numbers), not SQL identifiers like table or column names—so dynamic ORDER BY requires a different safe pattern.',
      mechanism:
        'Drivers implement binding as typed data values after the query template is parsed. `ORDER BY ?` treats the column name as a string literal, not an identifier, producing invalid or unintended SQL. Attackers supplying `name; DROP` as a "column" cannot be safely escaped with generic sanitizers. The correct approach: accept only semantic sort keys (`price`, `date`), map them in code to fixed column names (`price_cents`, `created_at`), and reject anything else. Use separate bound parameters for LIMIT/OFFSET values.',
      benefit:
        'Allowlisting preserves user-facing flexibility (sort options) without opening identifier injection.',
      risk:
        'String formatting column names from raw user input is equivalent to concatenation. Some ORM `order()` methods pass user strings directly—same risk.',
      example:
        "API sort=price maps through ALLOWED_SORTS allowlist to orderColumn, then SELECT ORDER BY allowlisted column with bound LIMIT.",
      conclusion:
        'Parameterize values everywhere; allowlist identifiers when SQL grammar requires dynamic structure.',
    },
    hints: [
      'Explain values vs identifiers distinction clearly.',
      'Propose allowlist mapping as the standard fix.',
      'Warn against ORM order-by passthrough.',
    ],
  },
  {
    id: 'q-sql-11',
    topicId: 'sql-injection',
    category: 'risk-tradeoff',
    difficulty: 'intermediate',
    prompt: 'When can stored procedures still be vulnerable to SQL injection?',
    rubric: createRubric({
      requiredConcepts: [
        'Stored procedures built with dynamic SQL via concatenation inside the DB are injectable',
        'EXEC with string-assembled commands reintroduces risk',
        'Static parameterized procedures are safer but not magic if miswritten',
      ],
      mechanismSteps: [
        'Procedure receives parameter',
        'Developer builds dynamic SQL string inside procedure',
        'EXECUTE immediate with concatenated input',
        'Attacker parameter alters executed SQL inside procedure',
      ],
      prohibitedClaims: [
        'Stored procedures are always immune to SQL injection',
        'Sanitization alone prevents SQLi',
        'ORM always safe',
      ],
      terminologyKeywords: [
        'stored procedure',
        'dynamic SQL',
        'EXEC',
        'sp_executesql',
        'concatenation',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-sql-11',
      topicId: 'sql-injection',
      estimatedSeconds: 65,
      definition:
        'Stored procedures are only as safe as their implementation—dynamic SQL constructed via string concatenation inside a procedure is vulnerable to the same injection flaws as application-level code.',
      mechanism:
        "A procedure that builds dynamic SQL via string concatenation of input is injectable. Safe procedures use bound parameters within static SQL or parameterized sp_executesql. Moving unsafe concatenation from app to database does not help.",
      benefit:
        'Well-written static procedures with bound parameters can centralize query logic and reduce duplicated concatenation in apps.',
      risk:
        'DBA-maintained legacy procs are often overlooked in appsec reviews. Dynamic pivot/report procs are high risk.',
      example:
        'SQL Server proc `SearchUsers @name` building EXEC string—pen tester injects via @name; fix uses `WHERE name = @name` with parameterized sp_executesql.',
      conclusion:
        'Audit procedure source for dynamic SQL—parameterize inside the database layer the same way you would in application code.',
    },
    hints: [
      'Bust the myth that procedures are automatically safe.',
      'Describe dynamic EXEC with concatenation inside proc.',
      'Mention sp_executesql with proper parameter binding as fix.',
    ],
  },
  {
    id: 'q-sql-12',
    topicId: 'sql-injection',
    category: 'mechanism',
    difficulty: 'intermediate',
    prompt: 'Walk through what happens from application code to the database when using a prepared statement.',
    rubric: createRubric({
      requiredConcepts: [
        'Application prepares SQL template with placeholders',
        'Driver sends PREPARE/PARSE to database (or emulates locally)',
        'Execute binds values with types on each call',
        'Database executes compiled plan with bound data',
      ],
      mechanismSteps: [
        'Developer defines SQL with ? or named placeholders',
        'Connection prepares statement—DB parses once',
        'setString/setInt binds values for execution',
        'Driver encodes parameters separately from SQL text',
        'DBMS executes without reparsing input as syntax',
      ],
      prohibitedClaims: [
        'Prepared statements only escape quotes on the client',
        'Sanitization alone prevents SQLi',
        'ORM always safe',
      ],
      terminologyKeywords: [
        'prepared statement',
        'bind',
        'parse',
        'execute',
        'wire protocol',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-sql-12',
      topicId: 'sql-injection',
      estimatedSeconds: 70,
      definition:
        'A prepared statement separates SQL compilation from execution: the query template is parsed once, and subsequent executions supply only bound parameter values through the database driver.',
      mechanism:
        'In code, `conn.prepareStatement("SELECT id FROM users WHERE email = ?")` causes the driver to send a prepare request. PostgreSQL uses extended query protocol; JDBC drivers may cache plans. On `executeQuery()`, the app calls `setString(1, email)`—the driver transmits the parameter as a typed value binary/text field, not appended to SQL text. The engine matches the existing plan and inserts the value as data. Re-execution with different emails reuses the template without re-parsing user content as SQL.',
      benefit:
        'Structural safety plus performance (plan reuse) on hot paths like login and search.',
      risk:
        'Emulated prepares on some drivers if server-side prepare disabled—still usually safe for injection but verify driver docs. Dynamic SQL construction before prepare defeats the pattern.',
      example:
        'Python psycopg2: `cur.execute("SELECT * FROM orders WHERE id = %s", (order_id,))` — tuple passed separately from query string.',
      conclusion:
        'Prepared statements enforce protocol-level separation of code and data from app through driver to database parser.',
    },
    hints: [
      'Cover prepare/parse once, execute many with binds.',
      'Mention driver sends values separately on the wire.',
      'Use a concrete API example from any common stack.',
    ],
  },
  {
    id: 'q-sql-13',
    topicId: 'sql-injection',
    category: 'scenario',
    difficulty: 'assessment',
    prompt:
      'What is second-order SQL injection, and how does it differ from classic first-order injection?',
    rubric: createRubric({
      requiredConcepts: [
        'First-order: malicious input used immediately in SQL',
        'Second-order: malicious input stored then used unsafely in later query',
        'Stored data treated as trusted on second use is the failure mode',
      ],
      mechanismSteps: [
        'Attacker submits payload stored in database (profile field, log)',
        'Later job or query retrieves stored value',
        'Retrieved value concatenated into new SQL without binding',
        'Injection executes in second context',
      ],
      prohibitedClaims: [
        'Sanitization alone prevents SQLi including second-order',
        'ORM always safe',
        'Only request parameters can be injection sources',
      ],
      terminologyKeywords: [
        'second-order',
        'stored payload',
        'first-order',
        'concatenation',
        'trust boundary',
      ],
    }),
    modelAnswer: {
      id: 'ma-q-sql-13',
      topicId: 'sql-injection',
      estimatedSeconds: 70,
      definition:
        'Second-order SQL injection occurs when malicious input is safely stored once but later retrieved and embedded unsafely into another SQL statement because the application treats database-stored data as trusted.',
      mechanism:
        "In first-order injection, payload in an HTTP request is concatenated immediately. In second-order, attacker stores metacharacters via safe parameterized insert; later an admin tool builds dynamic SQL with concatenated username from DB. Stored payload executes with higher privileges—the initial insert was safe; later misuse was not.",
      benefit:
        'Awareness drives consistent parameterization for all queries—including those reading from your own database—and avoids "trusted internal data" assumptions.',
      risk:
        'Harder to detect in scanning because the exploit spans two requests and may require admin workflows. Batch jobs and analytics are common sinks.',
      example:
        'Educational: malicious display name stored at signup, triggered when nightly cleanup script builds dynamic DELETE with concatenated names.',
      conclusion:
        'Parameterize every query, whether input comes from the user or from a prior database read—storage does not sanitize.',
    },
    hints: [
      'Contrast immediate vs delayed/triggered injection.',
      'Emphasize stored data is not automatically safe.',
      'Give two-step narrative without destructive payload details.',
    ],
  },
  {
    id: 'q-sql-14',
    topicId: 'sql-injection',
    category: 'troubleshooting',
    difficulty: 'intermediate',
    prompt:
      'A code review finds db.raw with string-concatenated region in SELECT WHERE inside an otherwise ORM-based codebase. What is wrong, and how should it be fixed?',
    rubric: createRubric({
      requiredConcepts: [
        'Raw SQL with concatenation bypasses ORM parameterization',
        'Single vulnerable query compromises entire module trust',
        'Fix: ORM bound query or raw API with bound parameters',
      ],
      mechanismSteps: [
        'Identify string interpolation in raw SQL call',
        'Recognize region comes from user or external config',
        'Replace with parameterized raw query or ORM equivalent',
        'Add code review rule to flag string SQL building',
      ],
      prohibitedClaims: [
        'ORM always safe',
        'Sanitization alone prevents SQLi',
        'One raw query is fine because rest of app uses ORM',
      ],
      terminologyKeywords: ['raw SQL', 'ORM', 'concatenation', 'code review', 'parameterized'],
    }),
    modelAnswer: {
      id: 'ma-q-sql-14',
      topicId: 'sql-injection',
      estimatedSeconds: 60,
      definition:
        'This pattern reintroduces classic SQL injection by concatenating untrusted `region` into a raw SQL string, bypassing the ORM\'s safe query APIs.',
      mechanism:
        'ORMs protect `Model.findAll({ where: { region } })` but `db.raw` with JavaScript/Python string interpolation sends one assembled string to the database. Any SQL metacharacters in region alter query logic. Attackers target the one weak endpoint while auditors assume ORM coverage. Fix: `db.raw("SELECT * FROM reports WHERE region = ?", [region])` or equivalent named binding, or use the ORM query builder with bound where clause.',
      benefit:
        'Fixing the outlier aligns the module with consistent injection defenses and passes static analysis rules.',
      risk:
        'Pen testers specifically fuzz rarely used admin/report endpoints. Copy-paste of raw SQL spreads the anti-pattern.',
      example:
        'Knex.js fix: `knex.raw("SELECT * FROM reports WHERE region = ?", [region])` instead of template literal interpolation.',
      conclusion:
        'ORM adoption does not absolve raw SQL—every db.raw call must use binding, and concatenation should fail CI review.',
    },
    hints: [
      'Explain why ORM context does not protect this line.',
      'Show fixed version with bound parameter syntax.',
      'Recommend static analysis or lint rules.',
    ],
  },
];
