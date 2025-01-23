import { Camunda8 } from "@camunda8/sdk";
import { faker } from '@faker-js/faker';
import { TrackingOrderService } from "./TrackingOrderService";

const camunda = new Camunda8();
const zeebe = camunda.getZeebeGrpcApiClient();

const NUM_INSTANCES = 1; // Set this to the number of instances you want to create

async function main() {
  for (let i = 0; i < NUM_INSTANCES; i++) {
    const order = createRandomOrder();
    const p = await zeebe.createProcessInstance({
      bpmnProcessId: `orderProcess`,
      variables: {...order},
    });
    console.log(`Process instance: ${p.processInstanceKey} started`);
  }
}

console.log("Starting worker trackOrderStatus...");
zeebe.createWorker({
  taskType: "trackOrderStatus",
  taskHandler: async (job) => {
    console.log(`Handling job: ${job.key} ${job.type}`);
    await TrackingOrderService.trackOrderStatus();
    console.log(`Handling job: ${job.key} Order status tracked successfully`);
    return job.complete();
  },
  //timeout: 15000,
});

console.log("Starting worker packItems...");
zeebe.createWorker({
  taskType: "packItems",
  taskHandler: async (job) => {
    console.log(`Handling job: ${job.key} ${job.type}`);
    await TrackingOrderService.packItems();
    console.log(`Handling job: ${job.key} Items packed successfully`);
    return job.complete()
  },
});

console.log("Starting worker processPayment...");
zeebe.createWorker({
  taskType: "processPayment",
  taskHandler: async (job) => {
    console.log(`Handling job: ${job.key} ${job.type}`);
    await TrackingOrderService.processPayment();
    console.log(`Handling job: ${job.key} Payment processed successfully`);
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

