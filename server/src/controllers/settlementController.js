const prisma = require("../config/prisma");

const createSettlement = async (req, res) => {
  try {
    const {
      groupId,
      payeeId,
      amount
    } = req.body;

    const settlement = await prisma.settlement.create({
      data: {
        groupId,
        payerId: req.user.userId,
        payeeId,
        amount: Number(amount)
      }
    });

    return res.status(201).json({
      success: true,
      message: "Settlement recorded successfully",
      settlement
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getGroupSettlements = async (req, res) => {
  try {
    const { groupId } = req.params;

    const settlements = await prisma.settlement.findMany({
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
        payee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.status(200).json({
      success: true,
      settlements
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createSettlement,
  getGroupSettlements
};