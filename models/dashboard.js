import mongoose from "mongoose";

const dashboardSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true,
        unique: true 
    },
    likedBooks:{
        type : Array, 
        unique: false,
    },
    completedReadBooks:{
        type: Array, 
        unique: false,
    },
    comentedBooks:{
       type: Array,
       unique: false, 
    },
    currentRead:{
        type: Array, 
        unique: false,
    }
})

const dashboard = mongoose.model("dashboard", dashboardSchema);

export default dashboard