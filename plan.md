# Upgrade Plan: backend (20260920194721)

- **Generated**: 2026-09-21 19:47:21
- **HEAD Branch**: N/A
- **HEAD Commit ID**: N/A

## Available Tools

**JDKs**
- JDK 21: C:\Program Files\Java\jdk-21\bin (current project JDK; used for baseline validation)
- JDK 25: **<TO_BE_INSTALLED>** (required by step 3)

**Build Tools**
- Maven Wrapper: 3.9.16 (project-managed via `.mvn/wrapper/maven-wrapper.properties`)

## Guidelines

> Note: You can add any specific guidelines or constraints for the upgrade process here if needed, bullet points are preferred.

- Upgrade to the latest LTS Java runtime supported by the project and toolchain.
- Prefer the smallest compatible change set that preserves project behavior.
- Use the project Maven wrapper when available.

## Options

- Working branch: appmod/java-upgrade-20260920194721
- Run tests before and after the upgrade: true

## Upgrade Goals

- Java 25

## Technology Stack

| Technology/Dependency | Current | Min Compatible Version | Why Incompatible |
| ---------------------- | ------- | ---------------------- | --------------- |
| Java | 21 | 25 | User requested Java 25 LTS |
| Spring Boot | 4.1.1 | 4.1.1 | Compatible with Java 21+; no required framework upgrade for Java 25 |
| Maven Wrapper | 3.9.16 | 3.9.16 | Wrapper already matches modern Java LTS toolchain requirements |
| Spring Boot Maven plugin | managed | managed | Supported under Java 25 with Spring Boot 4.x |

## Derived Upgrades

- Java 25 LTS requires the project to compile and run with the Java 25 JDK.
- Spring Boot 4.1.1 is already aligned with Java 21+ and does not require an intermediate framework jump.
- No code-level namespace migration is required because the project is already on Boot 4.x and Java 21 target.

## Impact Analysis

### Subsection: Dependency Changes

| File | Dependency | Current | Action | Target | Reason |
|------|-----------|---------|--------|--------|--------|
| backend/pom.xml | java.version | 21 | upgrade | 25 | User requested Java 25 LTS |

### Subsection: Source Code Changes

| File | Location | Current | Required Change | Reason |
|------|----------|---------|----------------|--------|
| None required | - | - | No source migration required | Spring Boot 4.1.1 already uses Java 21+ compatible APIs |

### Subsection: Configuration Changes

| File | Property/Setting | Current | Required Change | Reason |
|------|------------------|---------|-----------------|--------|
| backend/pom.xml | java.version | 21 | set to 25 | Required for Java 25 runtime |

### Subsection: CI/CD Changes

| File | Location | Current | Required Change |
|------|----------|---------|----------------|
| None found | - | - | No CI/CD files reference the Java target version in this project |

### Subsection: Risks & Warnings

- The project already targets Java 21 and Spring Boot 4.1.1, so the runtime upgrade is low risk and mainly changes the JDK target property. **Mitigation**: confirm the wrapper and runtime compile under Java 25 and run the full test suite.
- Maven wrapper version 3.9.16 is current enough for Java 25; no additional build-tool upgrade is expected. **Mitigation**: validate with `./mvnw clean test` using the Java 25 runtime.

## Upgrade Steps

- Step 1: Install Java 25 Runtime
  - **Rationale**: The project is already on Java 21 and requires the latest LTS JDK to compile and test under the user-specified target.
  - **Changes to Make**: Install Java 25 in a writable user location and confirm it is discoverable via `#appmod-list-jdks`.
  - **Verification**: `#appmod-list-jdks`; expected result: JDK 25 is present and selectable as the active runtime.

- Step 2: Setup Baseline
  - **Rationale**: Establish the current project behavior before the runtime switch so the change is measured and the test baseline is known.
  - **Changes to Make**: Run `cd backend && ./mvnw.cmd -q clean compile test-compile` and `cd backend && ./mvnw.cmd -q clean test` using the installed Java 21 runtime.
  - **Verification**: Command with JDK 21; expected result: compile passes and all tests pass before the upgrade, or any failures are explicitly recorded as pre-upgrade issues.

- Step 3: Set Java 25 Runtime and Validate
  - **Rationale**: The only required compatibility change for this project is the Java target version to 25. This step keeps the project minimal while validating the runtime upgrade.
  - **Changes to Make**: Update `backend/pom.xml` from `java.version` 21 to 25; run `cd backend && ./mvnw.cmd -q clean test` with JDK 25 as `JAVA_HOME`.
  - **Verification**: Command uses JDK 25; expected result: project compiles and all tests pass under Java 25.

- Step 4: Final Validation
  - **Rationale**: Guarantee the production and test code compile and pass completely under the target runtime.
  - **Changes to Make**: Resolve any remaining issues until the full Maven suite passes cleanly.
  - **Verification**: `cd backend && ./mvnw.cmd -q clean test`; expected result: 100% pass rate under Java 25.
