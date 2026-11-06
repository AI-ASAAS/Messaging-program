# ASAAS AI Skills

A shared library of reusable AI skills and supporting documentation for the
ASAAS AI team.

Our goal is to turn proven ways of working into clear, reusable instructions.
Well-designed skills help every developer and AI agent follow the same workflow,
produce consistent results, and deliver work faster without rediscovering the
process for every project.

## Start with a foundation skill

Each area leader must begin by creating and maintaining one **foundation skill**
for their area. The foundation skill lives directly inside the category folder
and defines the shared ASAAS approach for work in that discipline.

| Area | Foundation skill | What it should establish | 
| ----- | ----- | ----- | 
| Backend | `backend/SKILL.md` | Project structure, architecture, API conventions, approved tooling, testing, and delivery standards | 
| Frontend | `frontend/SKILL.md` | Project structure, component architecture, styling, state management, accessibility, testing, and delivery standards | 
| Cybersecurity | `cyber/SKILL.md` | Secure-development baseline, review approach, risk handling, incident practices, and reporting standards | 
| Brand Identity | `brand-identity/SKILL.md` | Visual principles, approved brand assets, typography, color, tone, and review standards | 
| AI | `ai/SKILL.md` | AI project structure, model and tool selection criteria, evaluation, safety, data handling, and delivery standards | 
| Mobile | `mobile/SKILL.md` | Flutter project structure, widget and state architecture, Asaas UI & Thmanyah typography, Arabic RTL localization, API and secure local storage, testing, and mobile security standards | 

The area leader owns the foundation skill and keeps it aligned with current team
practice. It should explain the defaults and decisions that apply to most work
in the area without trying to document every specialized task.

For example, the Backend foundation skill should teach an AI agent or developer
how ASAAS normally structures a new backend project. A focused workflow such as
reviewing an API contract should be a separate task skill.

```
backend/
|-- SKILL.md                     Foundation skill owned by the Backend leader
`-- review-api-contract/
    |-- SKILL.md                 Focused task skill
    `-- references/
        `-- error-codes.md

```

Use this rule to decide where guidance belongs:

* If it applies to most work in the area, add it to the foundation skill.

* If it describes one repeatable task with a clear outcome, create a custom task
  skill.

* If it applies to only one customer or project, keep it with that project
  unless the workflow becomes reusable across ASAAS.

Do not turn the foundation skill into an index of every possible procedure.
Keep specialized workflows in their own folders so they remain easy to discover,
test, and improve.

## Quick start

### For area leaders

1. Create the foundation `SKILL.md` directly inside your category folder.

2. Document the shared project structure, technical or creative standards,
   decision criteria, and quality baseline for your area.

3. Test it by using it to start or review a realistic project in that area.

4. Ask the team to review it, then keep it current as team practices change.

### For custom task skills

1. Choose the category that best matches the task.

2. Read the category's foundation skill and follow its shared standards.

3. Create a lowercase, kebab-case folder named after the task.

4. Add a `SKILL.md` file using the template below.

5. Add only the scripts, references, or assets the task genuinely needs.

6. Test the skill on a realistic request.

7. Open a pull request and complete the review checklist.

Example:

```
backend/
|-- SKILL.md                     Backend foundation skill
`-- api-error-triage/
    |-- SKILL.md
    `-- references/
        `-- error-codes.md

```

## Repository structure

```
asaas_skills/
|-- backend/
|   |-- SKILL.md       Backend foundation skill
|   `-- <task-skill>/  Backend task skills
|-- frontend/
|   |-- SKILL.md       Frontend foundation skill
|   `-- <task-skill>/  Frontend task skills
|-- cyber/
|   |-- SKILL.md       Cybersecurity foundation skill
|   `-- <task-skill>/  Cybersecurity task skills
|-- brand-identity/
|   |-- SKILL.md       Brand Identity foundation skill
|   `-- <task-skill>/  Brand Identity task skills
|-- ai/
|   |-- SKILL.md       AI foundation skill
|   `-- <task-skill>/  AI task skills
|-- mobile/
|   |-- SKILL.md       Mobile foundation skill
|   `-- <task-skill>/  Mobile task skills
`-- README.md

```

Each category folder is a foundation skill and may contain focused task skills.
Optional resources for the foundation skill live directly in the category:

```
<category>/
|-- SKILL.md                     Required foundation entry point
|-- agents/                      Optional foundation metadata
|-- references/                  Optional foundation documentation
|-- scripts/                     Optional foundation helpers
|-- assets/                      Optional foundation templates
`-- <task-skill>/                One focused workflow
    |-- SKILL.md                 Required: the skill entry point
    |-- agents/                  Optional: UI metadata and invocation policy
    |   `-- openai.yaml
    |-- references/              Optional: detailed or conditional documentation
    |-- scripts/                 Optional: reusable, deterministic helpers
    `-- assets/                  Optional: templates or files used in output

```

Git does not track empty directories. The initial category folders therefore
contain `.gitkeep` placeholders. Delete a placeholder when the folder receives
its foundation `SKILL.md`.

