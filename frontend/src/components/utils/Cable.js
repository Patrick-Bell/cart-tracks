import { createConsumer } from "@rails/actioncable";

const cableUrl = "ws://localhost:3000/cable"; // Update if Rails runs on 3000
const consumer = createConsumer(cableUrl);
export default consumer;
