const mongoose = require('mongoose');

mongoose.connect('mongodb://patilpriyanka0857_db_user45:Priya08@ac-cx3ccya-shard-00-00.pyhaivz.mongodb.net:27017,ac-cx3ccya-shard-00-01.pyhaivz.mongodb.net:27017,ac-cx3ccya-shard-00-02.pyhaivz.mongodb.net:27017/?ssl=true&replicaSet=atlas-14i1m9-shard-0&authSource=admin&appName=Cluster0').then((res)=>{
    console.log("Database onnected successfuly");
}).catch(err=>{
    console.log("Something Error",err);
})

// zUAD14OVKMFEoWCw