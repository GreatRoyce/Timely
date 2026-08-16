const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.index({
  userId: 1,
  name: 1,
});

module.exports = mongoose.model(
  "Customer",
  customerSchema
);