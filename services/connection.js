const mongoose= require('mongoose')

exports.handleDatabaseConnection= async (URL)=>{
    try{
        await mongoose.connect(URL)
    }catch(err){
        console.error("Error in connecting Database: "+err.message)
        throw err
    }
}