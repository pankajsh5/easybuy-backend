const dotenv = require("dotenv").config(); // for environment variables.
const express = require("express"); // express is a framework
const mongoose = require("mongoose"); // for MongoDB connection.
const cors = require("cors"); // CORS for connection between frontend and backend.
const cookieParser = require("cookie-parser"); // cookieParser for user authentication.
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const errorHandler = require("./middleware/errorMiddleware");

const app = express()

//MiddleWares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended : false}));
app.use(
    cors({
        origin: ["http://localhost:3000", "https://shopitoapp.vercel.app"],
        credentials: true,
        optionsSuccessStatus: 204,
    })
);


// Routes
app.use("/api/users" , userRoute);
app.use("/api/products" , productRoute);

app.get("/", (req, res) => {
    res.send("Home page...")
})

//Error Middleware
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => console.log(err)); 
