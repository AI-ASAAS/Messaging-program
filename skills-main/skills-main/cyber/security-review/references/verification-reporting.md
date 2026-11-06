# Verification and reporting

Use this guide to execute checks, validate findings, verify fixes, and communicate limits across any project type. For a full audit, maintain the inventory and coverage ledger from audit orchestration and assess all applicable components. A concise report is appropriate only when the user explicitly requested a narrow task.

## Select checks by question

| Question | Appropriate evidence | Common limitation |
| --- | --- | --- |
| Can another user access this object? | Integration tests with distinct principals and actual policy/data access | A mocked authorization helper cannot prove the real policy works. |
| Can untrusted input reach a sensitive sink? | Manual data-flow analysis plus appropriate SAST | Pattern matches may miss framework behavior or report unreachable paths. |
| Is a deployed dependency affected? | Resolved inventory, current advisory, package origin, configuration and reachability | Package presence alone does not demonstrate exploitation. |
| Are secrets exposed? | Redacted secret scan of scoped source/history/artifacts and manual classification | A pattern can be a public identifier or fixture; a clean scan can miss unknown formats. |
| Are runtime controls enforced? | Authorized checks against representative responses, identities, and infrastructure | Local configuration is not proof of production behavior. |
| Can malformed data violate memory or parser invariants? | Bounded fuzzing, sanitizers, property-based tests | Coverage and resource limits constrain conclusions. |
| Does the fix close the exploit path? | Regression test plus allowed behavior and persistent-state assertions | A changed response code can hide unchanged side effects. |
| Can a model/data artifact execute code or violate its intended model boundary? | Loader and provenance inspection, isolated format tests, threat-specific model evaluation | A safe weight format does not prove benign model behavior or protect every surrounding parser. |
| Can a local caller reach privileged host functionality? | IPC/extension/OS authorization and input tests using lower-trust callers | An authenticated network path says nothing about an untested local path. |
| Are device updates and recovery protected? | Image/signing configuration plus approved rig or simulator tests | Simulation and source review cannot prove every physical property. |
| Is a library safe for its actual consumers? | Public API contract review and tests through shipped artifacts/bindings | A standalone unit test may miss packaging, FFI, or consumer integration behavior. |

Tool examples, when compatible and available: Semgrep/CodeQL for static analysis; ecosystem audit tools, OSV-Scanner, or Trivy for dependency/artifact analysis; Gitleaks for secrets; Checkov/Trivy for infrastructure; ZAP for authorized web testing; compiler sanitizers for native code. These are options, not required installations or universal recommendations. Verify current official usage, licensing, rules, telemetry, and flags before execution. Do not download and run an unpinned tool merely because it appears here.

## Before executing tools

1. Confirm the target, revision, environment, permitted actions, test identities, and relevant data handling constraints.
2. Inspect existing scripts and configuration. Check whether a supposedly diagnostic command installs packages, executes hooks, calls external endpoints, modifies state, or needs production credentials.
3. Choose bounded inputs and a stop condition. Keep runtime scans within owned or explicitly authorized targets; active scanners can mutate data.
4. Save redacted evidence. Record commands and outputs actually observed, including failures. Avoid embedding sensitive payloads in command history or report attachments.

Do not weaken certificate validation, grant broad privileges, or disable security controls just to make a scanner run. If a tool is unavailable, perform the useful manual checks and report the missing capability. Do not present an unexecuted command as a completed test.

## High-value negative and positive tests

For a full audit, assess every row for applicability and add technology-specific tests from the domain profiles. Do not limit testing to changed code or web surfaces. For an explicitly narrow task, select the affected rows. Use synthetic fixtures, controlled environments, and bounded resources.

