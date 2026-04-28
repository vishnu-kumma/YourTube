class ApiResponse{
    constructor(
        statusCode,
        data,
        message ="Success"
    ){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success= statusCode < 400
    }
}

export {ApiResponse}

/*
 
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "65f1abc...",
      "username": "coder_king",
      "email": "hello@example.com",
      "fullname": "Alex Doe",
      "avatar": "https://cloudinary.com/path/to/image.jpg",
      "coverImage": "...",
      "watchHistory": [...]
    },
    "accessToken": "ey...",
    "refreshToken": "ey..."
  },
  "message": "User logged in successfully",
  "success": true
}

*/