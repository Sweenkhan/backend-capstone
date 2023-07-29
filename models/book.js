import mongoose from "mongoose";
 
const bookSchema = new mongoose.Schema({
     
    title:{
        type: String,
        required: true,
        unique: true
    },
    author:{
        type: String, 
        required: true,
        unique: false
    },  
     image:{
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    bookType:{
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true
    },
     
})

 
const book = mongoose.model("Book", bookSchema); 
export default book