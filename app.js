const cors= require('cors')
const path = require('path');
const express = require('express');
const session= require('express-session')
const cookieParser = require('cookie-parser');
const apiRoute= require('./routes/api.routes.js')
const { handleDatabaseConnection }= require('./services/connection.js')
const { apiReqLogger }= require('./middlewares/logger-api-req.middleware.js')


const app = express()
const PORT = 8000

const URL= "mongodb+srv://DFICinfodakshifoundation:123456789DFICinfodakshifoundation123456789@dfic.5dagz.mongodb.net/DFIC-Database?retryWrites=true&w=majority&appName=DFIC"

async function connectMongoDB(URL){
    try{
        await handleDatabaseConnection(URL)
        console.log("MongoDB Database connected successfully.")
    }catch(err){
        console.error("Error in connecting MongoDB Database."+ err)
    }
}
connectMongoDB(URL)


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'FrontEnd/dist')));
app.use(express.urlencoded({ extended: true }));  
app.use(cookieParser());


app.use(session({
    secret: '1234567890qwertyuiopqasxzxcvbnmkloitdghjhgfdgrbrfgufghfuh',
    resave: false,
    saveUninitialized: true,
    cookie: {secure : false }
}))


app.use("/", apiReqLogger,apiRoute)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'FrontEnd/dist', 'index.html'));
});



app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
});
