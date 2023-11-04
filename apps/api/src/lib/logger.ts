import pino from "pino";
import dotenv from "dotenv";
dotenv.config();

export const logger = pino(
  { level: "info" },
  pino.transport({
    target: "@axiomhq/pino",
    options: {
      dataset: process.env.AXIOM_DATASET,
      token: process.env.AXIOM_TOKEN,
    },
  })
);
