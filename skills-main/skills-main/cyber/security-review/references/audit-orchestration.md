# Audit orchestration and coverage

Mandatory for a full-project audit. Purpose: make coverage explicit across any technology, including mixed or unfamiliar systems. Prioritize high-impact paths first, then continue through the full applicable inventory. No technology list can be exhaustive; extend the inventory and checks when discovery reveals another component.

## 1. Discover the real project

Identify the provided root(s), workspaces, subprojects, submodules, build definitions, platform manifests, dependency graphs, tests, and deployable artifacts. Include relevant hidden configuration and untracked project files; a Git diff or one package manifest is not a project inventory. Do not scan unrelated personal directories or retrieve external repositories without task scope.

Use metadata-first file discovery, then inspect content safely. Classify sources, configurations, assets that are parsed or executable, schemas, generated/vendored code, scripts, notebooks, datasets, model files, binaries, firmware images, containers, and release bundles. Keep secrets and sensitive datasets out of unrestricted output. Do not load models or run notebooks for inventory.

Do not blanket-exclude generated, vendored, test, or binary content. Record why and how each category is assessed. Examples: generated client code through its generator plus released output; dependencies through resolved inventory, advisories, provenance, and risky integration code; test scripts through the privileges with which they execute. Record missing LFS objects, absent submodules, inaccessible directories, remote model revisions, and unavailable production configuration as gaps. Avoid following symlinks outside the authorized roots silently.

A useful component ledger is:

```text
Component ID | Paths/artifacts | Type and versions | Runtime/platform
Entry points | Assets and privileges | Dependencies and peers
Applicable profiles | Available environments | Review/test status | Gaps
```

Maintain a path/artifact manifest mapped to components and assessment methods. Every discovered file or clearly defined group needs a disposition: inspected directly, assessed through a documented equivalent method, non-applicable with a reason, or pending/blocked. Group repetitive assets or generated output only when the group boundaries and evidence are explicit; a directory name or extension is not evidence of safety. Reconcile new files and unresolved groups before closing coverage.

Inventory is a discovery record, not a claim that every file has been security-reviewed. Sampling, scanner exclusions, and representative build variants must be explicit. Report sampled or representative evidence as such; do not imply an exhaustive review of uninspected members. Do not report a file-count percentage as a percentage of security proven.

## 2. Map lifecycle and trust

Trace development/import -> build/train -> package/register -> distribute/deploy -> execute/serve -> update/retrain -> recover/retire. Evaluate stages that exist even if a project is offline or not deployed yet. A library has publishing and consumer trust boundaries; a model has ingestion, training, loading, and distribution boundaries; a device has manufacture/provisioning, update, and decommissioning boundaries.

Map who can submit data, code, packages, weights, configurations, commands, or physical inputs; who approves changes; and which authority each stage uses. Include local attackers, malicious files/models, compromised CI contributors, tenants, suppliers, peers, and device operators when relevant. Connect component graphs to identity, data, secrets, release integrity, availability, and physical effects.

Write verifiable invariants and abuse cases before tests. Do not confuse an intended permission with a vulnerability. For example, a tool intentionally running a user's own script differs from a privileged service running an attacker's script as another user.

## 3. Apply a universal baseline to every component

The baseline is technology-neutral; choose controls according to the actual boundary.

| Control family | Questions to answer |
| --- | --- |
| Authority and isolation | Who may cause this action, on whose resources, under which OS/service/model/device authority? Can one tenant, process, plugin, device, or pipeline escape its boundary? |
| Input and execution | What is parsed, deserialized, evaluated, compiled, imported, rendered, or executed? Can structure, paths, options, metadata, or transformations change meaning? |
| Data and secrets | Where is sensitive material created, read, retained, copied, transmitted, logged, cached, backed up, deleted, or embedded? |
| Integrity and provenance | Are code, packages, firmware, datasets, checkpoints, configuration, updates, and results attributable to the expected producer and revision? |
| State and concurrency | Can replay, reordering, retries, stale state, partial failure, or races violate ownership, balances, workflow, or correctness needed for security? |
| Resources and availability | Are memory, CPU/GPU, storage, threads, network, battery, external spend, retries, and queues bounded? Can one actor starve others? |
| Cryptography and identity | Are protocols, key use, certificate validation, randomness, nonce handling, recovery, and revocation appropriate? |
| Supply chain and privileges | What executes during build/train/install/update? Which maintainers, dependencies, jobs, and artifacts can cross privilege boundaries? |
| Observability and response | Can meaningful abuse be detected without leaking secrets? Can the component be safely contained, recovered, updated, or retired? |
| Security-relevant correctness | Can numerical errors, malformed state, unsafe defaults, or broken business/physical constraints create a security impact? |

