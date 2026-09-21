const balanceService =
  require("../services/balance.service");
const settlementService =
  require("../services/settlement.service");
exports.getBalances = async (req, res) => {
  try {
    const balances =
      await balanceService.calculateBalances(
        req.params.groupId
      );
    res.json(balances);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
exports.create = async (req, res) => {
  try {
    const settlement =
      await settlementService.createSettlement(
        req.params.groupId,
        req.body.fromMember,
        req.body.toMember,
        req.body.amount
      );
    res.status(201).json(settlement);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
exports.history = async (req, res) => {
  try {
    const history =
      await settlementService.getHistory(
        req.params.groupId
      );
    res.json(history);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
exports.suggestions = async (req, res) => {
  try {
    const suggestions =
      await settlementService.getSuggestions(
        req.params.groupId
      );
    res.json(suggestions);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
