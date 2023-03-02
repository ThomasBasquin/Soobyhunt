import { useDispatch, useSelector } from "react-redux";
import { setVilain as setVilainRedux } from "../../Services/reducers/vilainSlice";
import IVilain from "../interfaces/vilain";

export default function useVilain(){
    const vilain:IVilain[] = useSelector((state:any) => state.vilainSlice);
    const dispatch = useDispatch();

    function setVilain(vilains:IVilain[]){
        dispatch(setVilainRedux(vilains));
    }

    return [vilain as IVilain[] ,setVilain as (vilain:IVilain[])=>void] as const;
}