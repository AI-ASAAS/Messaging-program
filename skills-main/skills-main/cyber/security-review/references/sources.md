# Sources and currency

Research review date: **2026-09-27**. This is a record of sources consulted for the skill, not a claim that every linked document is frozen or that future projects have been audited.

## How to use sources

- Prefer the installed framework/library's official security documentation and the maintainer's advisory for version-specific behavior. Verify exact package identity and affected ranges before recommending a fix.
- Use stable published standards as the baseline. Distinguish final standards, drafts, living guidance, vendor documentation, and advisory feeds. Recheck changes relevant to the task.
- Date advisory lookups. If browsing or an advisory database is unavailable, state that limitation rather than claiming the dependency set is currently clean.
- Cite exact ASVS versions when using requirement identifiers; do not invent mappings from memory. ASVS levels require evidence for all applicable requirements, not a checklist score.
- An official source may contain examples that need adaptation. Verify API availability, assumptions, and production suitability; do not copy an example merely because it is published.
- These instructions synthesize selected practices in original wording. They do not reproduce or replace the complete standards. Formal assurance and compliance need separate scope and evidence.

## Standards and prioritization

| Source | Edition/status at review | Use |
| --- | --- | --- |
| [OWASP ASVS](https://github.com/OWASP/ASVS) | Stable 5.0.0; development branch changes independently | Web application verification requirements and versioned mappings. |
| [OWASP Top 10](https://top10.owasp.org/2025/) | 2025 release | Risk coverage, including supply-chain failures and exceptional conditions. |
| [OWASP API Security Top 10](https://api-security.owasp.org/editions/2023/en/0x11-t10/) | 2023 edition consulted | Object/function/property authorization, consumption, business flows, inventory, integrations. |
| [NIST SSDF publications](https://csrc.nist.gov/projects/ssdf/publications) | 1.1 final; 1.2 listed as draft | Development lifecycle and vulnerability response. Do not label 1.2 final. |
| [NIST SP 800-63B-4 authenticators](https://pages.nist.gov/800-63-4/sp800-63b/authenticators/) | Revision 4 | Password and authenticator requirements in their applicable assurance context. |
| [RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html) | OAuth security BCP, January 2025 | Modern OAuth threat mitigations and client/flow distinctions. |
| [RFC 8725](https://www.rfc-editor.org/rfc/rfc8725.html) | JWT BCP, February 2020 | Algorithm, key, issuer, audience, and token-confusion defenses. |
| [FIRST CVSS](https://www.first.org/cvss/v4.0/specification-document) | Version 4.0 specification | Technical severity with a reproducible vector; not business risk alone. |
| [FIRST EPSS](https://www.first.org/epss/) | Living model/data | Exploitation likelihood input for known CVEs. |
| [CISA KEV](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) | Living catalog | Known exploitation as a prioritization signal. The unfiltered page did not load during this research; CISA's indexed filtered catalog pages confirmed the catalog's purpose. No project-specific KEV lookup was performed. |

## OWASP implementation guidance

These are living cheat sheets, not individually version-pinned standards. Read the relevant current sections when implementation details matter.

| Source | Decision supported |
| --- | --- |
| [Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) | Account lifecycle, verification, and authentication defenses. |
| [Password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) | Adaptive hashing and parameter selection. |
| [Session management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) | Cookie/session scope, rotation, and lifecycle. |
| [Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) | Per-request, object, and context-sensitive authorization. |
| [Input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) | Boundary validation and its limitations. |
| [SQL injection prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) | Binding values and constraining dynamic query structure. |
| [OS command injection defense](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html) | Avoiding shells and accounting for argument injection. |
| [XSS prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) | Contextual output handling and framework escape hatches. |
| [CSP](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html) | Script trust through nonces/hashes and policy enforcement. |
| [CSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) | Session-bound tokens, browser context, and cookie limitations. |
| [SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html) | Destination, DNS, redirect, and network-boundary controls. |
| [File uploads](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) | Server-side content checks, isolation, and resource limits. |
| [Secrets management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) | Secret lifecycle, distribution, and exposure handling. |
| [Cryptographic storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html) | Maintained cryptography and key-management decisions. |
| [Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) | Security events, sensitive-data exclusion, integrity, and access. |
| [Business logic](https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html) | Workflow invariants, atomic operations, and abuse cases. |
| [AI agent security](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html) | Tool authority, memory, indirect input, and bounded execution. |
| [LLM risk list](https://genai.owasp.org/llm-top-10/) | 2025 risk list consulted for model application coverage. |
| [MASVS](https://mas.owasp.org/MASVS/) | Mobile-specific verification coverage; choose the actual testing profile separately. |

## Official platform and protocol guidance

| Source | Decision supported |
| --- | --- |
| [Next.js data security](https://nextjs.org/docs/app/guides/data-security) | Server/client boundaries, actions, authorization, and data exposure. |
| [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) | Policies, client roles, implicit checks, and meaningful policy tests. |
| [PostgreSQL 18 row security](https://www.postgresql.org/docs/18/ddl-rowsecurity.html) | RLS semantics and bypass roles; use matching docs for a different deployed major. |
| [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use) | Untrusted workflows, immutable action references, and workload permissions. |
| [SLSA 1.2](https://slsa.dev/spec/v1.2/) | Approved specification for supply-chain assurance and provenance. |
| [Kubernetes application security](https://kubernetes.io/docs/concepts/security/application-security-checklist/) | Workload privilege, resource, and network-control checks. |
| [npm audit v11](https://docs.npmjs.com/cli/v11/commands/npm-audit/) | Registry data submission and installation effects of audit fixes; inspect the installed CLI's version. |
| [Stripe webhooks](https://docs.stripe.com/webhooks) | Signature bytes, duplicate delivery, asynchronous handling, and event ordering. |
| [Solana core concepts](https://solana.com/docs/core) | Account, instruction, message, and transaction model. |
| [Solana partial signing](https://solana.com/docs/core/transactions/partial-signing) | Signature binding to exact transaction bytes. |
| [Sign In With Solana reference](https://github.com/phantom/sign-in-with-solana) | Wallet sign-in message fields and domain/challenge context. |
| [MCP security best practices](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/docs/2026-07-28/tutorials/security/security_best_practices.mdx) | 2026-07-28 documentation consulted for token audience, delegation, and client-specific consent. Match requirements to the implementation's negotiated protocol. |
| [Clang AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html) | Runtime memory-error detection with execution-coverage limitations. |
| [Clang UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html) | Runtime checks for selected undefined behavior. |

## Additional primary sources for universal project coverage

These expand the audit beyond web applications. They are selected by actual component type; none is a universal checklist or a claim of certification.

| Source | Scope and status at review |
| --- | --- |
| [NIST AI 100-2e2025](https://www.nist.gov/publications/adversarial-machine-learning-taxonomy-and-terminology-attacks-and-mitigations-0) | Adversarial ML taxonomy covering different learning methods, attacker capabilities, poisoning/evasion/privacy concerns. Published March 2025. |
| [NIST SP 800-218A](https://csrc.nist.gov/pubs/sp/800/218/a/final) | Final July 2024 AI model-development profile of SSDF. |
| [PyTorch security policy](https://github.com/pytorch/pytorch/security/policy) | Untrusted model execution, runtime and distributed-operation trust boundaries; living project guidance. |
| [TensorFlow security policy](https://github.com/tensorflow/tensorflow/blob/master/SECURITY.md) | Execution of model graphs and process isolation; living project guidance. |
| [Transformers security](https://github.com/huggingface/transformers/blob/main/SECURITY.md) | Remote model artifacts, safer formats, and remote-code trust; living project guidance. |
| [scikit-learn model persistence](https://scikit-learn.org/stable/model_persistence.html) | Serialization/loading risks and compatibility; match the installed library version. |
| [NCSC secure AI development](https://www.ncsc.gov.uk/collection/guidelines-secure-ai-system-development) | Published lifecycle guidance for AI design, development, deployment, and operation. |
| [IBM Adversarial Robustness Toolbox](https://research.ibm.com/projects/adversarial-robustness-toolbox) | Primary description of a possible ML evaluation tool; check estimator/version support before use. |
| [Opacus FAQ](https://opacus.ai/docs/faq) | Differential privacy and accounting assumptions; consult the actual implementation. |
| [Electron security](https://www.electronjs.org/docs/latest/tutorial/security) | Privileged desktop bridges, IPC, sandboxing, and context isolation; version-sensitive defaults. |
| [Android exported components](https://developer.android.com/privacy-and-security/risks/android-exported?hl=en) | Platform entry points and export/caller trust. |
| [Apple Platform Security](https://support.apple.com/guide/security/welcome/web) | March 2026 guide observed; platform storage, signing, isolation, and device lifecycle. |
| [Chrome extension security](https://developer.chrome.com/docs/extensions/develop/security-privacy/stay-secure) | Permissions, messages, lower-trust content scripts, and privileged extension operations. |
| [NIST IR 8259A](https://csrc.nist.gov/pubs/ir/8259/a/final) | Final May 2020 core device cybersecurity capabilities; tailor to the device/use case. |
| [NIST SP 800-193](https://csrc.nist.gov/pubs/sp/800/193/final) | Final May 2018 firmware protection, detection, and recovery guidance. |
| [NIST SP 800-82 Rev. 3](https://csrc.nist.gov/pubs/sp/800/82/r3/final) | Final September 2023 OT guidance; the page identified Rev. 4 as an initial public draft on the research date. |
| [OWASP SCVS](https://scvs.owasp.org/) | Component inventory and software supply-chain verification guidance. |
| [OWASP SCSVS](https://scs.owasp.org/SCSVS/) | Smart-contract verification, primarily Solidity/EVM; do not treat it as chain-neutral. |
| [Apache Spark security](https://spark.apache.org/security.html) | Distributed data-processing trust and cluster access; verify actual runtime/configuration. |

## Maintenance triggers

Revisit relevant guidance when architecture, identity, tenant model, critical framework/compiler/runtime, hardware, protocol, cryptography, datasets, model artifacts, deployment boundaries, payment flows, or tool capabilities change. For unlisted domains, add authoritative sources and a tailored verification profile during the audit. Revalidate advisories for each actual review. Update this research date only after renewed source review; do not advance it automatically when a user invokes the skill.
