const express = require("express");
const cors = require("cors");
const groupRoutes =
  require("./routes/group.routes");
const memberRoutes =
  require("./routes/member.routes");
const expenseRoutes =
  require("./routes/expense.routes");
const settlementRoutes =
  require("./routes/settlement.routes");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/groups", groupRoutes);
app.use("/api/groups", memberRoutes);
app.use("/api/groups", expenseRoutes);
app.use("/api/groups", settlementRoutes);
app.get("/health", (req, res) => {
  res.json({
    status: "OK"
  });
});
module.exports = app;
