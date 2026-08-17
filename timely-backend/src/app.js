const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { env } = require("./config/env");

const { notFound, errorHandler } = require(
  "./middleware/error.middleware"
);

const apiRoutes = require("./routes");

const authRoutes = require(
  "./modules/auth/auth.routes"
);

const taskRoutes = require(
  "./modules/tasks/task.routes"
);

const customerRoutes = require(
  "./modules/customers/customer.routes"
);

const dashboardRoutes = require(
  "./modules/dashboard/dashboard.routes"
);

const reminderRoutes = require(
  "./modules/reminders/reminder.routes"
);

const app = express();

// ==========================================
// CORS
// ==========================================

const corsOptions = {
  credentials: true,

  origin(origin, callback) {
    if (
      !origin ||
      env.corsOrigins.length === 0 ||
      env.corsOrigins.includes(origin)
    ) {
      return callback(null, true);
    }

    const error = new Error(
      "Origin is not allowed by CORS"
    );

    error.statusCode = 403;

    return callback(error);
  },
};

// ==========================================
// Security & Middleware
// ==========================================

app.disable("x-powered-by");

app.use(helmet());

app.use(cors(corsOptions));

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

app.use(cookieParser());

if (env.nodeEnv !== "test") {
  app.use(morgan("dev"));
}

// ==========================================
// Routes
// ==========================================

app.use(
  "/api/v1/auth",
  authRoutes
);

app.use(
  "/api/v1/tasks",
  taskRoutes
);

app.use(
  "/api/v1/customers",
  customerRoutes
);

app.use(
  "/api/v1/dashboard",
  dashboardRoutes
);

app.use(
  "/api/v1/reminders",
  reminderRoutes
);

// ==========================================
// General API Routes
// ==========================================

app.use(
  "/api/v1",
  apiRoutes
);

// ==========================================
// Error Handling
// ==========================================

app.use(notFound);

app.use(errorHandler);

module.exports = app;