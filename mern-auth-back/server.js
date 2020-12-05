const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

//set up express
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;


app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

//set up mongoose
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/secret-santa2",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },
    (err) => {
        if (err) throw err;
        console.log("MongoDB connection established")
    }
);

//set up routes

app.use("/users", require("./routes/userRouter"));