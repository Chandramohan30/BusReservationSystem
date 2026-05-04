const express= require('express');
const app = express();
const dotenv = require('dotenv');
const path =require('path');
const cors = require('cors');

const connectDatabase=require('./config/connectDatabase');

dotenv.config({path:path.join(__dirname,'config','config.env')})

//import the routers
const ticketrouter =require('./routes/ticket');
app.use(cors());
app.use(express.json());
app.use('/api/tickets',ticketrouter)


//db connection
connectDatabase();




app.listen(process.env.PORT,()=>{
    console.log(`Server is listening to ${process.env.PORT} in ${process.env.NODE_ENV}`);
})

