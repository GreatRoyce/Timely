const express = require("express");

const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/users/user.routes");
const orderRoutes = require("../modules/orders/order.routes");
const customerRoutes = require("../modules/customers/customer.routes");
const reminderRoutes = require("../modules/reminders/reminder.routes");
const notificationRoutes = require("../modules/notifications/notification.routes");
const dashboardRoutes = require("../modules/dashboard/dashboard.routes");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Timely API is running",
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/orders", orderRoutes);
router.use("/customers", customerRoutes);
router.use("/reminders", reminderRoutes);
router.use("/notifications", notificationRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
