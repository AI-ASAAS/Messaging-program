---
name: build-ai-agents
description: Design, build, extend, or review AI agent workflows using ASAAS agent architecture and CrewAI defaults. Use when an AI system requires agent-based tool use, adaptive execution, planning, or coordinated agent responsibilities.
---

# Build AI Agents

## Goal

Deliver a bounded agent workflow that completes the product task, uses tools correctly, and produces verifiable results. Follow the [AI Foundation](../SKILL.md) first, then this skill for agent-specific architecture and implementation decisions.

## Start With Context

Read repository instructions and inspect the current architecture, dependencies, agents, tools, LLM integrations, RAG implementation, prompts, workflows/pipelines, model/provider configuration, API/service boundaries, and existing evaluations or representative tests.

Determine what works, what is broken, what can be reused, and what actually needs to change. Extend existing agent infrastructure before creating a parallel implementation. Preserve working interfaces; do not migrate frameworks, rewrite agents, or reorganize the repository merely to match this skill.

Establish the requested outcome, inputs, output consumer, available tools, allowed actions, completion criteria, and relevant runtime constraints. Ask only about missing details that materially affect the design; state non-material assumptions.

## Decide Whether Agents Are Needed

Use agents when the task needs adaptive tool selection, planning, multi-step execution where the next action depends on previous results, or coordination between specialized AI responsibilities.

Prefer a direct LLM call for simple question answering, a retrieval/generation workflow for simple RAG, and normal application functions or pipelines for deterministic business logic, API operations, or predetermined processing. A fixed workflow may contain an agent step without making every step autonomous.

Tool use alone does not require an agent framework or a multi-agent architecture. Start with one agent when it can understand the task, select tools, execute the work, and produce the result.

Use multiple agents only when distinct responsibilities justify specialization, coordination, independent evaluation, different tool access, or different reasoning responsibilities. For example, research, validation, and reporting may warrant separate agents when each has a meaningful contract. Adding a validation agent does not replace application validation or prove independence if it simply repeats the same assumptions. Explain the benefit and coordination cost before splitting a simple responsibility.

## Architecture and Agent Design

Keep these responsibilities explicit, using the existing project's organization:

| Component | Responsibility |
| --- | --- |
| Agent | Own a specific product responsibility and choose actions within assigned limits. |
| Task | Define a bounded assignment, inputs, completion criteria, and expected result. |
| Tool | Expose a narrow capability with validated arguments, enforced permissions, and controlled side effects. |
| LLM | Support reasoning, tool selection, and generation through the configured provider integration. |
| Context | Supply the permitted inputs, evidence, and prior results needed for the current task. |
| Crew / Workflow | Coordinate assignments, dependencies, execution state, and termination. |
| Output | Represent the result using the consumer's contract, including status and limitations. |
| Evaluation | Verify task completion, tool behavior, outputs, coordination, and constraints. |

For each agent, define its role, goal, responsibilities, available tools, LLM, expected output, required context, limitations, and action permissions. Tie these to a real product responsibility rather than a broad persona. Keep business rules and authorization in application code, not only in role descriptions or prompts.

Expose the workflow through the existing AI service boundary. Application consumers should not need to understand internal delegation or CrewAI objects. Separate agent definitions, tool adapters, output schemas, and orchestration when complexity warrants it; do not scaffold unused layers.

## CrewAI Standard

CrewAI is the ASAAS default for justified agent workflows. Preserve another suitable existing framework, follow explicit user direction, or choose an alternative when a concrete requirement is unmet or a simple non-framework implementation is more appropriate. Document material deviations.

Within CrewAI:

