const express = require('express');
const dns = require('dns');
const { snippetRouter } = require('./routes/snippet');
const { userRouter } = require('./routes/user');
const { default: mongoose } = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());
app.use("/api", userRouter);
app.use("/api", snippetRouter);


dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
]);
const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT;
mongoose.connect(DB_URL).then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server started at address: http://localhost:${PORT}`);
    })
})
.catch((err)=>{
    console.log("Error while connecting to the database: " + err);
})