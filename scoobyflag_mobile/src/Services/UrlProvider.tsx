import {createContext, Provider} from "react";
import useServer from "../Constantes/Hooks/useServer";

export const AuthContext= createContext(null);

interface IProps{
    children:any
}

export const UrlContext = createContext<any>(null);

export function UrlProvider({children}:IProps){
    const [{server}, setServer] = useServer();

    const DEFAULT_API_DOMAINS={
        LOCAL:"https://scoobyhunt.fr",
        HUGO:"https://scoobyhunt.fr",
        PROD:""
    }
    
    const API_DOMAIN=DEFAULT_API_DOMAINS.LOCAL;
    const GAME_DOMAIN="https://"+server;
    
    const GAME={
        joinGame: GAME_DOMAIN+"/user/join",
        ready: GAME_DOMAIN+"/user/{user}/ready",
        putPosition: GAME_DOMAIN+"/user/{userId}/position",
        team: GAME_DOMAIN+"/team",
        changeTeam:GAME_DOMAIN+"/user/{user}/team/{team}",
    };
    
    const API={
        getTemplate: API_DOMAIN+"/game/{game}",
    };

    return (
        <UrlContext.Provider value={{GAME,API}}>
            {children}
        </UrlContext.Provider>
    )
}

export default UrlProvider;