- **Agent:** Map the bounded role and goal to a configured agent; grant only the tools and delegation behavior its responsibility requires.
- **Task:** Specify the objective and expected output. Assign an owner directly for sequential work or define the eligible responsibility for manager assignment.
- **Crew:** Assemble the participating agents and tasks behind the application-facing workflow.
- **Process:** Use sequential execution for known task order with useful agent judgment inside tasks. Use hierarchical execution only when manager-led assignment, delegation, and review add value; configure the manager LLM or manager agent and bound its authority and work. Neither process is required for an ordinary deterministic pipeline. See the official [process documentation](https://docs.crewai.com/en/concepts/processes).
- **Tools / LLM:** Reuse application adapters and provider configuration rather than embedding integrations in agent definitions.
- **Context / Task Dependencies:** Declare which prior task outputs are needed and ensure those tasks finish before consumption. Avoid relying on accidental execution order or sharing all outputs with every agent.
- **Structured Output:** Configure an explicit output schema for machine consumers; CrewAI supports `output_pydantic` or `output_json`. Validate the result before use rather than treating `expected_output` prose as schema enforcement. See the official [task documentation](https://docs.crewai.com/en/concepts/tasks).

Inspect the installed CrewAI version and verify applicable settings against its documentation before implementing. Preserve the project's configuration style; do not upgrade the framework or adopt a new scaffold merely because current documentation uses it.

## Tasks and Context

Define each task's objective, expected inputs/output, responsible agent or assignment policy, relevant context, completion criteria, and appropriate tools. Prefer a bounded assignment such as verifying supplied claims against permitted sources and returning findings with evidence over “analyze everything.”

Make dependencies and handoff contracts understandable. Pass only the information needed by the next agent, task, tool, retrieval call, or application service. Prefer concise structured results to duplicated full histories; preserve source identifiers, evidence, and unresolved limitations when required for validation or reporting. Separate request-specific context from reusable configuration and keep sensitive data out of unnecessary handoffs.

Do not let task outputs, retrieved text, or tool responses override system constraints, application rules, or permissions. Check dependent inputs before execution; invalid or incomplete upstream results must not silently become trusted facts.

## Tools and Permissions

Give each tool a clear purpose, narrow responsibility, input/output contract, useful failure result, and explicit permissions. Validate arguments and enforce access in the application/tool layer on every call, including delegated calls. The model does not grant itself permissions; choosing a tool is not authorization.

- **Read-only tools:** Enforce the caller's allowed data scope and return only needed information.
- **State-changing / external-action tools:** Define allowed operations, targets, side effects, and required authorization. Apply confirmation before execution where the application's rules require it; existing authorization need not be requested again unless the action changes materially. A review of the final answer is not authorization for earlier tool side effects.

Use bounded tool timeouts and distinguish invalid input, denied access, transient failure, and uncertain action outcome. For writes, define retry/idempotency behavior so recovery does not repeat an external action accidentally. Return evidence of the actual operation; do not accept the agent's claim as proof that a write occurred. Keep credentials outside model-visible tool arguments and results.

Follow the repository's relevant Cybersecurity standard when available for broader security requirements; this skill defines agent/tool boundaries, not a replacement security policy.

## LLM and RAG Integration

Follow the AI Foundation for provider/model selection. Reuse existing integrations, keep provider configuration outside agent business logic, and choose models for the task's reasoning, tool use, output contract, quality, latency, and cost. Avoid an unnecessarily expensive model for simple work, but evaluate behavior before accepting a cheaper alternative. Preserve downstream structured-output requirements.

RAG and agents are separate capabilities. Use retrieval only when a task needs controlled domain/project knowledge. Prefer the boundary: agent -> existing RAG capability/tool/service -> retrieved evidence -> agent reasoning. Preserve relevant source and access information; retrieved text remains evidence, not authority.

Do not automatically equip every agent with retrieval or build a separate ingestion/embedding/vector-storage implementation here. Use the AI Foundation now and the future dedicated RAG task skill when it exists; inspect that skill before relying on it. No future skill path is assumed to be available.

## Outputs, Failure Behavior, and Execution Limits

Distinguish a human-readable response from a machine-consumed result. For programmatic use, define a schema with predictable fields and validate structure and task-specific correctness before downstream use. Represent success, partial completion, and failure distinctly where needed; include evidence or unresolved items when required by the consumer.

Set explicit maximum iterations, task/delegation limits, tool-call limits where relevant, per-call timeouts, an overall execution deadline, and termination conditions. Enforce these through framework controls plus the surrounding application/tool layer where necessary. Limits must cover retries and nested delegation; per-agent limits alone do not bound the whole workflow. Choose values from product constraints, not invented ASAAS-wide numbers.

| Failure | Required behavior |
| --- | --- |
| Tool or dependency fails | Retry only recoverable failures within a bounded budget; otherwise stop the dependent path or use a defined fallback. Do not repeat uncertain writes blindly. |
| Retrieval has no useful evidence | Report insufficient evidence or use an explicitly allowed fallback; do not fabricate grounded answers. |
| LLM output is invalid | Validate, allow bounded correction if appropriate, then return an explicit failure if the contract remains unmet. |
| Execution limit is reached | Terminate safely, report incomplete work, and prevent further tool actions. |
| Result is incomplete | Preserve useful verified results with a partial status when supported; otherwise fail the task. |
| Agents disagree | Apply the defined evidence-based resolution or review rule; expose unresolved disagreement rather than forcing consensus. |

Keep fallback behavior explicit. Never hide failure behind a fabricated successful response or allow indefinite autonomous retries. Record enough execution status and tool outcomes to diagnose failures without logging sensitive context unnecessarily.

## Implementation Workflow

1. Inspect the project and follow the AI Foundation; identify reusable agent infrastructure.
2. Confirm agents are justified and choose single-agent or multi-agent execution with a concrete reason.
3. Define responsibilities, tools, permissions, inputs/outputs, and representative success/failure cases.
4. Select the LLM and design tasks, dependencies, process, handoffs, and execution limits.
5. Implement one meaningful end-to-end path incrementally, then extend only as required.
6. Validate outputs and actual tool behavior; evaluate representative scenarios and affected existing behavior.
7. Document important decisions, authorization boundaries, evaluation results, and limitations in the project's existing documentation.

For reviews, inspect these same contracts and observed execution; report concrete gaps and proposed corrections before recommending redesign.

## Evaluation

A successful HTTP response does not prove an agent system works correctly. Use the project's existing evaluation/test approach and representative scenarios; do not introduce a full evaluation framework without a requirement.

Check appropriate tool selection, valid arguments and allowed targets, actual task completion, useful/schema-valid output, responsibility and permission compliance, and correct failure handling. For multiple agents, verify required context exchange, assigned responsibilities, disagreement handling, and workflow termination.

Include relevant cases such as denied actions, malformed tool arguments, unavailable tools, missing evidence, invalid output, incomplete dependencies, and exhausted limits. Use controlled tool substitutes or permitted environments for side-effecting cases. Verify that failures cause no unauthorized writes and no duplicate actions during retries. Compare affected behavior with the existing baseline and report what was actually tested.

## Boundaries

This task skill supplements `ai/SKILL.md`; it does not replace backend, frontend, deployment, or Cybersecurity standards. Follow the [Backend Foundation](../../backend/SKILL.md) for backend implementation and the relevant frontend/Cybersecurity foundation when present and applicable.

Do not duplicate general AI architecture, RAG implementation, generic testing infrastructure, or other teams' policies here. Do not invent product requirements, permissions, provider defaults, or framework migration needs. Follow the AI Foundation's data-handling and authorization boundaries, including explicit authorization for commits, pushes, deployments, and external changes.
