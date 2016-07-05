var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = require('./user.js').schema; //Don't forget the .schema

/*  Properties we care about:
    id, token, name, screen_name, location, description
    All but ID are strings */


var patronSchema = new Schema({
    listingId   : String,
    patrons     : [UserSchema], //Allows us to add an array of Users (i.e. patrons)
    },
    {collection: 'fccnlca-users'}
);

/*  We are allowed to write methods to Schemas
    http://mongoosejs.com/docs/guide.html#methods */

module.exports = mongoose.model('Patrons', patronSchema);