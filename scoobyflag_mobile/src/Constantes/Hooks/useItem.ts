import { useDispatch, useSelector } from "react-redux";
import { setItem as setItemRedux } from "../../Services/reducers/itemSlice";
import IItem from "../interfaces/IItem";

export default function useItem(){
    const item:IItem[] = useSelector((state:any) => state.itemSlice);
    const dispatch = useDispatch();

    function setItem(item:IItem[]){
        dispatch(setItemRedux(item));
    }

    return [item as IItem[] ,setItem as (item:IItem[])=>void] as const;
}