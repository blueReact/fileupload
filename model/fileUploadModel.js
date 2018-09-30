var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fileUploadSchema = new Schema({
    created: {
        type: Date,
        default: Date.now()
    },
    title: {
        type: String,
        trim: true
    },
    destination: {
        type: String,
        trim: true
    },
    fileType: {
        type: String,
        trim: true
    }
});


module.exports = mongoose.model('FileUpload', fileUploadSchema);

