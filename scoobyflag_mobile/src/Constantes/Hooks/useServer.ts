import { useDispatch, useSelector } from "react-redux";
import {setServer as setServerRedux} from "../../Services/reducers/serverSlice";
import IServer from "../interfaces/IServer";

export default function useServer(){
    const server:IServer = useSelector((state:any) => state.serverSlice);
    const dispatch = useDispatch();

    function setServer(server:IServer){
        dispatch(setServerRedux(server));
    }

    return [server as IServer,setServer as (user:IServer)=>void] as const
}