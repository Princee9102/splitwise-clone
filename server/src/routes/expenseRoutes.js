const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addExpense,
  getGroupExpenses,
  getGroupBalances,
  getDashboardSummary
} = require("../controllers/expenseController");

// Add Expense
router.post(
  "/add",
  authMiddleware,
  addExpense
);

// Get All Expenses of a Group
router.get(
  "/group/:groupId",
  authMiddleware,
  getGroupExpenses
);

// Get Balance Summary of a Group
router.get(
  "/balances/:groupId",
  authMiddleware,
  getGroupBalances
);

// Dashboard Summary
router.get(
  "/dashboard/:groupId",
  authMiddleware,
  getDashboardSummary
);

module.exports = router;