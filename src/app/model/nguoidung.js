const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

   
    MaSinhVien:{
        type: Number,
        require: true
    },
    MaGiangVien:{
        type: Number,
        require: true
    },
    MaQuyen:{
        type: String
    },
    MatKhau: {
        type: String,
        require: true
    },
  

});
module.exports = mongoose.model("User", userSchema);