# c8-develop-workers-nodejs-lab
# Camunda 8 - Develop Workers (TypeScript SDK) - Lab

Lab project for the **[Camunda 8 - Develop Workers (TypeScript SDK)](https://academy.camunda.com/c8-develop-workers-nodejs)** course on Camunda Academy.

This course gives a detailed hands-on experience in developing workers with the Camunda TypeScript SDK. During the course, you review core and advanced job worker behavior, including timeout handling, variable fetching, and job completion patterns.

> **Difficulty:** Intermediate | **Time:** ~1h 30min | **Platform:** Camunda 8.9+

## What you will learn

- Describe how job workers implement business logic in Camunda 8
- Understand how a Camunda job worker activates, completes, and fails jobs
- Recognize and configure important worker settings such as timeout and parallelism
- Implement worker logic that returns output variables on job completion
- Run a TypeScript worker application against a deployed BPMN process

## Overview

The **Order Process** (`orderProcess`) is a BPMN process with three service tasks executed by TypeScript job workers:

| Job Type | Worker Location | Description |
|---|---|---|
| `trackOrderStatus` | `index.ts` + `TrackingOrderService.ts` | Tracks the order status and simulates a 10-second delay |
| `packItems` | `index.ts` + `TrackingOrderService.ts` | Handles item packaging |
| `processPayment` | `index.ts` + `TrackingOrderService.ts` | Processes payment and returns a confirmation value |

When the application starts, it creates one randomized process instance and registers three workers to handle the service tasks in `order.bpmn`.

## Prerequisites

### Knowledge

- Awareness of Camunda and job workers
- Competent with BPMN
- Competent with Node.js and TypeScript basics

Recommended preparatory courses:

- [Camunda - Technical Overview](https://academy.camunda.com/c8-technical-overview)
- [Camunda - Develop your first job worker (Java)](https://academy.camunda.com/c8-develop-first-worker-java)
- [Camunda - Error Handling](https://academy.camunda.com/c8-error-handling)

### Tools & Access

- Node.js 20+
- npm 10+
- TypeScript 6.x
- An IDE such as VS Code
- A [Camunda 8 SaaS account](https://academy.camunda.com/c8-h2-create-account) with a running [cluster](https://academy.camunda.com/c8-h2-create-cluster) and [client credentials](https://academy.camunda.com/c8-h2-create-client-credentials)

## Configuration

This project uses `createCamundaClient()` from `@camunda8/orchestration-cluster-api`, which reads configuration from environment variables.

For Camunda 8 SaaS, set these variables before running the lab:

| Variable | Description |
|---|---|
| `CAMUNDA_REST_ADDRESS` | Base REST address of the orchestration cluster |
| `CAMUNDA_AUTH_STRATEGY` | Authentication mode, typically `OAUTH` |
| `CAMUNDA_CLIENT_ID` | OAuth client ID |
| `CAMUNDA_CLIENT_SECRET` | OAuth client secret |
| `CAMUNDA_OAUTH_URL` | OAuth token endpoint, typically `https://login.cloud.camunda.io/oauth/token` |
| `CAMUNDA_TOKEN_AUDIENCE` | Token audience, typically `zeebe.camunda.io` |
| `CAMUNDA_DEFAULT_TENANT_ID` | Optional tenant override |

Example:

```bash
export CAMUNDA_REST_ADDRESS="https://<your-cluster-url>"
export CAMUNDA_AUTH_STRATEGY="OAUTH"
export CAMUNDA_CLIENT_ID="<your-client-id>"
export CAMUNDA_CLIENT_SECRET="<your-client-secret>"
export CAMUNDA_OAUTH_URL="https://login.cloud.camunda.io/oauth/token"
export CAMUNDA_TOKEN_AUDIENCE="zeebe.camunda.io"
```

If you downloaded credentials from Camunda Console, you may see older `ZEEBE_*` names in the generated file. This project uses the newer `CAMUNDA_*` names expected by the Orchestration Cluster API client.

## Install

```bash
npm install
```

## Build

```bash
npx tsc
```

This compiles the TypeScript sources to JavaScript files in the project root because no separate output directory is configured in `tsconfig.json`.

## Run

```bash
node index.js
```

> **Before running:** deploy `order.bpmn` to your cluster using Camunda Modeler or Web Modeler.

The application will:

1. Create one process instance with randomized order variables.
2. Start three job workers for `trackOrderStatus`, `packItems`, and `processPayment`.
3. Complete each job using the logic in `TrackingOrderService.ts`.

## Project Structure

```text
.
├── index.ts               # Entry point: creates client, workers, and a process instance
├── TrackingOrderService.ts # Business logic invoked by all workers
├── order.bpmn             # BPMN process definition
├── package.json           # Project metadata and dependencies
├── tsconfig.json          # TypeScript compiler configuration
└── README.md              # Lab documentation
```

## Dependencies

| Library | Version | Purpose |
|---|---|---|
| `@camunda8/orchestration-cluster-api` | `^9.1.0` | Camunda 8 Orchestration Cluster API client |
| `@faker-js/faker` | `^10.4.0` | Random test data generation for order variables |
| `typescript` | `^6.0.3` | TypeScript compiler |
