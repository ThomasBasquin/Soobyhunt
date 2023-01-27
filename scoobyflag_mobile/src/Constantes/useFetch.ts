import AsyncStorage from "@react-native-async-storage/async-storage";

type IFetchMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";

const HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

async function checkStatus(response: Response) {
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }  
  return await response.json();
}

export default async function useFetch(
  url: string,
  method: IFetchMethod = "GET",
  body: any,
  extraHeaders = {},
  extraParams = {}
) {
  if (method === "GET" && body)
    console.error("Une requête GET ne peut pas contenir de body.");

  const userToken = await AsyncStorage.getItem("userToken");
  
  const JSON_HEADERS = userToken ? { ...HEADERS, "Authorization": "Bearer " + userToken } : { ...HEADERS};
  
  return fetch(url, {
    method: method,
    body: JSON.stringify(body),
    headers: { ...JSON_HEADERS, ...extraHeaders },
    ...extraParams,
  })
    .then(checkStatus)
    .catch((error: Error) => {
      return Promise.reject(error);
    });
}
