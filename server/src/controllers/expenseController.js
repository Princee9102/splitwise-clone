const prisma = require("../config/prisma");

const addExpense = async (req, res) => {
  try {
    const {
      groupId,
      description,
      amount,
      splitType,
      splits
    } = req.body;

    const expense = await prisma.expense.create({
      data: {
        description,
        amount: Number(amount),
        splitType,
        groupId,
        payerId: req.user.userId
      }
    });

    if (splits && splits.length > 0) {
      await prisma.expenseSplit.createMany({
        data: splits.map(split => ({
          expenseId: expense.id,
          userId: split.userId,
          amount: Number(split.amount)
        }))
      });
    }

    return res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await prisma.expense.findMany({
      where: {
        groupId
      },
      include: {
        payer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        splits: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.status(200).json({
      success: true,
      count: expenses.length,
      expenses
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getGroupBalances = async (req, res) => {
  try {
    const { groupId } = req.params;
    const members = await prisma.groupMember.findMany({
  where: { groupId },
  include: {
    user: {
      select: {
        id: true,
        name: true
      }
    }
  }
});

const userMap = {};

members.forEach(member => {
  userMap[member.user.id] = member.user.name;
});
    const expenses = await prisma.expense.findMany({
      where: {
        groupId
      },
      include: {
  splits: true,
  payer: {
    select: {
      id: true,
      name: true
    }
  }
}

    });

    const balances = {};

    expenses.forEach(expense => {

    if (!balances[expense.payer.name]) {
    balances[expense.payer.name] = 0;
    }

    balances[expense.payer.name] += expense.amount;

    expense.splits.forEach(split => {
      if (!split.userId) return;

  const userName = userMap[split.userId];

    if (!userName) return;

  if (!balances[userName]) {
  balances[userName] = 0;
  }

balances[userName] -= split.amount;
  });

  });
    delete balances.undefined;
    
    return res.status(200).json({
      success: true,
      balances
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await prisma.group.findUnique({
      where: {
        id: groupId
      }
    });

    const totalMembers = await prisma.groupMember.count({
      where: {
        groupId
      }
    });

    const expenses = await prisma.expense.findMany({
      where: {
        groupId
      }
    });

    const settlements = await prisma.settlement.findMany({
      where: {
        groupId
      }
    });

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const totalSettlements = settlements.reduce(
      (sum, settlement) => sum + settlement.amount,
      0
    );

    return res.status(200).json({
      success: true,
      dashboard: {
        groupName: group?.name,
        totalMembers,
        totalExpenses,
        totalSettlements,
        totalExpenseRecords: expenses.length,
        totalSettlementRecords: settlements.length
      }
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  addExpense,
  getGroupExpenses,
  getGroupBalances,
  getDashboardSummary
};