| Area | Violating case | Required observation |
| --- | --- | --- |
| Authentication | Missing, expired, wrong-purpose, malformed, or revoked credentials | Access denied; no sensitive data or unauthorized effect; valid credentials still work. |
| Object authorization | User A uses user B's identifier; a lower role calls an administrative action | Protected data is neither disclosed nor modified; allowed operations still succeed. |
| Tenant isolation | Cross-tenant read/write/list/export/cache/subscription | No cross-tenant data, counts, updates, or cached responses leak. |
| Mass assignment | Add role, owner, tenant, balance, or entitlement fields | Forbidden fields cannot change even when the request is otherwise valid. |
| Recovery | Reuse or race a reset token; change its account or purpose | At most one valid consumption; no takeover through account confusion. |
| CSRF | Invalid/missing token or untrusted origin on an ambient-credential mutation | No mutation; legitimate browser and intended integration flows remain usable. |
| Injection | Harmless metacharacters and structured operator inputs reach relevant boundaries | Data remains data; no extra query/command effects or broadened access. |
| XSS | Stored/reflected/DOM test strings in actual rendering contexts | Text or sanctioned markup renders without execution; required formatting remains usable. |
| SSRF | A controlled redirect or resolver fixture points at a prohibited destination | Request is blocked before connection; a permitted destination still works. |
| Files | Spoofed MIME, traversal filename, oversized stream, bounded archive expansion case | No storage escape, executable serving, excessive resource use, or unauthorized retrieval. |
| Webhooks/payments | Invalid signature, duplicate delivery, different payload under reused key, reordered events | No unauthorized or duplicated fulfillment; durable state remains consistent. |
| Business races | Two requests compete for a single redemption or bounded balance | Invariant holds in the database, not merely in response counts. |
| Resource controls | Burst by one principal and bounded distributed/parallel requests | Intended policy holds; valid unrelated users remain usable; limits recover as designed. |
| Exceptional conditions | Identity/policy store timeout, malformed upstream result, failed write/queue handoff | No privilege grant, lost accounted work, unsafe partial commit, or unbounded retry. |
| AI tools/RAG | A document/tool result asks to bypass policy or read another tenant's data | Unauthorized tool execution and data disclosure are denied outside the model. |
| CI/build | Untrusted changes attempt to affect a privileged job or promoted artifact | Trust and credential boundaries remain intact without exposing real secrets. |
| Model/data loading | Unapproved format/revision, unsafe deserialization path, oversized tensor/record | Invalid input is rejected at the correct boundary; investigation does not execute hostile artifacts on the host. |
| Model behavior | Threat-specific evasion/poisoning/privacy cases under a recorded attack budget | Clean and adversarial outcomes are measured with artifact/data versions, scope, and uncertainty. |
| Registry/training | Lower-trust job/user attempts artifact replacement or promotion | Only authorized producers/reviewers can publish the intended model/data revision. |
| Mobile/desktop IPC | Untrusted app, renderer, deep link, or message invokes a privileged operation | Caller and arguments are checked; no unauthorized host effect; allowed interaction works. |
| CLI/library | Hostile filenames/options/configuration or invalid API call sequences | No unintended privilege, execution, file escape, or corrupted state; documented valid use works. |
| Native code | Bounded malformed inputs and concurrent lifecycle operations | Relevant sanitizer/fuzz/property outcomes are recorded, with coverage and untested paths. |
| Queues/pipelines | Replayed/reordered records, cross-tenant outputs, interrupted job | Durable state and output authorization remain correct after retries/restarts. |
| Device/firmware | Unauthorized or interrupted update on an approved rig | Authenticity and recovery policy hold; physical-device limits are explicitly documented. |
| OT/robotics | Controlled loss, replay, or alteration of inputs in simulation/approved rig | Designed safe behavior holds within the tested environment, without unauthorized real actuation. |
| Smart contracts | Repeated/reordered transactions, untrusted calls, invalid signatures, adversarial economic states | Specified access and economic invariants hold in local tests; deployed-state assumptions remain explicit. |

For timing, rate limiting, retries, and races, use deterministic clocks or controlled synchronization when possible. Do not launch hundreds of live requests simply to match an arbitrary example threshold. For denial-of-service concerns, prefer bounded tests and complexity/resource analysis over uncontrolled load.

## Cross-component verification

Test at least the meaningful boundaries represented by the architecture, not an arbitrary number of example attacks. Trace a lower-trust origin through all dependent components until its privileged effect. Examples include a package install reaching build credentials, a dataset import reaching a training worker, a mobile request reaching a tenant-specific cache, an extension message reaching an OS helper, and a model command reaching an actuator.

Link these tests to the affected component/control IDs. Isolated component tests do not prove the composition is secure. Observe the real protected side effect where safely possible; otherwise distinguish a simulation or mocked boundary from runtime evidence still required.

## Candidate validation

For each candidate, answer:

1. What exact input or capability does the attacker control?
2. Which route/caller makes the path reachable in the examined context?
3. What control exists, and why does it fail or get bypassed?
4. Which security invariant is violated, and what concrete effect follows?
5. What preconditions, privileges, configuration, or timing are necessary?
6. What evidence could disprove the claim? Inspect that possibility before reporting it as confirmed.

