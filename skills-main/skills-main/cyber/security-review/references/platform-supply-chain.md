# Platform and software supply chain

Read the relevant sections for deployed services, infrastructure, builds, dependencies, secrets, cryptography, and operations. Search terms: SCA, SBOM, provenance, OIDC, CI/CD, IAM, KMS, TLS, container, logging, fail closed.

## Secrets and workload identity

Inventory credential locations and consumers without printing values. Examine source, history within scope, generated bundles, images/layers, CI artifacts, logs, local examples, and backups. Distinguish deliberately public client identifiers from credentials that convey privilege.

Prefer short-lived workload credentials and a managed secret store where appropriate. Environment injection can be acceptable, but environment variables are not automatically confidential: build substitution, crash reports, process access, diagnostics, and child processes can expose them. Public browser build prefixes must never contain privileged secrets.

Scope secrets by service and environment. Avoid default production credentials. Plan issuance, access auditing, expiry, revocation, and rotation. If a real credential has been exposed, recommend prompt revocation/rotation and investigation of exposure; repository cleanup follows containment. Do not use a discovered secret to test whether it is active without authorization.

Source: [OWASP secrets management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

## Cryptography and transport

Choose maintained high-level cryptographic libraries and platform key services. Review what confidentiality, integrity, authenticity, and replay protection are actually required; encryption at rest does not correct an authorization flaw.

For new symmetric encryption, prefer authenticated encryption with library-managed safe nonce handling. Never reuse a nonce under a key when the chosen construction requires uniqueness. Keep keys separate from ciphertext, limit use, and plan versioned rotation and recovery. Generate keys and security tokens with a cryptographic random generator. Use supported constant-time verification APIs for secret comparisons.

Validate TLS certificates and hostnames; inspect internal service connections as well as public ingress. Do not disable verification to solve a deployment problem. Use a currently supported TLS policy appropriate to client compatibility. Apply HSTS only after confirming HTTPS readiness; subdomain inclusion and preload require assessing the affected domains.

Source: [OWASP cryptographic storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html). Consult the deployed TLS stack's current documentation before choosing exact settings.

## Dependencies and vulnerability triage

Inspect the resolved dependency graph, runtime and development dependencies, transitive packages, base images, build tools, plugins, and unsupported runtimes. A development dependency may execute in a privileged build and therefore still matter. Prefer supported releases and verified package identities; investigate typosquatting, dependency confusion, unexpected registries, lifecycle scripts, and unmaintained components.

For each advisory, establish ecosystem, exact installed version, affected range, fix availability, relevant call path, deployment context, and mitigations. Distinguish "affected package present" from "exploitability demonstrated" and "not reachable in the examined configuration." Document assumptions; lack of a discovered call path is not universal proof of non-exploitability.

Use lockfiles or ecosystem-appropriate dependency locking and integrity checks for reproducibility. Verify that the deployed artifact corresponds to reviewed inputs. Scan the delivered image/artifact where source-only analysis misses bundled components. Treat an SBOM as an inventory, not a security certificate.

Read-only inventory and advisory checks should precede changes. `npm audit` sends dependency information to a registry; it is not purely local. `npm audit fix` invokes installation and mutates dependencies. Do not run broad automatic or forced upgrades as a substitute for triage. Apply targeted updates, inspect the resulting dependency/lockfile changes, and test the affected behavior.

Sources: [npm audit behavior](https://docs.npmjs.com/cli/v11/commands/npm-audit/), [NIST SSDF publication status](https://csrc.nist.gov/projects/ssdf/publications).

## CI/CD and release integrity

Inspect triggers, identity, permissions, execution inputs, artifacts, caches, and promotion paths. Untrusted pull-request code must not run with production secrets or privileged repository/cloud tokens. Pay particular attention to `pull_request_target`, `workflow_run`, artifact downloads, and reuse of self-hosted runners.

Keep job token permissions minimal. Pin third-party actions to verified immutable commit identifiers and maintain an update process. Pass untrusted event data through safe data channels rather than interpolating it into executable scripts. Scope cloud OIDC trust to the intended repository, workflow/ref or environment, and audience; short-lived tokens still require correct authorization.

Protect release branches and deployment environments according to the repository's policy. Separate build and deployment powers, validate artifact origins, and prevent untrusted cache/artifact promotion. Prefer isolated runners for untrusted workloads.

Source: [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use).

Verify signatures and attestations against expected identities, source revisions, builder identity, and policy. A valid signature from an unexpected identity does not authorize a release. Provenance can show how an artifact was built; it does not establish that its source code is vulnerability-free. Select supply-chain assurance proportional to the project.

Source: [SLSA 1.2](https://slsa.dev/spec/v1.2/).

## Cloud, containers, and infrastructure as code

Review effective permissions, public exposure, storage policies, service accounts, security groups, ingress/egress, and production configuration. Trace who can assume a privileged role or mint credentials. Public storage may be intentional; confirm classification and access requirements before declaring exposure a vulnerability.

For containers, reduce privileges, unnecessary capabilities, writable paths, root execution, host mounts, and daemon socket access. Use minimal maintained images, explicit resource limits, and appropriate syscall isolation. Ensure secrets do not remain in build layers. Scan operating-system packages as well as application dependencies.

For Kubernetes, check RBAC, namespace/tenant assumptions, workload identity, admission controls, pod security, and network isolation. NetworkPolicy only helps if the cluster's networking implementation actually enforces it. Avoid treating a container or namespace alone as a complete security boundary for hostile code.

Compare infrastructure definitions with deployed state when access exists. If it does not, report runtime drift as unverified rather than assuming the repository reflects production. Validate backup access, encryption, recovery procedures, and deletion behavior as relevant to the assets.

Source: [Kubernetes application security checklist](https://kubernetes.io/docs/concepts/security/application-security-checklist/).

## Logging, detection, and response

Record security-relevant outcomes such as authentication failures, permission changes, administrative actions, suspicious denials, and integrity failures. Use structured events with correlation and necessary actor/resource identifiers. Minimize personal data; an email address or internal user identifier is not automatically harmless.

Redact credentials, session tokens, authorization headers, secret-bearing URLs, sensitive payloads, and raw exception objects before they reach any log/trace sink. Sanitize event delimiters and limit size. Protect log access, transport, retention, and integrity; test whether useful signals trigger actionable alerts.

Check how logging failures affect the application. Avoid secret leakage through fallback logging or an unbounded retry loop. Require an explicit policy for operations whose accountability is essential. Document response ownership and relevant containment procedures when the task includes operational readiness.

Source: [OWASP logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

## Secure lifecycle and exceptional conditions

Tie security requirements to architecture decisions, reviews, tests, dependency maintenance, and vulnerability response. Record ownership and expiry for accepted exceptions. Investigate recurring defects for a shared root cause rather than repeatedly patching symptoms.

Exercise timeouts, cancellation, expired credentials, inconsistent caches, malformed upstream responses, resource exhaustion, and partial writes on important paths. Verify rollback, bounded retries, idempotency, and recovery without relaxing identity or integrity checks. Choose safe degradation explicitly; indiscriminately terminating the whole application can create unnecessary availability risk.

Sources: [NIST SSDF](https://csrc.nist.gov/projects/ssdf/publications), [OWASP Top 10:2025](https://top10.owasp.org/2025/).
