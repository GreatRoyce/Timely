const AppError = require("../../utils/AppError");
const Customer = require("./customer.model");

// ==========================================
// Create Customer
// ==========================================

const createCustomer = async (userId, customerData) => {
  const { name, phone } = customerData;

  const customer = await Customer.create({
    userId,
    name,
    phone,
  });

  return customer;
};

// ==========================================
// Get All Customers
// ==========================================

const getCustomers = async (userId) => {
  const customers = await Customer.find({
    userId,
  }).sort({
    createdAt: -1,
  });

  return customers;
};

// ==========================================
// Get Single Customer
// ==========================================

const getCustomerById = async (
  userId,
  customerId
) => {
  const customer = await Customer.findOne({
    _id: customerId,
    userId,
  });

  if (!customer) {
    throw new AppError(
      "Customer not found",
      404
    );
  }

  return customer;
};

// ==========================================
// Update Customer
// ==========================================

const updateCustomer = async (
  userId,
  customerId,
  customerData
) => {
  const customer = await Customer.findOne({
    _id: customerId,
    userId,
  });

  if (!customer) {
    throw new AppError(
      "Customer not found",
      404
    );
  }

  Object.assign(customer, customerData);

  await customer.save();

  return customer;
};

// ==========================================
// Delete Customer
// ==========================================

// ==========================================
// Delete Customer
// ==========================================

const deleteCustomer = async (
  userId,
  customerId
) => {
  const customer =
    await Customer.findOne({
      _id: customerId,
      userId,
    });

  if (!customer) {
    throw new AppError(
      "Customer not found",
      404
    );
  }

  // Prevent deleting a customer that
  // still has tasks attached to them.
  const taskCount =
    await Task.countDocuments({
      customerId: customer._id,
      userId,
    });

  if (taskCount > 0) {
    throw new AppError(
      "Customer cannot be deleted while they have tasks",
      409
    );
  }

  await customer.deleteOne();

  return customer;
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};