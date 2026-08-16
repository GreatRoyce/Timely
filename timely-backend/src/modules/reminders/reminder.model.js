const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },

    remindAt: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "scheduled",
        "sent",
        "cancelled",
      ],
      default: "scheduled",
      index: true,
    },

    sentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

reminderSchema.index({
  userId: 1,
  status: 1,
  remindAt: 1,
});

module.exports = mongoose.model(
  "Reminder",
  reminderSchema
);