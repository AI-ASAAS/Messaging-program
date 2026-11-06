# AI and ML systems

Use for models and their lifecycle, including classical ML, deep learning, language/image/audio/video/multimodal models, recommendation, forecasting, anomaly detection, reinforcement learning, and federated or distributed learning. A project need not expose a chatbot or web API to require this profile. Also apply the platform, data, native-code, and agent profiles wherever those components exist.

Contents: inventory; data; training; artifact loading; adversarial evaluation; privacy; inference; distribution; verification.

## Model and lifecycle inventory

Identify the task, modality, intended consumers, attacker capabilities, framework/runtime, and whether the project creates, fine-tunes, converts, distributes, or only serves a model. Record base models, checkpoints, adapters/LoRA, tokenizers, preprocessors, postprocessors, custom operators, prompts/templates, datasets, indexes, feature stores, notebooks, experiment tracking, and model registries. Include dependency and accelerator/runtime versions.

Track lineage across source revision, training configuration, dataset snapshot, preprocessing, model artifact digest/version, evaluation run, and deployed revision. A mutable model name or registry tag is insufficient to reproduce evidence. Identify who can change or promote each item and the privileges of training/serving jobs.

Source: [NIST SP 800-218A](https://csrc.nist.gov/pubs/sp/800/218/a/final). This model-development profile complements ordinary software lifecycle controls; it does not make an LLM checklist sufficient for all ML.

## Datasets and preprocessing

Review ingestion, annotation, provenance, access controls, transformations, labels, deduplication, splits, retention, and deletion. Treat external datasets, archives, audio/image decoders, dataset scripts, and preprocessing plugins as untrusted inputs or code. Validate shape, dimensions, counts, schema, encoding, missing values, pathological inputs, and resource limits before expensive work.

Identify opportunities for poisoning, backdoor insertion, label manipulation, feature tampering, and contaminated evaluation data. Protect holdout data and prevent overlap from invalidating evaluations. Distinguish deliberate attack evidence from ordinary data-quality issues; label the latter separately while explaining any security effect. Keep production personal data out of exported notebooks and unrestricted experiment logs.

For synthetic data, inspect generator provenance and inherited sensitive information or poisoned behavior rather than assuming synthetic means safe. For retrieval datasets, preserve source authorization through indexing and derived caches. For federated learning, examine participant identity, contribution validation, aggregation trust, and update confidentiality; aggregation does not automatically establish privacy or robustness.

Reference: [NIST adversarial ML taxonomy](https://www.nist.gov/publications/adversarial-machine-learning-taxonomy-and-terminology-attacks-and-mitigations-0). Build tests around the capabilities an attacker actually has.

## Training and fine-tuning execution

Treat training notebooks, callbacks, custom losses, plugins, preprocessing, build extensions, and remote code as executable dependencies. Review worker credentials, filesystem/network access, job submission, distributed rendezvous/control channels, telemetry, checkpoint writers, and registry permissions. Prevent lower-trust contributors or tenants from controlling privileged workers or replacing promoted artifacts.

Keep training/evaluation resources bounded and separate from production credentials and workloads where trust requires it. Review resume-from-checkpoint behavior, optimizer state, logs, failure recovery, and output locations. A resumed job or changed adapter can alter the security state of an otherwise reviewed model.

Source: [PyTorch security policy](https://github.com/pytorch/pytorch/security/policy). Confirm the actual runtime's supported security boundaries; do not assume distributed primitives authenticate hostile peers.

## Model formats, loading, and conversion

Inspect artifact type and loading code before deserializing. Pickle-based formats, including common joblib/cloudpickle use, may execute code. Safer persistence choices depend on the model and runtime; do not equate a filename extension with trust. Model inspection and conversion can themselves invoke loaders. Run necessary inspection of untrusted executable artifacts only in an appropriate disposable sandbox without secrets or unnecessary network access.

Source: [scikit-learn model persistence](https://scikit-learn.org/stable/model_persistence.html).

Prefer constrained data-only weight formats when suitable. Inspect auxiliary configuration, tokenizers, custom code, dependencies, and operators as well as weights. Pin approved model/code revisions. Treat `trust_remote_code` as a code-execution decision; never enable it merely to make a loading failure disappear. Restricted loader options depend on installed versions and advisories and are not a complete sandbox or proof of benign model behavior.

Source: [Transformers security guidance](https://github.com/huggingface/transformers/blob/main/SECURITY.md).

A serialized computation graph can still execute operations with filesystem, network, or other process privileges. An ONNX/TensorFlow/other graph is not safe merely because it avoids Python pickle. Review allowed operators, custom kernels, external tensor paths, shape/allocation bounds, and the runtime attack surface. Do not convert an untrusted pickle on the host in order to make it safe afterward.

Source: [TensorFlow security guidance](https://github.com/tensorflow/tensorflow/blob/master/SECURITY.md).

## Adversarial model evaluation

Specify the threat model before choosing evaluations: attacker knowledge, access, controlled data/stage, perturbation constraints, query budget, target outcome, and protected assets. Include relevant evasion, poisoning/backdoor, extraction, and privacy-inference questions. Select tests for the model's task and modality instead of reusing language-model prompts for an image classifier or forecast model.

Test representative clean and adversarial cases and inspect security-relevant subgroups or edge conditions. A defense that blocks all valid input is not successful. Evaluate adaptive bypass of the proposed defense when feasible. Do not infer robust protection from one failed attack, a clean benchmark, a small sample, or a detector's confidence score.

Use supported tools only after checking compatibility with the actual estimator/runtime. [IBM's Adversarial Robustness Toolbox](https://research.ibm.com/projects/adversarial-robustness-toolbox) is one possible evaluation toolkit, not a universal test or required dependency. Keep attack demonstrations bounded to owned model/data environments.

For every evaluation, record artifact and data revisions, preprocessing, threat model, test method, sample construction/count, seed where meaningful, budget, metrics, outcome, and limitations. For stochastic behavior, use enough repeated trials to support the stated claim and report variation or uncertainty; never invent universal pass thresholds. Set acceptance criteria from the product's threat model before interpreting results. If full-scale retraining is unavailable, report the smaller experiment's scope without extrapolating.

## Training-data privacy and model confidentiality

Assess whether models, outputs, embeddings, gradients, logs, or checkpoints reveal sensitive training information. Use controlled canaries or consented synthetic fixtures for membership/inversion/extraction evaluations rather than publishing recovered personal data. Authentication and encryption protect access paths; they do not by themselves establish privacy of released model behavior. Model extraction may be an authorized feature for open weights; establish the intended confidentiality boundary first.

If differential privacy is claimed, verify the implementation and accounting assumptions, privacy unit, sampling, clipping, noise, composition across runs/releases, and stated epsilon/delta. A configuration label is insufficient, and empirical non-disclosure is not a formal privacy guarantee. Avoid promising that DP retroactively protects new sensitive data introduced during later non-private training.

Source: [Opacus privacy and accounting FAQ](https://opacus.ai/docs/faq).

## Inference, integration, and release

Review serving identity, tenant isolation, model selection, adapters, caches, request batching, file/image/audio parsers, output handling, and resource budgets. Limit tensor shapes, context/input/output size, concurrent requests, GPU memory, execution time, retries, and paid calls according to the workload. Verify cancellation and failures do not disclose another request's data or leave unbounded work.

Check release promotion, artifact provenance, rollback, model changes, drift monitoring, alerting, and incident containment. Reevaluate when the model, quantization/conversion, adapter, tokenizer, prompt, tools, retrieval corpus, or runtime changes. Track enough version information to connect a behavior incident to the exact deployment. Do not classify all accuracy drift as an attack; investigate causes and security impact.

Source: [NCSC secure AI lifecycle guidance](https://www.ncsc.gov.uk/collection/guidelines-secure-ai-system-development).

For tool-using models, load the AI-agent/MCP section of [Specialized systems](specialized-systems.md). Model output must not become authority to read data or perform privileged actions. For ML controlling physical processes, also load the device/OT profile; satisfactory model metrics alone do not establish safe actuation.

## Required verification record

| Surface | Evidence and tests to select |
| --- | --- |
| Data ingestion | Provenance/ACL review; malformed, oversized, mislabeled, and unauthorized-source cases; isolation of executable dataset code. |
| Model loading | Static loader/path review; allowed versus rejected formats/revisions; safe isolation tests without executing a malicious artifact on the host. |
| Training/registry | Job and worker permissions; unauthorized artifact replacement/promotion; checkpoint ownership and recovery. |
| Model behavior | Threat-specific clean/adversarial evaluation; attack budgets, sample scope, and uncertainty. |
| Privacy | Exposure review; controlled leakage tests and any claimed formal accounting evidence. |
| Serving | Multi-tenant and batching isolation; resource limits; invalid input; cancellation; model/adapter authorization. |
| Lifecycle | Reproducible identity of released artifacts; update/rollback controls; monitoring and incident linkage. |

Record missing data, compute, weights, provider internals, or permissions explicitly. A model accessible only through an API allows behavioral and integration testing within that access; it does not permit claims about unobserved training integrity or all possible backdoors.