A complete static proof can establish a finding without executing an exploit; mark the proof method. An unsafe-looking snippet with unknown callers should remain conditional. If reproduction would be destructive or unauthorized, stop before that action and provide the safe evidence already available.

Group findings by root cause when that produces one coherent fix. Preserve locations and materially different impacts. Never inflate counts by reporting one issue once per route. Separate new vulnerabilities, pre-existing vulnerabilities, and improvements requested by policy.

## Severity, priority, and confidence

Use the project's severity policy. If none exists, make an explained judgment using impact, attacker access, reliability, scope, affected data, and compensating controls:

- **Critical:** a realistically exploitable path to systemic compromise or catastrophic impact.
- **High:** substantial unauthorized access, privilege, sensitive-data compromise, or meaningful financial/integrity damage.
- **Medium:** material but more constrained impact or significant prerequisites.
- **Low:** limited impact under narrow conditions.
- **Informational/hardening:** an improvement without a demonstrated vulnerability; keep separate from confirmed defects.

These examples are qualitative, not a substitute for assessment. Do not label every missing header High or every unverified dependency alert Critical. Confidence describes evidence, not impact. Urgent suspected problems should trigger focused verification and conservative release advice where justified, without relabeling them confirmed.

Use [CVSS 4.0](https://www.first.org/cvss/v4.0/specification-document) only with sufficient inputs and a reproducible vector. Combine technical severity with exposure and business context. [CISA KEV](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) is evidence of known exploitation for listed vulnerabilities. [FIRST EPSS](https://www.first.org/epss/) estimates exploitation probability for known CVEs; it does not score custom logic defects. Record lookup dates and unavailable data; neither list is an allowlist of safe software.

## Finding template

Use the fields needed for a reviewer to act. The following is a template, not a finding about the user's project:

```text
ID and title:
Evidence class: confirmed | suspected | hardening
Severity and rationale:
Confidence and evidence method:
State: open | fixed-and-verified | mitigated | accepted | false-positive
Affected revision, component, and file/line or configuration:
Attacker control and prerequisites:
Source -> boundary/control -> sensitive operation:
Root cause and violated invariant:
Observed behavior and impact:
Reproduction or static proof (redacted, bounded):
Recommended or implemented fix:
Verification performed and results:
Residual risk / checks still needed:
Verified CWE / advisory / standard reference, when useful:
Owner and target date, if assigned by the project:
```

Use line numbers that exist at the reviewed revision. Include minimal relevant code, not whole sensitive files. CWE mappings should describe the root cause; omit uncertain mappings. A CVE must refer to an actual published advisory. Scope ASVS identifiers to their exact version.

## Coverage and execution record

For a broad review, include a compact table:

```text
Surface/control | Evidence inspected | Method | Result | Gap or exclusion reason
```

Use distinct results: `verified`, `finding`, `partial`, `not assessed`, and `not applicable`. Record limitations such as unavailable production state, missing credentials, scanner exclusions, or database policy tests not run, including their effect on coverage. Generated content and languages unsupported by a scanner still require a documented assessment method or an explicit gap. "Not applicable" needs a reason grounded in the system.

Preserve the orchestration ledger's more detailed inspection and test statuses when needed. A scanner-unsupported language still needs another method or an explicit unassessed gap; the tool's coverage is not the audit's scope. Add model/data digests, binary/build variants, device revisions, runtime identities, and real-versus-simulated conditions when those determine the result. Distinguish inaccessible artifacts from inspected ones.

For each important check, record the target revision/environment, command or manual method, tool/rules version if available, completed status, meaningful output, and evidence location. A report with zero alerts is only meaningful alongside its coverage and successful execution.

## Remediation and release decision

Close a finding only after reviewing the fix and relevant evidence. Distinguish a temporary mitigation from removal of the root cause. Recheck sibling paths and important valid behavior. Confirm whether the fix requires deployment, migration, secret rotation, session invalidation, or cache cleanup before it is effective.

Use the existing release policy. If no policy exists, recommend withholding release for confirmed unresolved Critical/High issues affecting the release or essential changed controls lacking verification. For accepted risk, record the actual authorized owner, rationale, compensating controls, scope, expiry, and follow-up. Do not invent an owner, silently approve an exception, or claim a local patch is deployed.

For other gaps, give a proportionate recommendation rather than treating all missing evidence as equally severe. State whether the assessment is ready within the reviewed scope, requires conditions, is blocked by specified issues, or lacks enough evidence for a recommendation.

Conclude with remaining risk and required next actions. Zero findings, passing tests, a clean dependency scan, or an AI-generated review does not establish complete security.
