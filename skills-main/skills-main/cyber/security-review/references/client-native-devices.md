# Clients, native software, and devices

Use for Android/iOS, desktop, CLI, browser/editor extensions, native libraries/processes, OS components, firmware, IoT, embedded systems, robotics, and operational technology. Combine profiles for hybrid products. Contents: mobile; desktop/CLI; extensions; native/OS; devices/OT; verification.

## Mobile applications

Inventory platform versions, manifests/entitlements, signing configuration, embedded SDKs, native bridges, local data, network paths, and release artifacts. Map relevant [OWASP MASVS](https://mas.owasp.org/MASVS/) controls to concrete platform tests; source inspection does not replace checking the packaged application and its actual OS behavior.

Review local storage and platform key protection; session handling; backups, logs, clipboard, screenshots, notifications, and analytics; permissions; deep/app links; exported components; WebViews; inter-app communication; and update integrity. Verify backend authorization independently of UI gates or device-side checks. Consider rooted/jailbroken devices only according to the threat model; anti-tamper detection is not a substitute for server controls.

For Android, verify effective merged-manifest behavior, exported activities/services/receivers/providers, intent and PendingIntent handling, URI/file grants, and caller authorization. Intent filters alone do not establish access control. Inspect the target API's defaults rather than assuming they are constant. [Android component security](https://developer.android.com/privacy-and-security/risks/android-exported?hl=en).

For Apple platforms, inspect relevant entitlements, app groups, keychain access groups and accessibility, data protection, URL handlers, extensions, and signing/update trust. Select platform tests against the supported OS and distribution route. Do not describe signing or store review as proof of secure application logic. [Apple Platform Security](https://support.apple.com/guide/security/welcome/web).

Exercise an unauthorized caller, another user/account, a locked/offline device where relevant, backup/restore, revoked credentials, malformed links/messages, and sensitive local state. If an emulator cannot verify hardware-backed properties, record that gap and the required real-device evidence.

## Desktop and command-line software

Identify what runs as the logged-in user, an administrator, a background service, or another account. Review installers, uninstallers, update mechanisms, protocol/file handlers, startup tasks, configuration discovery, environment variables, PATH/DLL/library loading, shell invocation, plugin directories, IPC endpoints, and local listening sockets.

Check filesystem permissions, temporary-file creation, symlinks/reparse points, traversal, unsafe extraction, races, and secret exposure through arguments, history, output, crash dumps, or telemetry. Verify that lower-privileged users cannot replace code, configuration, updates, or executable search paths consumed by a privileged process. Localhost does not automatically establish caller identity.

For CLI tools, test untrusted filenames/options, stdin, hostile working directories, environment/config precedence, plugin loading, and output consumed by other programs. Consider terminal control sequences and executable output formats when the tool handles untrusted content. Avoid flagging intended same-user script execution without a crossed security boundary.

For Electron or similar shells, review the renderer-to-privileged-process bridge, sandbox, context isolation, navigation/new windows, remote content, custom schemes, and IPC sender/argument validation. Expose narrow capabilities rather than unrestricted OS interfaces. Verify actual framework-version defaults. [Electron security](https://www.electronjs.org/docs/latest/tutorial/security).

## Browser, editor, and host extensions

Map extension privileges and its boundaries with web pages, content scripts, the host, native messaging, and remote services. Minimize capabilities and host permissions; authenticate message senders, validate actions/arguments, and prevent a lower-trust page/script from invoking arbitrary privileged operations. Review web-accessible resources, remote code, storage, updates, and publisher-account protection.

For editor plugins and developer tooling, opening an untrusted workspace can cross into command execution or secret access. Review workspace trust, automatic tasks, project configuration, language servers, preview/rendering, and package installation behavior. Scope tests to the actual host's supported permission model.

Reference for browser extensions: [Chrome extension security](https://developer.chrome.com/docs/extensions/develop/security-privacy/stay-secure). Obtain corresponding primary guidance for a different host; the browser model does not automatically apply to editor plugins.

## Native code, runtimes, and privileged OS components

Review memory ownership, bounds, lengths, integer conversions/overflow, format strings, lifetime, error cleanup, undefined behavior, unsafe FFI, concurrency, shared memory, and parser state machines. Trace untrusted bytes through native dependencies even when the application is written in a memory-safe language. Inspect compiler/linker protections and release flags supported by the target.

Run supported memory/undefined-behavior sanitizers and bounded fuzzing against important parsers and native boundaries. Use realistic valid seed inputs and inspect coverage and crashes; a no-crash run is only evidence for exercised executions. Concurrency checks may require separate builds. Do not assume sanitizers can all be combined or that they belong in every production binary. [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html), [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html).

For kernels, drivers, hypervisors, runtimes, and privileged services, additionally review user/kernel or guest/host transitions, IOCTL/syscall/RPC handling, handle ownership, access checks, DMA/shared-buffer trust, isolation, and lifecycle teardown. Use matching vendor guidance and disposable VMs or an approved test rig. Do not load an untrusted driver or kernel component into the user's primary system for testing. Missing specialist or hardware evidence must remain visible.

## Embedded devices, firmware, and IoT

Inventory processor/board and firmware versions, boot chain, OS/RTOS, radios, network/serial/USB interfaces, debug ports, provisioning, credentials, local storage, companion apps, fleet/cloud services, and update/recovery paths. Review device identity, authorized configuration and interfaces, data protection, update controls, and security-state reporting. Decommissioning must account for retained credentials and data. [NIST IR 8259A](https://csrc.nist.gov/pubs/ir/8259/a/final).

Review authenticated update and boot trust where required, key custody, image authenticity, version/rollback policy, recovery integrity, and resilience to interrupted updates. A signed vulnerable image can remain dangerous; define safe recovery separately from unrestricted downgrade. Test rejection of unauthorized images and interrupted-update behavior only on a suitable disposable rig or simulator. Protect, detect, and recover are separate properties. [NIST SP 800-193](https://csrc.nist.gov/pubs/sp/800/193/final).

Assess memory and resource limits, command authentication, replay, exposed maintenance interfaces, default/shared credentials, and insecure device-to-cloud assumptions. Interpret physical access and tamper-resistance claims against actual attacker capabilities. Source review cannot establish resistance to invasive hardware attacks without relevant evidence.

## Robotics, OT, and physical systems

Include sensors, controllers, actuators, operator interfaces, remote maintenance, engineering tools, safety mechanisms, network segmentation, and recovery procedures. Document physical hazards and an appropriate safe state before runtime tests. Security and functional safety interact but are not interchangeable certifications.

Prefer simulation or an approved test environment for malformed commands, replay, timing, sensor manipulation, degraded connectivity, and recovery. Do not blindly apply an IT-style fail-closed rule where it can create a hazardous physical state; preserve designed safety controls and assess the effect of loss of authorization or communications. Never issue production actuation or disruptive scans without authorization covering those effects. [NIST SP 800-82 Rev. 3](https://csrc.nist.gov/pubs/sp/800/82/r3/final); check later publication status before use.

## Verification matrix

| Component | Security tests and evidence |
| --- | --- |
| Mobile app | Packaged manifest/entitlements and storage review; inter-app caller tests; links/WebViews; supported device/OS checks. |
| Desktop/CLI | Least-privileged caller and hostile-file cases; IPC boundaries; search-path/config precedence; secure install/update verification. |
| Extension | Untrusted page/content-script/workspace to privileged-host actions; message validation and permission scope. |
| Native parser | Valid/malformed input regression; bounded fuzzing and supported sanitizers; resource limits and crash triage. |
| Driver/runtime | Privilege-transition and isolation checks on an approved VM/rig; no host loading of unknown code. |
| Firmware/device | Image/config inspection, update authenticity and recovery, interface authorization, replay and resource tests on a rig. |
| OT/robotics | Simulation of adversarial/degraded inputs and safe-state behavior, with explicit limits on real-world inference. |

Keep static configuration evidence, emulator/simulator results, and physical-device observations distinct. An unavailable device or build variant is a verification gap, not a reason to drop the component.
