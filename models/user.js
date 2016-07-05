var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*  Properties we care about:
    provier, id, username
    All but ID are strings */

var userSchema = new Schema({
    provider    : String,
    id          : Number,
    username    : String
    },
    {collection: 'fccnlca-users'}
);

module.exports = mongoose.model('User', userSchema);