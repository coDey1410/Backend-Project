import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser = asyncHandler(async (req,res)=>{

    // res.status(200).json({
    //     message:"ok"
    // })
     //get user details from frontend / postman
     //validation of the user details
     // check if the user already exists:using username,email
     //check for images,avatar
     //upload them to cloudinary
     //create user object -create entry in DB
     // remove password and refresh token field from response
     //check for user creation
     //return response

     const {fullName,email,username,password}=req.body                                //getting the details
     console.log("email",email)

     if (
        [fullName,email,username,password].some((field)=>field?.trim==="")             //checks if any one of the detail is empty. Validation of the user details
     ) 
     {
        throw new ApiError(400,"All fields are Required")
     }
    //  if(fullname===""){
    //     throw new ApiError(400,"Full Name is Required")
    //  }

    const existedUser=await User.findOne({                                                 //checking the user existence
        $or: [{email},{username}]
    })

    if(existedUser)
    {
        throw new ApiError(409,"account exists")
    }
    const avatarLocalPath= req.files?.avatar[0]?.path;                                   //checking avatar and cover image path 
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath)
    {
        throw new ApiError(400,"Avatar file is required")
    } 

   const avatar =  await uploadOnCloudinary(avatarLocalPath)
   const coverImage =  await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar)
   {
    throw new ApiError(400,"Avatar file is required")
   }

   const user=await User.create({                                            //connects the DB
    fullName,
    avatar:avatar.url,
    coverImage: coverImage?.url||"",
    email,
    password,
    username:username.toLowerCase()
   })

   const createdUser= await User.findById(user._id).select(
    "-password -refreshToken"                                                       //fields we dont want to show 
   )
   if(!createdUser){
    throw new ApiError(500,"something went wrong  while registering a user!")
   }

   return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully")
   )

})

export {registerUser}