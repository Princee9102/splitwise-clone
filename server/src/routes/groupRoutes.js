const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createGroup,
  getMyGroups,
  addMember,
  getGroupMembers
} = require("../controllers/groupController");

router.post(
  "/create",
  authMiddleware,
  createGroup
);

router.get(
  "/my-groups",
  authMiddleware,
  getMyGroups
);

router.post(
  "/add-member",
  authMiddleware,
  addMember
);

router.get(
  "/:groupId/members",
  authMiddleware,
  getGroupMembers
);

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Group Route Working"
  });
});

module.exports = router;