import { v2 as cloudinary} from "cloudinary";
import fs from 'fs'
import { loadEnvFile } from "process";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });
  

  const uploadOnCloudinary=async( localFilepath )=>{
 try {
    if(!localFilepath) return null

    //else upload the file on cloudinary

    const response =await cloudinary.uploader.upload(localFilepath,{
        resource_type:"auto"
    })
    // file has been uploaded succesfully

    console.log("lesgoooo uploaded neggar on cloudinary",response.url);
    return response 
 } catch (error) {
      fs.unlinkSync(localFilepath) //removes the locally saved tempors=ary file from the server
      return null
    
 }
  }