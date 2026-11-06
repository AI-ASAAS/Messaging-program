# Web, API, identity, and data controls

Apply the sections relevant to the observed system. These controls support review; they are not a substitute for understanding its data flow. Search terms: BOLA, IDOR, BFLA, mass assignment, JWT, OAuth, CSRF, CORS, XSS, SQLi, SSRF, upload, traversal, cache, rate limit.

## Authentication and account lifecycle

Verify enrollment, login, logout, recovery, email changes, account linking, MFA enrollment/removal, and administrative recovery. Do not allow a weak recovery path to bypass strong authentication. Use generic authentication responses where enumeration matters, without removing actionable ordinary validation errors.

Require fresh authentication for sensitive account changes according to risk. Prefer phishing-resistant authentication such as passkeys for high-value access. Rate-limit attempts and recovery delivery; avoid account lockout designs that enable trivial denial of service.

For password policy, use the applicable identity standard. NIST SP 800-63B-4 distinguishes single-factor passwords (minimum 15 characters) from passwords used only in MFA (minimum 8); allow at least 64 characters, check compromised/common values, and support password managers. Do not impose arbitrary composition rules or periodic changes without compromise evidence. Do not silently truncate.

Store passwords with a maintained adaptive password-hashing library. Argon2id is a preferred general-purpose choice; select current parameters and benchmark under expected load. Use a suitable approved alternative where platform or compliance constraints require it. Migrate legacy hashes on successful authentication. Fast unsalted hashes and reversible encryption are not password-storage solutions.

