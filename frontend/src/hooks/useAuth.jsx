/*
  -> `useAuth.jsx` — Who Is Logged In ?

  -> This is a **custom hook** . Here's the flow:

  -> On app load → `useEffect` runs `checkAuth()` → calls `GET /users/current-user` → if cookie is valid, stores the user in `useState`
  -> `login(userData)` → just updates that state (API call already happened before this is called)
  -> `logout()` → calls `POST /users/logout` → clears user state + video cache

  The `videoStateManager.clearCache()` on login/logout is just cleaning up any locally cached video progress data.

------------------------below portion is only about how this helper is used in App.jsx ---------------
-->  The Hook (useAuth): Acts as a helper to keep the App.jsx file clean (so you don't have to see the 
  login/logout logic in the main file).The Data Flow: * useAuth fetches the user  gives it to App.
  App then passes it down to Navbar, VideoWatchPage, etc., via Props.
  This is the definition of Lifted State: You "lift" the state to App.jsx so you can distribute it to all the children.

  App.jsx code chek kr bhai to get refernce:-
  1.Instead of writing 30 lines of login/logout/fetch logic inside App.jsx, you have this single line at the very top of your component:
     const { user, loading, login, logout } = useAuth(); // line:16

--> This is the "Helper" in action. All that complex logic inside useAuth.jsx (the useEffect, the apiService.getCurrentUser, etc.)
     is hidden away. App.jsx just says, "Give me the final result."   

  2. The Data Flow (Hook → App)
  --> At this moment, the variable user/loading..etc now exists inside the App component's memory. 

  3. The Data Flow (App → Children via Props)
  --> Once App has that user variable, it "passes it down". like this:-
  # Passing to the Navbar:
  // App.jsx - Around Line 73 & 88
  <Navbar 
    user={user}         // <--- Passing the 'user' variable down!
    onLogout={logout}   // <--- Passing the 'logout' function down!
    ...
  />

      # Passing to the VideoWatchPage:
      // App.jsx - Around Line 80
      <VideoWatchPage 
        video={selectedVideo}
        user={user}         // <--- Passing 'user' down again!
        ...
      />

  # Passing to the Dashboard:
    // App.jsx - Around Line 106
  {activeTab === 'dashboard' && user && <Dashboard user={user} />} 
  // Here, you pass 'user' to the Dashboard component.

*/
import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { videoStateManager } from '../utils/videoStateManager';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

/*

Hamare useAuth.jsx, me: --> const [user, setUser] = useState(null) iska mtlb -->Initially, user is null.

1.When you call onLogin(response.data.user) in your AuthForm, it triggers login(userData) inside useAuth.
2.setUser(userData) updates the state with that big object (containing username, avatar, etc.).  

3.In App.jsx: That function updated the user state. Because App.jsx is using that hook, it "hears" the change and re-renders.
if (!user && activeTab === 'auth') {
    return <AuthForm onLogin={login} />;
  }

Before Login: user is null and activeTab is 'auth'. This condition is true, so you see the Login screen.
After Login: user is now an object {...}. The condition !user becomes false. The Login screen disappears instantly.

--> Once the user is logged in, App.jsx starts "feeding" that user data to other components so they can use it. See how user is passed as a prop everywhere:

* <Navbar user={user} ... /> (So the Navbar can show your avatar).
* <VideoWatchPage user={user} ... /> (So you can comment/like).
* <Dashboard user={user} /> (So it knows whose stats to show).


*/


  const checkAuth = async () => {
    try {
      // Since you are just asking the server "Who am I?", you don't need to send a body (like you do with a registration form or login credentials).
      const response = await apiService.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.log('Not authenticated');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
/*
Why no apiCall for login:-
The UI Component (LoginForm.jsx): Handles the form submission, calls apiService.login(credentials), gets the user
data back from the server, and then tells the hook: "Hey, the login was successful! Here is the user data, 
please update the global state."

The Hook (useAuth.js): Receives that data via the login(userData) function and updates the user state so the rest 
of the app knows someone is logged in.

# The Login Lifecycle
1.The User Action: The user types their email/password into your AuthForm and clicks "Sign In."
2.The API Call: Inside AuthForm.jsx, your handleSubmit triggers apiService.login(). This talks to the server.
3.The Server Response: The server says "Password correct!" and sends back the user data.

4.Handing off to the Hook: You call onLogin(response.data.user).
5.Note: In your parent component (like App.jsx), onLogin is likely linked directly to the login function from your useAuth hook.
6.Updating Global State: The useAuth hook receives that user data, saves it to the user state, and clears the video cache.
*/
  const login = (userData) => {
    setUser(userData);
    // Clear any old cache when user logs in
    videoStateManager.clearCache();
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      // Clear all cached states on logout
      videoStateManager.clearUserCache();
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local state
      setUser(null);
      videoStateManager.clearUserCache();
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { user, loading, login, logout, checkAuth };
};