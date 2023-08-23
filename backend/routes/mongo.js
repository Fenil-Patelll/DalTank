const {MongoClient} = require('mongodb');

const options = {useNewUrlParser: true, useUnifiedTopology: true};
const uri = process.env.MONGO_URI || '';


const client = new MongoClient(uri, options);

async function connectToDB() {
    try {
        await client.connect();
        return client.db('Web');
    } catch (error) {
        console.error(error);
    }
}

async function closeConnection() {
    try {
        await client.close();
    } catch (error) {
        console.error(error);
    }
}

module.exports = {connectToDB, closeConnection};
