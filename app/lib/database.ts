import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://againle:Hkhz319319@cluster0.y4a5qol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function addData( message : string ) {
  try {
    await client.connect();
    const database = client.db("database_1");
    const collection = database.collection("test_db");
    const result = await collection.insertOne({ message: message , createdAt: new Date() });
    console.log(`Document inserted with _id: ${result.insertedId}`);

    const results = { _id: result.insertedId, message: message};
    return results;
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

export async function getData() {
  try {
    await client.connect();
    const database = client.db("database_1");
    const collection = database.collection("test_db");
    const allDocs = await collection.find({}).toArray();
    console.log("All documents in test_db collection:", allDocs);
    return allDocs;
  } catch (err) {
    console.error(err);
  }
}

export async function deleteData(id : string ) {
  try {
    await client.connect();
    const database = client.db("database_1");
    const collection = database.collection("test_db");
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      console.log(`Successfully deleted document with _id: ${id}`);
      return "204";
    } else {
      console.log(`No document found with _id: ${id}`);
      return "404";
    }
  } catch (err) {
    console.error("Error deleting document:", err);
  }
}

