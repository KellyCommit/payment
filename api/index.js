const express = require('express');
const cors = require('cors');
const dotenv  = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth');
const userRoute  = require('./routes/users');
const paymentRoute =  require('./routes/payments');
const transferRoute = require('./routes/transfers');
const monnifyRoute = require('./routes/monniapi');
const monnifyTransfer = require('./routes/transfers_v2');
const orderRoute = require('./routes/orders');

dotenv.config()
const app =  express();
const port = process.env.PORT ||  5001;
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_URL;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB).then(()=>console.log('Database Connected Sucessfully'));
};
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/payments",paymentRoute);
app.use("/api/v1/transfers",transferRoute);
app.use("/api/v1/monnify",monnifyRoute);
app.use("/api/v2/monify", monnifyTransfer);
app.use("/api/v1",orderRoute);

app.listen(port,()=>{
    console.log('Api connected successfully');
});