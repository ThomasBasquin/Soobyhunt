import { useContext } from "react";
import { UrlContext } from "../../Services/UrlProvider";

const useUrl = () => useContext(UrlContext);

export default useUrl;
