# Specialized systems

Apply all profiles present in the project and include their interactions in the coverage ledger. Search terms: payments, webhook, idempotency, race condition, AI agents, RAG, MCP, Next.js, Supabase, RLS, smart contracts, Solana. These profiles supplement the full-project workflow; they are not a closed list of supported technologies.

## Business logic, transactions, and concurrency

Write the business invariant before assessing its implementation. Re-derive prices, entitlements, ownership, quotas, discounts, and workflow permissions from trusted state. Check skipped, repeated, reordered, and concurrent operations, including negative amounts, overflow, rounding, currency mismatches, self-approval, and duplicate redemption.

Protect check-then-act decisions with suitable database constraints, atomic conditional writes, locking, or transactions. Define the necessary isolation and retry behavior. In-memory locks do not coordinate multiple instances. Bind idempotency keys to the actor and operation/payload; a reused key with a different payload must not silently authorize a different action.

Verify final persistent state, not just individual responses. For multi-service workflows, assess durable state transitions, reconciliation, and compensation when one side succeeds and another fails.

Source: [OWASP business logic security](https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html).

## Payments and signed webhooks

Use the provider's supported SDK and verify signatures against the exact required bytes before applying business effects. Check endpoint-secret selection, environment/account context, accepted event types, and timestamp/replay rules. Never treat a browser redirect or client-supplied payment status as settlement evidence.

Make processing durable and idempotent under duplicate, delayed, retried, and out-of-order deliveries. Acknowledge only after the event is safely accepted or its required work is completed; do not lose work by returning success before durable handoff. Reconcile uncertain provider outcomes rather than charging again blindly.

Bind verified payment state to the intended order, recipient, currency, and amount. Use exact monetary representations and provider rules. Minimize payment-data handling through hosted/tokenized flows. Do not log raw card data or security codes. Compliance scope requires a separate determination.

