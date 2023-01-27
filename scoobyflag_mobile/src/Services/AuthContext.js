import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {createContext,useState,useEffect,useContext} from "react";
import useFetch from "../Constantes/useFetch";

export const AuthContext= createContext();

export function AuthProvider({children}){
    const [userToken, setUserToken] = useState(null);
    const {setUserInfo,removeUserInfo} = useContext(UserContext);//TODO : Faire le reducer user

    async function login(email,password){
        return useFetch(URLS.login,"POST",{email,password}) // TODO : Import URL
        .then(({token,data}) => {
            console.log(token);
            setUserToken(token);
            setUserInfo(data);
            AsyncStorage.setItem("userToken",token);
        })
    }

    async function register(email,firstname,lastname,password){
        return fetch(URLS.register,{
            method:"POST",
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body:JSON.stringify({email,firstname,lastname,password})
        }).then((response)=>{
            if (!response.ok) {
                const error = response.json();
                throw error;
            }
            return response.json();
        }).then((e) => {
            login(email,password);
        })
    }

    function logout(){
        setUserToken(null);
        AsyncStorage.removeItem("userToken");
        removeUserInfo();
    }

    async function isLoggedIn(){
        try{
            let userToken = await AsyncStorage.getItem("userToken");
            setUserToken(userToken);
        }catch(e){
            console.error('Error dans l\'authentification :'+e);
        }
    }

    useEffect(()=>{
        isLoggedIn();
    },[]);

    return (
        <AuthContext.Provider value={{login,logout,userToken,register}}>
            {children}
        </AuthContext.Provider>
    )
}