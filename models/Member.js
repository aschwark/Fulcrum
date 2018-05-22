const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Posts SubDoc
const PostSchema = new Schema({
    note:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }
});

//Create Member Schema
const MemberSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    position:{
        type: String
    },
    organization:{
        type: String
    },
    expertise:{
        type: String,
        required: true
    },
    connection:{
        type: String,
        required: true
    },
    languages:{
        type: String
    },
    telephone:{
        type: String
    },
    whatsapp:{
        type: Boolean
    },
    location:{
        type: String
    },
    email:{
        type: String
    },
    commitment:{
        type: String,
        required: true
    },
    posts:[PostSchema],        
    user:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

MemberSchema.index({'$**': 'text'});

mongoose.model('post', PostSchema);
mongoose.model('member', MemberSchema);