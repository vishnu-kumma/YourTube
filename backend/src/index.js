import dotenv from 'dotenv'; // instead of require('dotenv').config({path: './env'})
import connectDB from "./db/index.js";

dotenv.config({ 
 path: './.env'
});

// asynchronous task: is basically task which takes time to execute and if is taking time you are not bound to wait for it you can do other task. Eg:infinite scroll,Story uploads
//                                                                                               |
/* connectDB fun. humne db folder ke index.js file me define kiya hai -> kyuki connectDB 1 asyncronus fun. hai toh iske completion pr ek promise
   return hoga isiliye ab sirf connectDB nhi likhenge , ab --> 
   connectDB()
   .then()
   .catch()    
   overall,    connectDB()
               .then(()=>{

                    // Handle Express-level errors before listening
                    app.on("error", (error) => {
                        console.log("EXPRESS ERROR: ", error);
                        throw error;
                    });

                    app.listen(process.env.PORT || 8000 , ()=>{
                        console.log(`Server is running at port : ${process.env.PORT}`)
                    })
                })
                .catch((err)=>{
                    console.log(""Application failed to start:",err);
                    })       
 -> below we didn't write app.listen because we have are using vercel and Vercel does not run a traditional server that stays "ON" 24/7 waiting for requests.
    Instead, it uses Serverless Functions.
    1) When a request hits your Vercel URL, Vercel's infrastructure sees your exported app (from app.js).
    2) It "wakes up" your code, passes the request into your Express app, gets the response, and then goes back to sleep.
    3) Vercel handles the port binding and listening for you. It essentially ignores app.listen() if it's there   
 -> This might be a problem locally:because, on a local machine, there is no "Vercel magic" to keep the process alive.
     You need that app.listen() to keep the Node.js process running.                                                          
*/

connectDB()  
 .then(() => {
 console.log("✅ MongoDB connected successfully");
 })
 .catch((err) => {
 console.error("❌ MongoDB connection failed", err);
 });

//-------------------------------------------------------------------------------------------
/*

Database connection
-> Mongodb atlas:- it is sub service of mongodb --> provide online database
-> for db we must need package -> dotenv, express, mongoose
-> database connecion 2 tarike se ho skata hai. 1) kyuki hum sbse Pehle idex file ko hi execute karane waale hai, node/nodemon ke through,
   toh sara ka sara code index.js me rakh de aur jaise hi index file load ho toh db connection wala code/function turant hi execute kara de. 
   2) koi db naam ka folder banade aur us ke andr database connection ka code/function likh de aur phir index.js file me import karau aur execute kara du.
-> code structure: jab v database ki baat aaye to try,catch aur async await lagana chahiye.
-> agr mongoose documnentation pdhe toh 1 line me db connect ho jaega i.e. mongoose.connect("iske andr string phir / lagake  db name etc.")


                                1st APPROACH

* iify -> hamare function ko immediately execute ka do i.e. ()() NOTE: pehle 
        waale () me function likhe hai jaise (()=>{})() . ab kyuki database
        waale kaam hai toh async bana do function ko, is tarah se (async()=>{})().
        ab database ke liye try catch jruri hai, is trah se 

                            (async ()=>{
                                try{
                                
                                } catch (error) {
                                
                                }
                            })()
      -> generally log iffy ko semiColon se start krte hai ;()() kyuki agr purane
         wale code me semicolon nhi laga hai toh problem ho skat hai isiliye.

      ()() --iify-->  ( ()=>{} )()  --> (async()=>{})()

# This is first approach where we define db connection code in main ->index.js
       
(async()=>{
    try{

await mongoose.connect(`${process.env.MONGODB_URI/${DB_NAME}}`)
console.log("Connected to MongoDB successfully!");

    }catch(error){
        console.error("ERROR: ",error)
        throw err
    }
    })()

#
-> isi approach me [yani ki index.js me db & server] kbhi-knhi log app ko v initilaize kar lete hai, jo express se bnti hai.
  "nesting your Express server startup inside the database connection logic is a best practice in Node.js development.
   It ensures that your application doesn't start listening for web requests until it has successfully established a connection to your database. 
   If the database is down, the server shouldn't be "up" because it won't be able to function correctly."
   like this:

   import express from 'express';
   const app = express()

(async()=>{
    try{
    await mongoose.connect (`${process.env.MONGODB_URI}/${DB_NAME}}`)
    console.log("Connected to MongoDB successfully!");

    <--connect ke niche listener [jo koi event listen kare jaise 'error event'] -->
    <-- db toh connect ho gya, pr kya pta hamari express ki app hai wo baat nhi kr pa rahi hai-->
    
    app.on("error", (error)=>{
       console.error("EXPRESS ERROR: ", error);
        throw error;
    })
        
    <--agr error nhi toh app.listen-->

app.listen(process.env.PORT , () =>{
    console.log("App is listening on port $ {process.env.PORT}")
    
    })

} catch(error){
     console.error("DATABASE CONNECTION ERROR: ", error);
        process.exit(1); // Exit the process with failure
    }
    
    })()


            THOUGH we'll use 2nd APPROACH which is in db/index.js file as main wala index.js file crowded ho jaata hai.
            -> isiliye humne db coonection wala method khi aur define kiya aur yaha pr usse import kar diya.
            -> db/index.js me hume connectDB function ban diya -> toh techinaclly agr hum apne main index.js me simply
               connectDB call de like this connectDB() toh run karna chahiye [pr kyuki hmara connectDB 1 asyncronus function hai toh, aur jb asyncronus function complete
               hota hai toh 1 promise return krta hai -> isiliye -> connectDB().then().catch()]. hum kya chahte hai jasise hi hamara 
               applicatiion load ho, waise hi jldi se jitni vi environment variable hai -> hr jagah available ho jaaye -> kyuki agar main file me availabel ho gye ->
               toh sabko uska access mil jaega, jo first file load hoti hai, hum kosis krte hai ki whi pr env  load ho jaaye like this
                | require('dotenv').config({path : './env'}) | 
            -> is 'require' syntax se koi problem nhi hai pr hr jagah hum 'import' wala syntax use kr rahe hai --> toh code ki consistency ke liye hum 'require'
               ko 'import' me convert karenge like this --> import dotenv from 'dotenv' and dotenv.config() -> kyuki config 1 method hai ye 1 object lega -> hum
               isme 1 path as a object use kr lenge like this --> dotenv.config({path: './env'}) . pr ye dono kaafi nhi hai 'import' syntax ko use krne k liye,
               hum apne package.json me jaaenge aur scipt me kuch chize add karenge {-r dotenv/config --experimental-json-modules} , overall it will look like this:
                                            "scripts": {
                                                    "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
                                                }, 



*/
