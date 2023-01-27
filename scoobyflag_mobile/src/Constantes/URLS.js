const DEFAULT_DOMAINS={
    LOCAL:"https://127.0.0.1:8000/api",
    PROD:""
}

const DOMAIN=DEFAULT_DOMAINS.LOCAL;

const URLS={
    login:DOMAIN+"/login_check",
    register: DOMAIN+"/register",
}

export default URLS;