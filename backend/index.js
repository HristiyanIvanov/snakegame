const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const gameRoutes = require("./routes/gameRoutes");

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use("/api", gameRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
