const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    dueTime: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({
  userId: 1,
  dueDate: 1,
});

taskSchema.index({
  userId: 1,
  status: 1,
});

module.exports = mongoose.model(
  "Task",
  taskSchema
);