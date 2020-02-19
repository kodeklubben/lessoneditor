const mongoose = require('mongoose');

//Connect to mongodb
mongoose.connect('mongodb+srv://oyvindjt:EYi6WQN9DfPat58@cluster0-psp4u.azure.mongodb.net/test?retryWrites=true&w=majority');

mongoose.connection.once('open', function(){
    console.log("Connection has been made");
}).on('error', function (error) {
    console.log("error");
});
