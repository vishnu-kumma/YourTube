import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/*
    const uploadOnCloudinary = async () => {
        try{
        
        } catch (){
        
        }
        
    }  
*/

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        // Upload file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // resource type : ki image aa raha hai, video aa raha hai, auto means khud hi detec kr lo
        });
        
            // Try to delete local file (with error handling)
            try {
                const fs = await import('fs');
                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }
            } catch (deleteError) {
                console.warn("Could not delete local file:", deleteError.message);
            }
        
        return response;
        
    } catch (error) {
        
        try {
            const fs = await import('fs');
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
        } catch (deleteError) {
            console.warn("Could not cleanup local file after error:", deleteError.message);
        }
        
        return null;
    }
}

export { uploadOnCloudinary };

/*
-> is file ke through hum server se local path lenge--> aur use cloudinary par daal denge 

--> A/C to documentation:- Only these lines required to setup cloudinary ;- buyt we write more optimized code 
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
   cloudinary.uploader
  .upload("my_image.jpg")
  .then(result=>console.log(result)); 
  
 

*/