Source: [Stripe webhook guidance](https://docs.stripe.com/webhooks). Other providers may require different signature and event semantics; verify their documentation.

## AI applications, retrieval, and agent tools

Use [AI and ML systems](ai-ml-systems.md) for datasets, training, model artifacts, privacy, and adversarial model evaluation. Apply this section in addition when models retrieve data, produce application outputs, or invoke tools.

Treat prompts, retrieved documents, attachments, tool results, and model outputs as untrusted data. Prompt instructions and classifiers are not authorization boundaries. Enforce tool access in code using verified user identity, resource scope, argument validation, and explicit capability limits.

Keep tenant/user authorization intact throughout indexing, retrieval, reranking, citation generation, memory, caching, and tool execution. Check cross-session leakage, malicious retrieved instructions, data poisoning, unsafe model output rendering, and generated queries/code. Never execute model output directly as privileged shell commands or SQL.

Minimize data and credentials exposed to models and providers. Set retention and telemetry controls appropriate to the product. Bound token use, tool calls, recursion, retries, concurrency, and cost. Separate proposing an action from authorized execution; bind any required approval to the concrete action and prevent reuse after its parameters change.

Test indirect prompt injection, tool-output poisoning, and attempts to cross tenant boundaries with harmless fixtures. Include tool failures and provider changes. Evaluate defenses by observed behavior rather than assuming a stronger prompt prevents all attacks.

Sources: [OWASP LLM risk list](https://genai.owasp.org/llm-top-10/), [OWASP AI agent security](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html).

For MCP or analogous tool servers, verify transport-specific authentication, token audience and scopes, downstream delegation, trusted server identity, and local process privileges. Do not accept an unrelated service token merely to pass it through. Prevent confused-deputy access and cross-user session reuse. Where a proxy shares an upstream OAuth client, bind consent to the requesting downstream client instead of inheriting consent for every client. Inspect tool registration and updates as a supply-chain boundary. Confirm the protocol revision and actual capabilities before recommending configuration.

Source: [MCP security best practices, 2026-07-28 documentation](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/docs/2026-07-28/tutorials/security/security_best_practices.mdx). Recheck the implementation's negotiated version and corresponding authorization specification.

## Next.js and similar server/client frameworks

Treat exported server actions and API routes as externally callable operations. Authenticate and authorize where sensitive data is accessed or changed, even when middleware, routing, or a page component performs an earlier check. Validate every action argument.

Keep privileged dependencies and secrets on the server side. Inspect serialized props, error payloads, public environment substitutions, and caching for exposure. Check installed framework advisories and actual version behavior. Framework-generated action identifiers or encryption do not replace permission checks.

Source: [Next.js data security](https://nextjs.org/docs/app/guides/data-security).

## PostgreSQL and Supabase

Review table grants and row policies together. Test SELECT, INSERT, UPDATE, and DELETE using actual client roles; policy existence alone proves little. Check both existing-row eligibility (`USING`) and resulting-row constraints (`WITH CHECK`), plus field permissions. PostgreSQL can reuse `USING` when `WITH CHECK` is omitted for applicable policies; omission alone is not evidence of a bypass.

Check owner/superuser/BYPASSRLS behavior, privileged service credentials, views, functions, storage policies, and RPC paths. Scope elevated operations explicitly. For necessary `SECURITY DEFINER` functions, review ownership, execution grants, a safe search path, and internal authorization. Never expose privileged service credentials to clients.

Verify trusted claims and tenant membership; avoid authorizing from user-editable metadata. Run negative policy tests through the same effective roles as the application. A RLS-filtered UPDATE can affect zero rows without throwing an error: verify that the target record remains unchanged.

Sources: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [PostgreSQL row security](https://www.postgresql.org/docs/18/ddl-rowsecurity.html).

## Mobile and native applications

Use the complete [Clients, native software, and devices](client-native-devices.md) profile for mobile, desktop, CLI, extensions, native/OS components, firmware, IoT, and physical systems. Also assess any backend, model, package, and release pipeline these clients depend on.

## Wallet authentication and blockchain

For wallet login, issue a server-generated challenge bound to the expected domain, purpose, address, session, expiry, and one-time nonce. Verify the exact message bytes with the correct chain-specific encoding and supported signature API. Consume challenges atomically. A valid reusable arbitrary signature is not sufficient authentication.

For transactions, decode the real transaction format and all relevant instructions; check signers, programs/contracts, destinations, asset identity, amounts, permissions/approvals, fees, and network context. Do not model a Solana transaction as generic `to`, `from`, and `amount` fields. Verify settlement through trusted chain data and a finality policy; balance checks and simulation alone do not prove payment or guarantee success.

For on-chain programs, examine signer/owner constraints, derived addresses, cross-program calls, arithmetic, account reuse/closure, and upgrade authority using chain-specific guidance. For EVM contracts, include initialization and access controls, external calls/reentrancy, delegate calls, upgrade/storage layout, oracle assumptions, rounding, slippage, front-running/order dependence, signatures/replay, and economic invariants as applicable. For bridges, assess cross-domain validation, relayer/validator trust, finality, and replay boundaries. Do not transfer EVM assumptions mechanically to another chain.

Use static analysis, contract tests, property/invariant tests, bounded fuzzing, and authorized local/fork simulation suited to the chain. Check the deployed bytecode/configuration and administrative keys when available; a source-only review cannot verify them. Do not perform real fund transfers as a test. Formal verification claims must state the properties, assumptions, and implementation covered. [OWASP SCSVS](https://scs.owasp.org/SCSVS/) primarily targets Solidity/EVM; choose additional chain-specific guidance for other systems.

Sources: [Sign In With Solana reference](https://github.com/phantom/sign-in-with-solana), [Solana core model](https://solana.com/docs/core), [Solana signing and transaction message integrity](https://solana.com/docs/core/transactions/partial-signing).
