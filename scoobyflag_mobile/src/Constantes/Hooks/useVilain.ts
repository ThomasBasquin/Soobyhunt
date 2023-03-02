import { useDispatch, useSelector } from "react-redux";
import { setVilains as setVilainRedux } from "../../Services/reducers/vilainSlice";
import IVilain from "../interfaces/vilain";

export default function useVilain(){
    const vilain:IVilain[] = useSelector((state:any) => state.vilainSlice);
    const dispatch = useDispatch();

    function setVilain(vilain:IVilain[]){
        dispatch(setVilainRedux(vilain));
    }

    return [vilain as IVilain[] ,setVilain as (vilain:IVilain[])=>void] as const;
}