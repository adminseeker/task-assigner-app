const express = require("express");

const connectToMongoDB = require("./db/mongoose");

const PORT = process.env.PORT || 3000;

const app = express();
connectToMongoDB();

app.use(express.json());

app.use("/api/users/",require("./routers/api/users"));
app.use("/api/auth/",require("./routers/api/auth"));
app.use("/api/rooms/",require("./routers/api/rooms"));
app.use("/api/upload/",require("./routers/api/upload"));

app.get("/",(req,res)=>{
    res.json({"msg":"Welcome"});
});

app.listen(PORT,()=>{
    console.log("Server started on port "+PORT+"!");
});