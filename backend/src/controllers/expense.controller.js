const expenseService =
  require("../services/expense.service");
exports.create = async (req, res) => {
  try {
    const expense =
      await expenseService.createExpense({
        ...req.body,
        groupId: req.params.groupId
      });
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
exports.getAll = async (req, res) => {
  try {
    const expenses =
      await expenseService.getExpenses(
        req.params.groupId,
        req.query
      );
    res.json(expenses);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
exports.getOne = async (req, res) => {
  try {
    const expense =
      await expenseService.getExpense(
        req.params.groupId,
        req.params.expenseId
      );
    res.json(expense);
  } catch (error) {
    res.status(404).json({
      message: error.message
    });
  }
};
exports.update = async (req, res) => {
  try {
    const expense =
      await expenseService.updateExpense(
        req.params.groupId,
        req.params.expenseId,
        req.body
      );
    res.json(expense);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
exports.remove = async (req, res) => {
  try {
    const result =
      await expenseService.deleteExpense(
        req.params.groupId,
        req.params.expenseId
      );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
