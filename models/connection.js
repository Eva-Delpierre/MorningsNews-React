var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
        useUnifiedTopology : true
   }
   mongoose.connect(process.env.MONGO_DB,
    options,    
    function(err) {
     console.log(err);
    }
   );

   module.exports = mongoose;