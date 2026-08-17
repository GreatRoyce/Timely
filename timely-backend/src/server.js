const {
  env,
  assertServerEnv,
} = require("./config/env");

const app = require("./app");
const connectDB = require("./config/db");

const {
  startReminderJob,
} = require("./jobs/reminder.job");

const startServer = async () => {
  try {
    assertServerEnv();

    await connectDB();

    startReminderJob();

    app.listen(env.port, () => {
      console.log(
        `Timely API running on http://localhost:${env.port}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );

    process.exitCode = 1;
  }
};

startServer();