Sources: [NIST authentication](https://pages.nist.gov/800-63-4/sp800-63b/authenticators/), [OWASP password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).

## Sessions and tokens

Generate unpredictable session identifiers; rotate them after authentication and privilege elevation. Enforce inactivity and absolute lifetimes appropriate to risk, logout invalidation, and a revocation strategy for credential compromise or account disablement. Recovery tokens should be purpose-bound, short-lived, single-use, and atomically consumed.

For browser sessions, prefer server-managed sessions in `Secure`, `HttpOnly` cookies when the architecture allows. Minimize cookie scope; use the `__Host-` prefix when its `Path=/`, no-`Domain`, and secure-origin requirements fit. Choose `SameSite` for actual navigation and federation flows rather than applying `Strict` universally. `SameSite=None` requires `Secure` and appropriate CSRF defenses.

JavaScript-readable storage exposes bearer tokens to script compromise. HttpOnly reduces token reading but does not prevent injected scripts from acting as the user. Native clients and service APIs require their own credential-storage design; do not force browser cookies everywhere.

Source: [OWASP session management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

For JWTs, decoding is not verification. Pin permitted algorithms and trusted key sources; verify signature, issuer, audience, expiration, applicable `nbf`, token purpose, and required claims using a maintained verifier. Reject algorithm/key confusion and unexpected token types. Treat `kid`, `jku`, and `x5u` as untrusted input. Never fetch an arbitrary token-supplied key URL. Plan rotation and bounded clock tolerance. Signed JWT payloads are readable unless separately encrypted.

Source: [JWT BCP, RFC 8725](https://www.rfc-editor.org/rfc/rfc8725.html).

## OAuth, OpenID Connect, and federation

Use maintained protocol libraries. Prefer authorization code flows with PKCE using `S256`; verify the provider's support and reject downgrade. Validate exact registered redirects, issuer, audience, and flow-specific state/nonce bindings. Distinguish access tokens from ID tokens. Do not derive account ownership from an unverified email claim or link accounts solely because email strings match.

Avoid introducing the implicit or resource-owner-password grant. Protect refresh tokens with appropriate rotation/reuse detection or sender constraints. Keep client secrets out of public clients. Use workload identity or appropriately scoped service authentication for machine access, rather than inventing user sessions for jobs.

Source: [OAuth security BCP, RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html).

## Authorization and tenant isolation

Derive the acting principal from verified server-side authentication. A caller-supplied `requesterId`, `role`, `ownerId`, or `tenantId` is not proof of authority. Check permissions for the action, target object, tenant, and mutable/readable fields. A legitimate client-selected tenant must be checked against current membership.

Scope reads and writes to authorized records at the data-access boundary. Apply the same policy to lists, counts, search, files, exports, queues, subscriptions, and caches. Enforce field-level write allowlists to prevent role, billing, ownership, and entitlement changes through mass assignment. Use explicit response projections to avoid exposing restricted fields.

Test horizontal, vertical, and cross-tenant access with two real test principals. Check permission changes and stale cache/token claims. For races between authorization and mutation, use atomic conditions or transactions when the invariant requires them. Opaque IDs reduce guessing; they do not replace access checks.

Sources: [OWASP authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html), [API Security Top 10](https://api-security.owasp.org/editions/2023/en/0x11-t10/).

## Input, schemas, and boundary contracts

Validate on the receiving trusted side before use, including inputs from queues, webhooks, imported files, internal services, and third-party responses. Constrain type, length, nesting, counts, range, encoding, and content type. Reject or deliberately strip unknown fields; independently allowlist fields that may be persisted. TypeScript types do not validate runtime requests.

Resolve canonicalization once and validate the representation actually consumed downstream. Consider duplicate parameters, parser disagreement, case folding, Unicode, numeric coercion, `NaN`, infinity, and integer overflow where applicable. Validation does not replace sink-specific encoding, query binding, or authorization. Inspect regex complexity and parser limits before exposing them to large input.

Source: [OWASP input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

## Injection and unsafe execution

- **SQL:** Bind values through supported parameters. For identifiers and sort directions that cannot be bound, map accepted choices to fixed trusted expressions. Inspect raw ORM fragments and stored procedures; an ORM does not make arbitrary SQL safe. Keep database credentials narrowly privileged.
- **NoSQL/search/LDAP/XPath:** Use structured APIs and appropriate parameterization; reject unexpected operators or expression objects. User-controlled filters must not broaden tenant or authorization predicates.
- **OS commands:** Prefer native APIs. When a process is necessary, use an explicit executable and argument array with shell execution disabled, then restrict dangerous options and argument semantics. Shell-free execution does not eliminate argument injection.
- **Templates and interpreters:** Do not treat user text as source code, template syntax, an expression, or a module name. Avoid unsafe deserialization of attacker-controlled objects.
- **XML and structured parsers:** Disable unnecessary external entity and DTD processing; bound expansion, nesting, and memory. Review object merging and prototype mutation in JavaScript.

Sources: [OWASP SQL injection prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html), [OWASP OS command injection defense](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html). Check the actual parser and process API documentation before implementing stack-specific controls.

## Browser output and CSP

Use framework auto-escaping and safe DOM APIs for ordinary text. Encode for the destination context; HTML, JavaScript, CSS, attributes, and URLs are different contexts. Validate URL schemes and destinations where relevant. For required rich HTML, use a maintained sanitizer with a narrowly defined policy; inspect Markdown plugins, SVG, embedded content, and transformations after sanitization.

Deploy an application-compatible CSP, preferably using unpredictable per-response nonces or validated hashes for scripts. Avoid weakening production script policy with broad `unsafe-inline` or `unsafe-eval` allowances. Limit object embedding, base URLs, framing, and relevant network destinations. Report-only mode observes violations; it does not enforce the policy. Verify real response headers, rendering, and third-party integrations before enforcement.

CSP and HttpOnly cookies are additional defenses, not proof that XSS is absent. Also examine `postMessage` origins, DOM insertion, third-party scripts, and cross-origin embedding.

Sources: [OWASP XSS prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), [OWASP CSP](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html).

## CSRF and CORS

For requests authenticated through ambient browser credentials, use the framework's verified CSRF mechanism. Where tokens are needed, use session-bound synchronizer tokens or a correctly signed, session-bound double-submit design. Origin/Referer and Fetch Metadata checks can contribute to a documented defense with appropriate fallback. Do not make state changes through GET.

SameSite alone is not a universal defense, particularly with sibling subdomains. Header-bearer APIs without ambient credentials have a different CSRF threat model. Authenticate provider webhooks independently; exempt only the necessary endpoint rather than disabling CSRF globally.

CORS controls browser access to responses; it is not authorization. Use exact permitted origins, limited methods/headers, and credential settings compatible with the intended clients. Do not reflect arbitrary origins or accept `null` origins without a justified use case. Test preflight and caching behavior.

Source: [OWASP CSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).

## SSRF and outbound integrations

Trace every user-influenced URL fetch, webhook destination, preview, PDF/image renderer, import, and proxy. Prefer fixed destinations or strict allowlists when business requirements permit. Parse URLs using a standard parser; restrict scheme, port, host, redirects, credentials, and forwarding of sensitive headers.

For arbitrary outbound fetches, enforce an egress boundary that excludes prohibited internal, loopback, link-local, metadata, and special-use destinations across IPv4 and IPv6. Validate DNS results and the address actually connected to; a preflight lookup alone is vulnerable to rebinding or a second resolution. Revalidate each redirect or disallow redirects. Keep TLS hostname verification intact when controlling resolution.

Bound time, response size, decompression, redirects, and concurrent requests. Do not accept upstream data as trusted application instructions or authenticated identity. Do not probe live metadata services merely to demonstrate a risk.

Source: [OWASP SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html).

## Files, uploads, downloads, and archives

Authenticate access as required and check ownership on retrieval, not just upload. Enforce server-side streaming size limits, content/type validation, safe parsing, and resource limits. Filename extensions and client-supplied MIME values are insufficient; magic bytes alone are insufficient too.

Use generated storage keys, isolated non-executable storage, and least filesystem privilege. Prevent path traversal, absolute-path escapes, symlink/reparse-point escapes, and unsafe archive extraction. Bound expanded size, file count, recursion, and image dimensions. Isolate parsers/converters and remove unnecessary network access.

Use malware scanning or content disarm where relevant, with a defined quarantine/error policy. Serve untrusted active content from an appropriately isolated origin or as an attachment. Validate download names and headers. Scope signed URLs narrowly and limit lifetime; possession may itself confer access.

Source: [OWASP file upload security](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).

## APIs, resource use, and protocol boundaries

Set risk-based limits on requests, body size, concurrent work, pagination, query complexity, export volume, retries, and paid provider calls. A single IP limit is insufficient for authenticated abuse and may penalize shared networks. Use appropriate account, tenant, endpoint, and global dimensions. Verify atomic/distributed enforcement and trusted proxy configuration. Define outage behavior for the limiter.

For GraphQL, check resolver and field authorization plus depth/cost, aliases, batching, and pagination. For WebSockets, check origin where relevant, authenticate connections, authorize messages, bound sizes, and handle expiry/revocation during long sessions. Check gRPC and queue identities instead of assuming internal traffic is trusted.

Inspect CDN and application cache keys for tenant/user variation and correct cache directives on sensitive responses. Review host/forwarded-header trust, reset-link URL construction, redirects, debug endpoints, API inventory, deprecated versions, and inconsistent proxy/backend request parsing. Treat request-smuggling tests as environment-specific runtime work, not a conclusion inferred from one header.

Source: [OWASP API Security Top 10](https://api-security.owasp.org/editions/2023/en/0x11-t10/).

## Data exposure, errors, and privacy

Return only authorized, necessary fields. Trace sensitive data through responses, analytics, traces, exception reports, caches, object storage, backups, notifications, and support exports. Define retention, deletion, and access controls appropriate to the product; confirm jurisdiction and obligations before making compliance claims.

Use useful public error codes and correlation identifiers without leaking internals, credentials, or another user's existence where sensitive. Error boundaries must not accidentally allow a denied operation, leave an inconsistent partial write, or retry a non-idempotent side effect. Verify actual failure behavior when identity, policy, storage, and downstream services are unavailable.
