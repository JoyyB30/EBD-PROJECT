const express = require("express");
const cors = require("cors");

const authorizationRoutes = require("./routes/authorization");
const purchaseRoutes = require("./routes/purchases");
const saleRoutes = require("./routes/sales");
const loanRoutes = require("./routes/loanRequests");
const summaryRoutes = require("./routes/summary");
const banksRoutes = require("./routes/banks");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/authorization", authorizationRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/banks", banksRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "API is running" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

module.exports = app;