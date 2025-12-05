import { createCamundaClient, ProcessDefinitionId } from "@camunda8/orchestration-cluster-api";
import { faker } from '@faker-js/faker';
import { TrackingOrderService } from "./TrackingOrderService.js";

const camunda = createCamundaClient();

const NUM_INSTANCES = 1; // Set this to the number of instances you want to create

async function main() {
  for (let i = 0; i < NUM_INSTANCES; i++) {
    const order = createRandomOrder();
    const p = await camunda.createProcessInstance({
    processDefinitionId: "orderProcess" as ProcessDefinitionId,
      variables: {...order},
    });
    console.log(`Process instance: ${p.processInstanceKey} started`);
  }
}

console.log("Starting worker trackOrderStatus...");
camunda.createJobWorker({
  jobType: 'trackOrderStatus',
  maxParallelJobs: 1,
  jobTimeoutMs: 30_000,
  jobHandler: async (job) => {
    console.log(`Handling job: ${job.jobKey} ${job.type}`);
    await TrackingOrderService.trackOrderStatus();
    console.log(`Handling job: ${job.jobKey} Order status tracked successfully`);
    return job.complete();
  },
});

console.log("Starting worker packItems...");
camunda.createJobWorker({
  jobType: "packItems",
  maxParallelJobs: 1,
  jobTimeoutMs: 30_000,
  jobHandler: async (job) => {
    console.log(`Handling job: ${job.jobKey} ${job.type}`);
    await TrackingOrderService.packItems();
    console.log(`Handling job: ${job.jobKey} Items packed successfully`);
    return job.complete()
  },
});

console.log("Starting worker processPayment...");
camunda.createJobWorker({
  jobType: "processPayment",
    maxParallelJobs: 1,
  jobTimeoutMs: 30_000,
  jobHandler: async (job) => {
    console.log(`Handling job: ${job.jobKey} ${job.type}`);
    await TrackingOrderService.processPayment();
    console.log(`Handling job: ${job.jobKey} Payment processed successfully`);
    return job.complete();
  },
});

function createRandomOrder() {
  return {
    orderId: faker.string.alphanumeric(10),
    packaged: false,
    productName: faker.commerce.productName(),
    price: faker.commerce.price(),
    promotionCode: faker.commerce.isbn(),
    material: faker.commerce.productMaterial(),
    department: faker.commerce.department(),
    paymentConfirmation: 'UNCONFIRMED'
  };
}

main().catch(err => console.error(err));
