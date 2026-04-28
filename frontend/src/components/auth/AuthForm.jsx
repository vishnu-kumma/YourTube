/*
 # switches the UI between Login and Signup
 const [isLogin, setIsLogin] = useState(true);
--> humne  !isLogin  condition  ka use kiya hai to hide or show extra fields.
----------------------
# Because you set the default to true, the code "thinks" like this when the page first loads:

1."Okay, isLogin is true." 2."I will show the Login title." 3."I will hide the Avatar/Full Name fields."
--> "If the user clicks Submit, I will go into the if (isLogin) block and call the Login API."

How it "Knows" to change --> When the user clicks "Sign up":

1. setIsLogin(!isLogin) runs.  2.!true becomes false.
--> Now, isLogin is false. The UI physically changes (fields appear), and the handleSubmit logic flips to the else block.
----------------------
#  The handleSubmit Logic (The "Decision Maker")
const handleSubmit = async (e) => {
  e.preventDefault(); // Stop page refresh

  if (isLogin) { 
    // IF THE SWITCH IS SET TO TRUE:
    // Only look for username/email/password
    await apiService.login(...) 
  } 
  else { 
    // IF THE SWITCH WAS FLIPPED TO FALSE:
    // Create a big package (FormData) including photos and names
    await apiService.register(...) 
  }
}
*/

import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { PlayCircleIcon } from '../common/Icons';

/*
{ onLogin }--> It is a Prop. 

1.The Connection: In App.jsx, you have this line: <AuthForm onLogin={login} />.
2.The Meaning: App.jsx is passing its own login function (from the useAuth hook) down to the AuthForm.
3.By writing {onLogin},the AuthForm says, I'm expecting a tool from my parent called onLogin. I'll take it & use it when I'm done with the API call.

*/
const AuthForm = ({ onLogin }) => { 
  const [isLogin, setIsLogin] = useState(true); // When this is true, the form is in Login mode. When false, it's Signup mode.

  // While we can put files in state, but we'll avoid it for this reasons: 1.Memory Performance[heavy data]
  const [formData, setFormData] = useState({
    username : '',
    email    : '',
    password : '',
    fullname : ''
  });
  
  // it shows the circular spinner when true and also disabled the btn so that user can't click again in order to prevent duplicate a/c.
  const [loading, setLoading] = useState(false);
  // Users can't see your code's catch block. They need to see a message on the screen.
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');


/*
Step 1,AuthForm.jsx,"You create an object { username, email, password } and pass it to apiService.login().
Step 2,apiService.login,It receives that object and names it credentials. It then passes it into the body of makeRequest.
Step 3,makeRequest,It receives the URL and an options object. That options object now contains your credentials (converted to a JSON string).
Step 4,fetch,The built-in browser function finally sends that data to the server.

NOTE:- What is stored in "response"
When you call await apiService.login(...), the makeRequest function does return response.json(). This means response 
is a JavaScript Object that the backend server sent back to you.Typically it looks like this, well it is decided by bacend code btw
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
    try {
      if (isLogin) {
        const response = await apiService.login({
          username: formData.username || formData.email,
          email: formData.email,
          password: formData.password
        });
        onLogin(response.data.user); // Accessing the specific data. Also -->it triggers login(userData) inside useAuth.
      } else {
        // FormData: Because you can't send "Files" (like the Avatar or Cover Image) as simple JSON text.
        // FormData is like a physical envelope where you can put both a letter (text) and a Polaroid photo (image file).
        const form = new FormData();
        form.append('username', formData.username);
        form.append('email', formData.email);
        form.append('password', formData.password);
        form.append('fullname', formData.fullname);
       

        // We didn't use the formData state to get the images. Instead, we reached directly into the HTML using the ID:
        const avatarInput = document.getElementById('avatar');
        if (avatarInput?.files[0]) {
          form.append('avatar', avatarInput.files[0]);
        }
       
        const coverImageInput = document.getElementById('coverImage');
        if (coverImageInput?.files[0]) {
          form.append('coverImage', coverImageInput.files[0]);
        }

        await apiService.register(form);
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-form-container">
        <div className="upload-header">
          <div className="upload-icon">
            <PlayCircleIcon className="h-8 w-8 text-white" />
          </div>
          <h2>{isLogin ? 'Welcome Back!' : 'Join YourTube'}</h2>  {/* using "Ternary Operator" to change the text based on the mode. */}
          <p>{isLogin ? 'Sign in to continue your journey' : 'Create your account to get started'}</p>
        </div>

        {error && (
          <div className={`error-message ${error.includes('successful') ? 'success-message' : ''}`}>
            <span>{error}</span>
          </div>
        )}

        <form className="upload-form" onSubmit={handleSubmit}>
          {!isLogin && (  // isLogin is true, this whole block is skipped. The user never sees it.
            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input
                id="fullname"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullname}
                onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          {!isLogin && ( // ye tbhi appear  hoga when the user is signing up because Login doesn't require uploading photos.
            <>
              <div className="form-group">
                <label htmlFor="avatar">Profile Picture</label>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="coverImage">Cover Image (Optional)</label>
                <input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="upload-submit-btn"
            disabled={loading}// It gray-outs the btn so the user can't click "Submit" 5 times while waiting for the server. This prevents creating 5 duplicate accounts by accident!
          >
            {loading ? (
              <div className="upload-loading">
                <div className="spinner"></div>
                Please wait...
              </div>
            ) : (
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>
        </form>

        <div className="auth-footer" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            {/* When clicked, it flips isLogin from true to false (or vice versa), which causes the whole file to re-run and show the different fields. */}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: '#9333ea',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;