import { useState, useEffect, useContext, createContext } from "react";
import axios from 'axios'

const AuthContext = createContext()

export const AuthenticateProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [errors, setErrors] = useState('')
    const [authenticated, setAuthenticated] = useState(false)
    const [expire, setExpire] = useState('')
    const [token, setToken] = useState('')

    const apiUrl = process.env.REACT_APP_API_URL



    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/current-user`, { withCredentials: true });
        const userData = response.data;
    
        if (userData?.user) {
          setUser(userData);
          setAuthenticated(true);
          return true; // Return true if authenticated
        } else {
          setUser(null);
          setAuthenticated(false);
          window.location.href = '/';
          return false; // Return false if not authenticated
        }
      } catch (e) {
        console.log(e);
        setUser(null);
        setAuthenticated(false);
        window.location.href = '/';
        return false; // Return false on error
      }
    }
    

    const login = async (email, password) => {
      try {
        const response = await axios.post(
          `${apiUrl}/api/login`, 
          { manager: { email, password } }, 
          { withCredentials: true }
        );
        setUser(response.data); // 
        setExpire(response.data.cookie.expires)
        console.log(response.data.cookie.expires, 'test expire cookie')
        setToken(response.data.token)
        console.log('data from login', response.data)
        console.log('tets', response)
        setAuthenticated(true);  
        return response.data;
      } catch (e) {
        if (e.response) {
          // Extract the backend error message
          console.log('Backend Error:', e.response.data.error);
          return { error: e.response.data.error };
        } else {
          console.log('Network or Server Error:', e.message);
          return { error: 'An unexpected error occurred. Please try again.' };
        }
      }
    };
    
      

    const logout = async (id) => {
        try{
            const response = await axios.delete(`${apiUrl}/api/logout/${id}`, { withCredentials: true })
            setAuthenticated(false)
            setUser(null)
            console.log(id)
            console.log(response.data)
            return response.data
        }catch(e){
            console.log(e)
        }
    }


    return (
        <AuthContext.Provider value={{login, user, logout, authenticated, checkAuthStatus, expire, token }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}