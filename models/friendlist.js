import mongoose from "mongoose";

const friendListSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    sendRequest:{
        type: Array,
        unique: false,
    },
    pendingRequest:{
        type: Array,
        unique: false,
    },
    friendList: {
        type: Array,
        unique: false,
    }
})

const friendlist = mongoose.model("friendlist", friendListSchema);

export default friendlist