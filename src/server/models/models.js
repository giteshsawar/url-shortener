var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    
    local: {
        name: String,
        username: String,
        email: String,
        password: String
    }
});

var UrlSchema = new mongoose.Schema({
    url: String,
    short: String,
    visitor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'visitorList' 
    },
});

var VisitorList = new mongoose.Schema({
    list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'visitors'
    }]
});

var Visitors = new mongoose.Schema({
    ip: String,
    city: String,
    country: String,
    osName: String,
    browserName: String,
    mobileVendor: String,
});

mongoose.model('user', UserSchema);
mongoose.model('url', UrlSchema);
mongoose.model('visitorList', VisitorList);
mongoose.model('visitors', Visitors);
