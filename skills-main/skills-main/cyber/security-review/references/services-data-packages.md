# Services, data systems, and packages

Use for libraries/SDKs, packages, daemons, distributed systems, workers, databases, data pipelines, notebooks, automations, games/mods, and scientific/HPC software. These systems may have no browser interface. Combine this guidance with the platform/supply-chain profile and relevant native, model, device, or application profiles.

## Libraries, frameworks, SDKs, and reusable packages

Identify public APIs, expected caller trust, supported runtimes, optional features, FFI, parsers, plugins, serialization, and installation/build hooks. A library's attack surface is often the data its consumers pass in. Document misuse-resistant defaults and security contracts: validation obligations, object ownership, thread safety, credential handling, and what the library does not enforce.

Inspect wrapper and binding behavior, error propagation, unsafe fallback, implicit execution, temporary files, and exposure of secrets in exceptions or debug representations. Distinguish an intentional low-level capability from an unsafe default that crosses the consumer's documented boundary. Review transitive runtime and build-time dependencies as well as shipped binaries.

Test public APIs through representative consumer fixtures and the built/distributed package where possible. Include malformed input, invalid sequences, concurrent use, cancellation, supported build flags/platforms, and secure-default behavior. Inspect package contents for accidental credentials, private source/data, vulnerable bundled components, and install-time execution. Verify the supported version/build matrix without pretending one host covers every architecture.

Reference: [OWASP SCVS](https://scvs.owasp.org/). Component assurance supplements, rather than replaces, behavioral review of the public API.

## Network services, protocols, and distributed systems

Inventory every listener and administrative/control-plane interface, not only HTTP: TCP/UDP, RPC, message brokers, sockets, peer discovery, service meshes, and custom binary protocols. Review peer authentication, authorization, identity forwarding, encryption, certificate lifecycle, and what an authenticated peer is actually allowed to request. Internal networks and localhost are not identity proofs.

Inspect framing, length fields, parser state, protocol negotiation/downgrade, canonicalization, compression, retransmission, timeouts, ordering, replay protection, concurrency, and resource limits. Determine whether authentication happens before expensive or sensitive work. Use bounded protocol fuzzing or replay against test instances where suitable.

For queues/events, review producer/consumer/topic privileges, schema contracts, tenant context, dead-letter paths, delayed execution, retries, and deduplication. Verify authorization at the appropriate time and do not assume an event's self-declared actor is authentic. Message delivery guarantees do not by themselves make external business effects exactly-once.

For stateful distributed workflows, examine failover, stale replicas/caches, clock assumptions, partitions, locks/leases, and recovery. Test the invariant under controlled duplicate/reordered events and failures; observe durable state and downstream effects. Protect operational control planes separately from data traffic.

## Databases, object stores, and data platforms

Review service identities, roles/grants, row/column/object policies where used, ownership, administrative functions, query construction, encryption/key access, network exposure, and credential rotation. Inspect migrations and schema changes for altered privileges or temporarily exposed data. Verify that tooling and jobs use the intended roles rather than bypassing policy through administrator accounts.

Include replicas, snapshots, exports, backups, analytics copies, caches, and temporary staging locations. Review restore access, integrity, retention/deletion, recovery testing, and the persistence of revoked access across copies. Public datasets or storage may be intentional; establish classification before calling exposure a defect.

Tests should use least-privileged identities for read/write/list/export and verify protected contents and side effects. Test migrations and restore behavior only in appropriate disposable environments. Absence of production access means production grants and drift remain unverified.

## ETL, batch, streaming, notebooks, and automation

Trace source -> ingestion -> transformation -> intermediate storage -> output/consumer, including scheduling, secrets, job identities, and failure handling. Review schemas, encodings, dynamic queries, file/URL/path inputs, archive parsing, executable transforms, and authorization propagation. Bound batch sizes, partition counts, decompression, memory, checkpoint growth, retries, and output volume.

Check whether joins, aggregates, dashboards, or exports reveal restricted data even when individual sources were authorized. Assess accidental data mixing across tenants and whether deletion or access changes propagate to derived datasets. Notebook outputs, checkpoint folders, shared experiment stores, and attached credentials are part of the surface.

Inspect notebook cells and scheduler actions before execution. Determine whether a job triggered by a low-trust file, repository event, or user can execute under a more privileged account. Test malformed records, late/duplicate events, interrupted processing, unauthorized sources/sinks, and restart consistency using synthetic data.

For distributed engines, verify job submission and cluster administration boundaries from current engine documentation. Access to submit arbitrary jobs is often equivalent to executing code with worker privileges; a network label is not adequate isolation. Reference example: [Apache Spark security](https://spark.apache.org/security.html).

## Games, simulation, scientific computing, and HPC

For games, examine client/server authority, identity, matchmaking/session secrets, inventory/economy transactions, replay and command validation, asset/level parsers, chat/content, mods, anti-abuse limits, and update channels. A client-side check cannot establish authoritative balances or permissions. Review mods/scripts as host capabilities and isolate untrusted content according to the engine's actual model.

For scientific/HPC software, inspect notebooks/scripts, native extensions, cluster job submission, credentials, shared filesystems, result integrity, reproducibility, and resource limits. User-provided experiment definitions or simulations can execute code; establish whose privilege is used. Numerical overflow, invalid states, or corrupted results are security findings when they violate an identified integrity, confidentiality, availability, or physical-safety invariant; do not relabel every numerical accuracy issue a vulnerability.

Use representative workload fixtures and actual application invariants. Avoid assuming that commercial web threat categories exhaust these domains. Research the specific engine, scheduler, protocol, or scientific format when its behavior determines a security conclusion.

## Build-only, infrastructure-only, and configuration-only projects

Treat templates, CI actions, operators, charts, provisioning modules, and policy repositories as products whose output can create privileges or exposure. Inspect parameter injection, default grants, generated configuration, secret propagation, identity assumptions, update paths, and resulting deployment state where available. Unit checks of templates alone do not prove effective runtime policies. Apply [Platform and software supply chain](platform-supply-chain.md).

## Domain verification matrix

| Surface | Select meaningful evidence |
| --- | --- |
| Library/SDK | Public API contract review; consumer integration; parser/FFI/fuzz tests; safe defaults; built package contents. |
| Daemon/protocol | Actual listeners and identities; unauthorized/malformed peer input; state-machine and bounded resource tests. |
| Queue/worker | Producer/consumer permissions; actor/tenant propagation; replay/reorder/retry and durable effects. |
| Database/storage | Least-privilege operations; policy semantics; migrations; copies/exports; recovery and effective deployed grants. |
| Pipeline/notebook | Ingestion and execution trust; data lineage/isolation; restart, malformed data, and authorized output. |
| Game/mod/simulation | Authority boundaries; hostile content; replay/economy invariants; constrained host capabilities. |
| Scientific/HPC | Job/worker privilege; data/result integrity; native code and resource controls; relevant reproducibility. |
| Infrastructure module | Rendered configurations, identity/policy tests, secret flow, and comparison with deployed state. |

When the observed project does not fit these examples, use the new-domain procedure in [Audit orchestration](audit-orchestration.md). There is no "unsupported, therefore safe" outcome.
