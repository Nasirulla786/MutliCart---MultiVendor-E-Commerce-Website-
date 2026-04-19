import mongoose from "mongoose";
const URL = process.env.MONGODB_URl || "";
if(!URL){
    throw new Error("URl not found");
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose={
        conn :null,
        promise:null

    }
}

const ConnectDb = async()=>{

    if(cached.conn){
        console.log("Db already connect");
        return cached.conn;
    }
    if(!cached.promise){
        cached.promise = mongoose.connect(URL).then((conn)=>conn.connection);
        console.log("Db connect SuccessFully");
    }

    try {

        const conn = await cached.promise;
        return conn

    } catch (error) {
        console.log("Db error",error);

    }
}

export default ConnectDb;