## 4. Expand into domain profiles

Select every applicable reference from the entrypoint; profiles overlap. A mobile ML application may need mobile, model loading, backend, data, and release reviews. A firmware repository may include a web management UI, native parser, cloud fleet service, and signing pipeline. A library may have no network listener but still parse hostile data in its consumers.

For a technology without a supplied profile:

1. Identify its execution model, privilege boundaries, serialization formats, exposed interfaces, lifecycle, and failure modes from the project.
2. Read the maintainer's current security guidance, advisories, and applicable domain standard. Identify version-specific requirements and unknown assumptions.
3. Translate the universal baseline into concrete controls and adversarial tests for that component.
4. Add them to the same ledger with evidence requirements. Select supported tools or manual methods; do not invent tool capabilities.
5. Record specialist or hardware limitations and continue the work possible now. Do not mark the component non-applicable because expertise or tooling is unavailable.

## 5. Build the coverage and test plan

Create one row per meaningful control or invariant, grouped by component. Stable IDs allow findings and results to refer to the same rows.

```text
Control ID | Component/boundary | Requirement/invariant | Applicability + reason
Inspection method | Planned test and expected observation | Required environment
Actual evidence | Inspection status | Test status | Finding IDs | Remaining gap
```

Applicability states: `applicable`, `not applicable with reason`, `unknown pending discovery`.
Inspection/test states: `planned`, `verified`, `finding`, `partial`, `blocked`, `not executed`, or `not required with rationale`.

Do not collapse "not executed" into "verified." A static proof may suffice for a specific invariant, but document why runtime testing adds no required evidence. A deployed permission or physical behavior generally cannot be proven solely by an unrelated unit mock. Unknown applicability is work to resolve, not an exclusion.

Include checks of the existing build/test process, security-specific negative and positive tests, dependency and secret analysis, configuration, delivered artifacts, and runtime boundaries. Select formats and tools per ecosystem rather than assuming every project has HTTP endpoints, npm, or Linux.

## 6. Execute in passes and reconcile findings

1. Establish a reproducible baseline: revisions, resolved versions, target environment, available tools, and existing check results. Inspect unfamiliar commands before execution.
2. Review design and security-sensitive implementations, then finish the remaining applicable surfaces. Use source-to-sink analysis and component-specific artifact inspection.
3. Run supported analyses and planned bounded tests. Capture failures, exclusions, authentication coverage, and environment mismatch. Reproduce suspected issues safely where useful.
4. Examine interactions and alternate paths. Test lifecycle transitions and exception paths, not only steady-state happy paths.
5. For requested fixes, correct root causes, add meaningful regression coverage, and retest affected controls and allowed use.
6. Reconcile inventory, coverage, tests, and findings. Newly discovered components or paths must receive rows; unresolved rows remain visible.

Do not let a long initial findings list end the audit prematurely. Preserve progress in a compact local audit record when the task spans multiple passes or context windows. Continue independent work while a missing external resource blocks another check. Report a genuine blocker with the concrete evidence already collected and exactly what is needed.

Resolve ordinary environment/setup failures and use compatible available alternatives before declaring a required check blocked. Do not abandon a component because a preferred scanner is missing. Keep any authorized tool setup isolated where practical, inspect its execution and network effects, and avoid changing application dependencies merely to run an audit. Record the remaining capability gap when no suitable method is available.

Bind evidence to the assessed revision and artifact/environment identity. After a fix, dependency change, regenerated artifact, retraining, or configuration change, rerun the affected checks and revisit impacted boundaries. Earlier evidence can remain relevant to unchanged inputs, but do not present it as verification of newly changed behavior.

## 7. Stop on evidence-based completion

Before delivering the final full-audit report, check:

- Every component and lifecycle stage found during discovery has a disposition, including build, data/model, infrastructure, and distribution artifacts.
- All applicable control families and cross-component boundaries have review evidence; every required test was executed or carries an explicit unresolved gap.
- Tool results were validated, significant false positives resolved or labeled, and related symptoms grouped by root cause.
- Fixes are distinguished from deployment/rotation/retraining still needed, and regression outcomes are recorded accurately.
- Remaining unassessed work is prominent enough to prevent a reader mistaking partial verification for completion.

Report three independent conclusions: **audit work performed**, **coverage achieved and gaps**, and **security readiness**. An audit can finish with serious findings. Required unavailable hardware or runtime evidence may leave verification partial even after all feasible work is done. Do not repeatedly rerun identical checks without a changed input or unresolved reason.

Use [NIST SSDF](https://csrc.nist.gov/projects/ssdf/publications) for lifecycle framing and [OWASP SCVS](https://scvs.owasp.org/) for component assurance. These do not replace domain-specific controls or establish a universal certification.
