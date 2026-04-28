// see, db se interact krne ke liye hum async-await ka use krte hai jaise user.controller ke kaafi saatre function me db hit karana padega,
// information k liye. ab baar-bar hum try catch likhne ki jagah wrappeer function bana le jaise ki asyncHandler. 
// we are craeting this as we don't want to write all those codes like async await,try,catch when connecting with database. in main folder.

// Instead of writing try...catch in every controller, we use this helper.
//If the handler throws an error → passes it to Express error handling (next(err))
const asyncHandler = (requestHandler) => {
   return  (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).   // using promise
        catch((err) => next(err))
    }
}
export {asyncHandler}






/*
YOU CAN USE THIS AS A WRAPPER FUNCTION (try catch wala) BUT FOR NOW WE'LL USE ABOVE WRAPPER FUNCTION (promise wala)

-> asyncHandler 1 higher order function [aisa fun. jo as a parameter doosra fun. accept kare or a function that returns another function]
   hai like this : asyncHandler = (fn) => {},
   yaha pr asyncHandler ek normal fun. that const asyncHandler = () => {} pr jaise hi isne doosra fun. as a pasrameter accept kiya:
   asyncHandler = (fn) => {}, ye ek HOF bun gya.
-> ab jo fun. humne accept kiya usko further ek fun. me pass krdiya : const asyncHandler = (fn) => { () => {} } or asyncHandler = (fn) => () => {}
    
-> NOTE: kyuki humne arrow fun. likha without curly braces i.e. "asyncHandler = (fn) => () => {}"  --> isiliye Javascript automatically returns 
        whatever follows the arrow, we call it as implicit return -> lekin hum ise explicit return v bana sakte hai return & {} laga ke, like this:
 
const asyncHandler = (fn) => {
    // We explicitly return a new function
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            res.status(error.code || 500).json({ ... });
        }
    };
};

The first => returns the entire async (req, res, next) => { ... } function.

-> kyuki db ke liye wrapper bna rahe toh async chahiye : const asyncHandler = (fn) => async() => {} 
-> hum jb is async fun "async() => {}"  ko run karaenge toh jo humne function pass karaya i.e. "fn" usme se (req,res,next) extract kar lenge
   like this :   const asyncHandler = (fn) => async(req,res,next) => {}
-> further mujhe try-catch v chahiye, kyuki hamara wrapper async aur try-catch ka hone wala hai like this:
    const asyncHandler = (fn) => async(req,res,next) => {
       try{
       
       } catch (){
        
       }
    
    }
-> try ke andr humne jo fun. accept kiya as a parameter i.e. "fn" , use execute karo        


const asyncHandler = (fn) => async(req,res,next) => {  // using try catch
    try {
        await fn(req,res,next)
    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
}***********
                                             |
                                            _|_
 --> Ab bhai sahab aap controller ke functions ko isse wrap kar doge --> 2 tarike hai
     A. Using a Named Function

    // 1. Define the logic first
    const myLogic = async (req, res) => {
        // registration code here...
    }

    // 2. Wrap it
    const registerUser = asyncHandler(myLogic);     
____________________________________________________________________________________
    B. The "On-the-Fly" Way

    const registerUser = asyncHandler(async (req, res) => {
        // registration code here...
    });

                                             |
                                            _|_

    pr ab nya question ki: You see async in the wrapper and async in the controller and think: "Why do I need both?"
 -> The async inside registerUser is there because your database operations need it. Inside your controller, you are using:

                                                await User.findOne(...)

                                                await uploadOnCloudinary(...)

                                                await User.create(...)

 -> you cannot use the keyword await unless the function it is inside is marked as async.

*/