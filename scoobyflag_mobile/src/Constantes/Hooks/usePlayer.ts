import { useDispatch, useSelector } from "react-redux";
import { setPlayer as setPlayerRedux } from "../../Services/reducers/playerSlice";
import IPlayer from "../interfaces/player";

export default function usePlayer(){
    const player:IPlayer[] = useSelector((state:any) => state.playerSlice);
    const dispatch = useDispatch();

    function setPlayer(player:IPlayer[]){
        dispatch(setPlayerRedux(player));
    }

    return [player as IPlayer[] ,setPlayer as (player:IPlayer[])=>void] as const;
}