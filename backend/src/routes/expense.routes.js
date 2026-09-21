const router = require("express").Router();
const controller =
  require("../controllers/expense.controller");
router.post(
  "/:groupId/expenses",
  controller.create
);
router.get(
  "/:groupId/expenses",
  controller.getAll
);
router.get(
  "/:groupId/expenses/:expenseId",
  controller.getOne
);
router.put(
  "/:groupId/expenses/:expenseId",
  controller.update
);
router.delete(
  "/:groupId/expenses/:expenseId",
  controller.remove
);
module.exports = router;
