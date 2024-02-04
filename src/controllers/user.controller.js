import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req,res)=>{
    // get user details from frontend.
    // validation -not empty
    // check if user already exists: username, email
    // check for images and avatar
    // if images an available  upload them to cloudinary, check avatar in cloudinary
    // create user object - create entry in db
    // remove password and refresh token from response
    // check for user creation
    // return response

    const {fullname,username,email,password} = req.body;
    if([fullname,username,email,password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required");
    }

    const existedUser = User.findOne({
        // checking both username and email
        $or: [{username},{email}]
    })

    if(existedUser) {
        throw new ApiError(409,"User already exists")
    }

    const avatarLocalpath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.file?.coverImage[0].path;

    if(!avatarLocalpath) throw new ApiError(400,"Avatar file is required")

    const avatar = await uploadOnCloudinary(avatarLocalpath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar) throw new ApiError(400,"Avatar is required")

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500,"Something went wront while registering the user.")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registerd Succesfully")
    )
    
})

export {registerUser}