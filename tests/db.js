const mongoose = require ('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongod = null;
module.exports.connect = async () => {
    mongod = await MongoMemoryServer.create();
    const uri = await mongod.getUri();
    const mongooseOpts = {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    };
    await mongoose.connect (uri, mongooseOpts);
    }
    // disconnect and close connection
module.exports.closeDatabase = async ()=>{
    await mongoose. connection.dropDatabase();
    await mongoose. connection.close();
    await mongod. stop();
}
module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];

        await collection.deleteMany().then(function(){
        }).catch(function(error){
            console.log(error); // Failure
        })

    }
}
