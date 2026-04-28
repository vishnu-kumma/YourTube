import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp")  // --> in cb[callback] we give folder name where we keep all files. Use /tmp for Vercel compatibility
  },
  filename: function (req, file, cb) {
    // Add timestamp to avoid filename conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname) // yaha pr agr file ka naam jo user ne diya hai whi chahiye uske liye originalname
  }
})

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Changed from 50MB to 5MB limit
  }
})

/*
Multer is a middleware that hepls you to handle file uploads. When a web form sends a file (like a photo/document), data comes
in special format called multipart/form-data. Multer saves the file on your server[disk storage or mmeory storage] and then gives
you a object that you can work on.
--> WHY we use it:- It saves you from writing low-level parsing code: you get a simple API like upload.single('avatar') or 
    upload.array('photos').
--> under the hood multer uses another library 'busboy' to parse the multipart data.
--> Disk storage:-    upload files on your server's hard drive. choose this when you need the file later.[or need to serve the file directly
                       from your server].
--> Memory storage:-  keeps the file in RAM as a buffer. The data disapperas as soon as request finishes.

NOTE: you can write your own middleware to handle file upload, but for the sake of simplicity, we grab Multer
      or another library like express-fileupload to save time.
   
*/









