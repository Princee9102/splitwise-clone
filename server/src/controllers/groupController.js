const prisma = require("../config/prisma");

const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;

    const group = await prisma.group.create({
      data: {
        name,
        description,
        createdBy: req.user.userId
      }
    });

    await prisma.groupMember.create({
      data: {
        groupId: group.id,
        userId: req.user.userId,
        role: "ADMIN"
      }
    });

    return res.status(201).json({
      success: true,
      message: "Group created successfully",
      group
    });

  } catch (error) {
    console.error("CREATE GROUP ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getMyGroups = async (req, res) => {
  try {
    const groups = await prisma.groupMember.findMany({
      where: {
        userId: req.user.userId
      },
      include: {
        group: true
      }
    });

    return res.status(200).json({
      success: true,
      groups
    });

  } catch (error) {
    console.error("GET MY GROUPS ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const addMember = async (req, res) => {
  try {
    const { groupId, email } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const existingMember = await prisma.groupMember.findFirst({
      where: {
        groupId,
        userId: user.id
      }
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "User already exists in group"
      });
    }

    const member = await prisma.groupMember.create({
      data: {
        groupId,
        userId: user.id,
        role: "MEMBER"
      }
    });

    return res.status(201).json({
      success: true,
      message: "Member added successfully",
      member
    });

  } catch (error) {
    console.error("ADD MEMBER ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;

    const members = await prisma.groupMember.findMany({
      where: {
        groupId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return res.status(200).json({
      success: true,
      members
    });

  } catch (error) {
    console.error("GET GROUP MEMBERS ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createGroup,
  getMyGroups,
  addMember,
  getGroupMembers
};