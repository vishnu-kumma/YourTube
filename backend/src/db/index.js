import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


// either go with try/catch or promise (resolve,reject) to handle error.
// always use async - await (db is far from us) when you interact with database as it take time
const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST:${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("MONGODB connection error ",error);
        process.exit(1)
    }
}


export default connectDB;

/*
 
Database connection
-> Mongodb atlas:- it is sub service of mongodb --> provide online database
-> for db we must need package -> dotenv, express, mongoose
-> database connecion 2 tarike se ho skata hai. 1) kyuki hum sbse Pehle idex file ko hi execute karane waale hai, node/nodemon ke through,
   toh sara ka sara code index.js me rakh de aur jaise hi index file load ho toh db connection wala code/function turant hi execute kara de. 
   2) koi db naam ka folder banade aur us ke andr database connection ka code/function likh de aur phir index.js file me import karau aur execute kara du.
-> code structure: jab v database ki baat aaye to try,catch aur async await lagana chahiye.
-> agr mongoose documnentation pdhe toh 1 line me db connect ho jaega i.e. mongoose.connect("iske andr string phir / lagake  db name etc.")

                        THIS IS 2ND APPROACH -> FIRST APPROACH CODE IN MAIN INDEX.JS -> THOUGH IN THIS WE'LL USE 2ND APPROACH

                        jaha pr hum sirf database se connection karenge express wala kaam nhi aur yaha se export kar denge is function ko main
                        index.js me wha se call karenge. NOTE: yaha hum iifi use nhi kar rahe kyuki immediate call nhi karna humne ye
                        function ko index.js me call karna hai, hume yaha se connectDB export karan hai.

*/
