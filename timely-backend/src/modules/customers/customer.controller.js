const asyncHandler = require("../../utils/asyncHandler");

const {
  createCustomerSchema,
  updateCustomerSchema,
} = require("./customer.validation");

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("./customer.service");

// ==========================================
// Create Customer
// ==========================================

const create = asyncHandler(
  async (req, res) => {
    const data =
      createCustomerSchema.parse(req.body);

    const customer =
      await createCustomer(
        req.user.userId,
        data
      );

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: {
        customer,
      },
    });
  }
);

// ==========================================
// Get Customers
// ==========================================

const getAll = asyncHandler(
  async (req, res) => {
    const customers =
      await getCustomers(
        req.user.userId
      );

    res.status(200).json({
      success: true,
      data: {
        customers,
      },
    });
  }
);

// ==========================================
// Get Customer
// ==========================================

const getOne = asyncHandler(
  async (req, res) => {
    const customer =
      await getCustomerById(
        req.user.userId,
        req.params.id
      );

    res.status(200).json({
      success: true,
      data: {
        customer,
      },
    });
  }
);

// ==========================================
// Update Customer
// ==========================================

const update = asyncHandler(
  async (req, res) => {
    const data =
      updateCustomerSchema.parse(req.body);

    const customer =
      await updateCustomer(
        req.user.userId,
        req.params.id,
        data
      );

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: {
        customer,
      },
    });
  }
);

// ==========================================
// Delete Customer
// ==========================================

const remove = asyncHandler(
  async (req, res) => {
    await deleteCustomer(
      req.user.userId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  }
);

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
};