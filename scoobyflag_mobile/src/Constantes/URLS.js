const DEFAULT_API_DOMAINS={
    LOCAL:"http://172.20.10.11:8000",
    HUGO:"http://192.168.1.27:8001",
    PROD:""
}

const DEFAULT_GAME_DOMAINS={
    LOCAL:"http://172.20.10.11:8000",
    HUGO:"http://192.168.1.27:8000",
    PROD:""
}

const API_DOMAIN=DEFAULT_API_DOMAINS.HUGO;
const GAME_DOMAIN=DEFAULT_GAME_DOMAINS.HUGO;

const URLS={
    getTemplate: API_DOMAIN+"/game/{game}",
}

export default URLS;