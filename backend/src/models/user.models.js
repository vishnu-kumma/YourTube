// mongoose ke through humne data modeling (schmea ) define kiya database i.e mongodb ke liye
// jaise react ek library hai waise hi mongoose ek library hai

import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';  // jwt is a bearer token mtlb jiske pass v hai use hum valid user maan ke data ka access de dete hai.
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({

username:{
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim:true,
    index:true,
},

email:{
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim:true,
},
fullname:{
    type: String,
    required: true,
    trim:true,
    index:true,
},

avatar:{
    type: String,
    required:true,
},

coverImage:{
    type:String,
},

watchHistory:[  // for this we need to install "npm i mongoose-aggregate-paginate-v2"
    {
        type:mongoose.Schema.Types.ObjectId,
        ref :"Video"
    }
],

password:{       // we will install bcrypt library : it help you to hash passwords  [npm i bcrypt]
    type: String,
    required:[true, 'Password is required']
},

playlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist"
  }],

refreshToken:{    // for this we install jsonwebtoken [npm i jsonwebtoken] which is a bear token (it's like key jo v token dega use data mil jaega)
	type:String     // we will write code for token in env
},



// User preferences for new user onboarding (Cold Start)
preferences: {
    selectedTags: [{
        type: String,
        lowercase: true,
        trim: true
    }],
    hasCompletedOnboarding: {
        type: Boolean,
        default: false
    }
},

// Computed tag scores (updated periodically or on-demand)
/*
    MAPS --> an object hold key:value pair [order not fix], no duplicacy
 
                        const map = new Map()
                        map.set('In',91)
                        map.set('US',32)
                        map.set('Fr',67)
                        console.log(map);
  
*/
tagScores: {
    type: Map,
    of: Number,
    default: new Map()
}




},{timestamps:true})

// for password encryption we'll use pre which is a hook (let say hum koi data save karwa rahe hai, hum  chahte hai ki save hone se just 
// pehle koi operation perform karwa de.jaise ki password save hone se pehle use encrypt krwa de.) iske liye pre hook ka use krte hai
// as encyption is a complex process(takes time).threfore, async await .pre("event", function (){} )

userSchema.pre("save",async function(next) { 
    // save is event here also we didnt use arrow fun. after save like this: "save", ()=>{ } , infact we use "save", function(){}
    // because arrow fun dont have their own "this"- they inherit it from the parent scope. So, they can't access "current context"
    // like regular functions do with this.
        /*   
            const obj = {
                name: 'John'
                greet: ()=> console.log(this.name)
                greetNormal() {console.log(this.name)}
            }
                obj.greet(); undefined or error
                obj.greetNormal // John 
        */
    if(!this.isModified("password")) return next(); // niche waale do line se kaam ho jata,magar kyuki pre hook hai [user ne kuch v change kiya aur save pr click kiya, toh
    // hook ke wajah se password phir se change ho jaaega] -> pr hum chahte hai ki jb password ko modifiy kiya jaaeye tab hi pre hook run ho, isiliye humne if condition
    // ka use kiya [agr kuch modify hua ki nhi uske liye hume "isModified" milta hai]
    this.password = await bcrypt.hash(this.password,10)
    next()

        /*
            so userSchema.pre need access to"password"  i.e. 
                password:{    
                type: String,
                required:[true, 'Password is required']
                },
            which is define in "userSchema", which is current context, And since arrow function dont have "this" 
            [arrow functions do have a this, but they inherit it from the parent scope] --> that is why we move to regular function.
        */
})

// we'll compare whether encrypted password is same as the original password
userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password,this.password)   // it returns boolean value
}


//  token ke liye hum login function banenge controller me
userSchema.methods.generateAccessToken = function(){         //generateAccesToken=short lived
    return jwt.sign({
        _id: this.id,
        email: this.email,
        username:this.username,
        fullname:this.fullname

    },
    process.env.ACCESS_TOKEN_SECRET,{
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken = function (){      // generateRefreshToken= long lived [hum  refresh token ko hi sirf db me store krte hai na ki access token ko]
     return jwt.sign({
        _id: this.id,
        

    },
    process.env.REFRESH_TOKEN_SECRET,{
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = mongoose.model("User",userSchema)// jab ye databse me store hoga to User -> convert ho jaega lowercase or pulral i.e.users
