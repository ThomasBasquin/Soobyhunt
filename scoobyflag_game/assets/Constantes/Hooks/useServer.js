import { useDispatch, useSelector } from "react-redux";
import {setServer as setServerRedux} from "../../Services/reducers/serverSlice";


export default function useServer(){
    const server = useSelector((state) => state.serverSlice);
    const dispatch = useDispatch();

    function setServer(server){
        dispatch(setServerRedux(server));
    }

    return setServer(server);
}