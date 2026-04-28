import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express()



/* we mostly use app.use on dealing with middleware or configuration setting . like this : app.use(cors()).  
 # CORS [cross-origin resource sharing]
-> ghar ke andr sbko allow mat karo.[koi v aake data request nhi kar skta]
-> kis url ko aane do kis ko nhi.
-> iske liye we need : app.use(cors())
-> it is a security feature that browser enforce, when a frontend tries to call API, browser first checks if the server allows that request. if yes -> the browser lets 
   the request go through, if not, it blocks the response
-> isme headers hote hai jaise origin: yaha pr wo url de denge jaha se request accept kar skte hai . like this:  app.use(cors({
                                                                                                                      origin: process.enc.CORS_ORIGIN 
                                                                                                                 }))
-> yahr pr hum "CORS_ORIGIN" ko env me define kiya hai waha pr iski value as of now CORS_ORIGIN =* jiska mtlb request khi se v aaye accept kr lo   
-> iske baad hum kuch configuratin karenge, kyuki  data khi se v aa skta hai url se,json se , body se toh uske liye setting like  express.json, express.urlencoded,
   express.static.
-> app.use(cookieParser())   // apne server se user ke browser ka cookie acces kr pau aslo set user cookies
                                                                                                               

 */
// app.use(cors({  
//   origin: "http://localhost:5173",   // your frontend URL
//   credentials: true,                 // allow cookies & Authorization headers
// }));

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://yourtube-backend.vercel.app",
    "https://yourtube-frontend.vercel.app" // Your actual frontend URL
  ],
  credentials: true
}));



// data khi se v aa skta hai url se,json se , body se toh uske liye setting below -> we use app.use() -> as we are setting configuration
app.use(express.json({limit: "16kb"}))                      // json se data accept krne ke liye[jb hum form bharenge] usi tarah se MULTER ka use karenge jb file se data aaega
app.use(express.urlencoded({extended:true,limit:"16kb"}))   // url se data
app.use(express.static("public"))                          // kuch v asi cheeze jo apne hi server pr store krne ke liye

app.use(cookieParser())   // apne server se user ke browser ka cookie acces kr pau aslo set user cookies



// routes import usually upar waale configuration ke baad ho hote hai
import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import likeRouter from './routes/like.routes.js'
import commentRouter from './routes/comment.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'



//routes declaration
app.use("/api/v1/users",userRouter) // let say koi user "/users" type krta hai toh hum use controll denge userRouter ka (user.routes.js)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)


export {app}
/*
-> we need package cookie-parser and cors.
-> we mostly work with express in App.js -> there are lots of object express provide but we mostly need/work with object (req & res). request: me data
   kb-kb kaise aa raha hai.response: ke andr kaise response bhejna hai. request ke andr kaafi saari property hai jaise req.baseUrl, req.body etc. 
   but we mostly need req.params (url se jab v koi data aata hai wo mostly req.params se aata hai [jaise url ke andr question marks etc hote hai ye param se samjhte hai])
   && req.body (body me alg-alg Tarah se data aa sakta hai jaise form me, json me).

-> 

 */