const mongoose = require('mongoose');

const conn = mongoose.connect("mongodb://localhost:27017/backend", { useNewUrlParser: true, useUnifiedTopology: false }).then(() => {
    console.log("Connection Successfull")
}).catch((err) => console.log(err));

module.exports = conn;
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/node-file-upl', {useNewUrlParser: true});
// var conn = mongoose.connection;
// conn.on('connected', function() {
//     console.log('database is connected successfully');
// });
// conn.on('disconnected',function(){
//     console.log('database is disconnected successfully');
// })
// conn.on('error', console.error.bind(console, 'connection error:'));
// module.exports = conn;