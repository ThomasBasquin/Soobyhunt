import { useDispatch, useSelector } from "react-redux";
import IUser from "../interfaces/user";
import {setUser as setUserRedux} from "../../Services/reducers/userSlice";

export default function useUser(){
    const user:IUser = useSelector((state:any) => state.userSlice);
    const dispatch = useDispatch();

    function setUser(user:IUser){
        dispatch(setUserRedux(user));
    }

    return [user as IUser ,setUser as (user:IUser)=>void] as const
}