## Create a custom task skill

### 1. Pick one clear responsibility

A custom task skill should solve a recognizable, repeatable problem with a clear
outcome. Prefer a focused skill such as `review-api-contract` over a broad skill
such as `backend-helper`.

Create the folder under the closest category:

```
mkdir -p backend/review-api-contract

```

Before writing the custom skill, read the category's foundation `SKILL.md`. Reuse
its conventions rather than duplicating them. If the task skill depends on the
foundation skill, state that dependency clearly in its workflow.

If none of the existing categories fits, propose a new category and its owner in
the pull request instead of placing the skill arbitrarily.

### 2. Add `SKILL.md`

Every skill must have a `SKILL.md` file with YAML frontmatter followed by concise
instructions.

```
---
name: review-api-contract
description: Review REST API contracts for consistency, compatibility, and clear error behavior. Use when creating or changing an API endpoint or its schema.
---

# Review API Contract

## Goal

Produce an actionable API contract review before implementation or release.

## Inputs

- The API specification or endpoint definitions
- Relevant product requirements
- Existing compatibility constraints

## Workflow

1. Read the contract and identify affected consumers.
2. Check naming, status codes, validation, pagination, and error shapes.
3. Identify breaking changes and missing behavior.
4. Return findings ordered by severity, with concrete fixes.

## Output

Provide a short summary followed by actionable findings. Include file or schema
references where available.

## Constraints

- Do not invent undocumented requirements.
- Clearly label assumptions and missing information.

```

The frontmatter fields are important:

* `name`: Must match the skill folder name and use lowercase kebab-case.

* `description`: State both what the skill does and when it should be used. This
  is what helps an AI agent select the right skill.

### 3. Add supporting resources only when useful

* Put detailed, conditional guidance in `references/` and link to it from
  `SKILL.md`, explaining when it should be read.

* Put repeatable automation in `scripts/`. Scripts should be safe, documented,
  and tested.

* Put output templates, images, fonts, or boilerplate in `assets/`.

* Use `agents/openai.yaml` only when the skill needs user-facing metadata or a
  specific invocation policy.

Keep the main `SKILL.md` short enough to load quickly. Do not duplicate the same
guidance across multiple files.

### 4. Test the workflow

Run the skill against at least one realistic request. Verify that another
developer or AI agent can follow it without relying on unwritten context.

Check the result, not only the wording of the instructions:

* Did the skill activate for the right task?

* Did it produce the expected artifact or decision?

* Were important constraints followed?

* Was any step ambiguous, redundant, or too restrictive?

## Writing principles

* Write instructions in clear English.

* Assume the reader is capable; document ASAAS-specific knowledge and decisions,
  not generic advice.

* Prefer desired outcomes and decision criteria over unnecessary step-by-step
  rules.

* Separate required rules from optional recommendations.

* Preserve user intent and authorization boundaries.

* Use examples only when they remove real ambiguity.

* Never include secrets, credentials, customer data, or environment-specific
  tokens.

* Link to a single source of truth instead of copying documentation that will
  become stale.

## Naming conventions

| Item | Convention | Example | 
| ----- | ----- | ----- | 
| Category folder | Lowercase kebab-case | `brand-identity` | 
| Skill folder | Lowercase kebab-case, action-oriented | `review-api-contract` | 
| Skill entry point | Exact uppercase filename | `SKILL.md` | 
| Reference files | Lowercase kebab-case | `error-codes.md` | 
| Scripts | Lowercase snake_case | `validate_schema.py` | 

Avoid vague names such as `helper`, `utils`, `general`, or `misc`.

## Pull request checklist

Before requesting review, confirm that:

* \[ \] The guidance belongs at the chosen level: foundation or custom task.

* \[ \] A foundation skill has a clearly identified area leader responsible for it.

* \[ \] The skill has one clear purpose and lives in the correct category.

* \[ \] The folder name and frontmatter `name` match.

* \[ \] The description says what the skill does and when to use it.

* \[ \] `SKILL.md` contains only guidance needed for the task.

* \[ \] Supporting files are linked from `SKILL.md` and have a clear purpose.

* \[ \] New or changed scripts have been tested.

* \[ \] The skill has been tried on a realistic request.

* \[ \] No secrets, private data, generated output, or unrelated files are included.

* \[ \] Another team member can follow the workflow without verbal context.

Reviewers should focus on whether the skill improves real outcomes, is easy to
discover, and captures a reusable ASAAS workflow. Minor wording preferences
should not block a useful contribution.

## Improving existing skills

Update a skill when real usage reveals a missing constraint, ambiguous decision,
or repeated failure. Prefer a narrow correction backed by evidence over adding
rules for every hypothetical edge case.

When behavior changes, describe the reason and the scenario tested in the pull
request.

## Need help?

If you are unsure where a skill belongs or how much detail it needs, open a draft
pull request with the intended use case and one realistic example. The team can
shape the workflow together before the instructions become large.
