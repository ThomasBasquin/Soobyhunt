const DEFAULT_DOMAINS={
    LOCAL:"http://172.20.10.11:8000",
    HUGO:"http://192.168.1.27:8000",
    PROD:""
}

const DOMAIN=DEFAULT_DOMAINS.HUGO;

const URLS={
    getTemplate: DOMAIN+"/game/{game}",
}

export default URLS;