// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, {createContext,useState,useEffect,useContext} from "react";
// import IUser from "../Constantes/interfaces/user";
// import URLS from "../Constantes/URLS";
// import useFetch from "../Constantes/useFetch";

// export const AuthContext= createContext(null);

// interface IProps{
//     children:any
// }

// export function AuthProvider({children}:IProps){

//     async function login(email:string,password:string){
//         return useFetch(URLS.login,"POST",{email,password}) // TODO : Import URL
//         .then(({data}) => {
//             // setUserInfo(data);
//         })
//     }

//     async function register(email:string,firstname:string,lastname:string,password:string){
//         return fetch(URLS.register,{
//             method:"POST",
//             headers:{
//                 Accept: "application/json",
//                 "Content-Type": "application/json"
//             },
//             body:JSON.stringify({email,firstname,lastname,password})
//         }).then((response)=>{
//             if (!response.ok) {
//                 const error = response.json();
//                 throw error;
//             }
//             return response.json();
//         }).then((e) => {
//             login(email,password);
//         })
//     }

//     function logout(){
//         //TODO : dispatch change user
//     }

//     async function isLoggedIn(){
//         try{

//         }catch(e){
//             console.error('Error dans l\'authentification :'+e);
//         }
//     }

//     useEffect(()=>{
//         isLoggedIn();
//     },[]);

//     return (
//         <AuthContext.Provider value={{}}>
//             {children}
//         </AuthContext.Provider>
//     )
// }