const express = require("express");

const connectToMongoDB = require("./db/mongoose");

const PORT = process.env.PORT || 3000;

const app = express();
connectToMongoDB();

app.use(express.json());

app.use("/api/users/",require("./routes/api/users"));

app.get("/",(req,res)=>{
    res.json({"msg":"Welcome"});
});

app.listen(PORT,()=>{
    console.log("Server started on port "+PORT+"!");
});