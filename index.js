const express = require("express");
const { connectDataBase } = require("./DataBase/connect");
const { router: AuthRouter } = require("./Routes/auth.routes");
const dotenv = require("dotenv");

dotenv.config();
const DATABASEURL = process.env.MONGOURL;
const PORT = process.env.PORT;
const app = express();

app.use(express.json());

app.use("/api/auth", AuthRouter);

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Internal server Error";

  return res.status(status).json({ message });
});

const startServer = async () => {
  try {
    await connectDataBase(DATABASEURL);
    app.listen(PORT, () => {
      console.log("The server is running");
    });
  } catch (error) {
    console.log("failed to Connect the server", error);
  }
};

startServer();
