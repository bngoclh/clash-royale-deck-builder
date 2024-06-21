import axios from "axios";
import config from "./config";


// Make an axios rquest to the API clash royale with a bearer token
const axiosInstance = axios.create({
  baseURL: `https://proxy.royaleapi.dev/v1/%23`,
  headers: {
    Authorization: `Bearer ${config.API_KEY}`,
  },
});

const getBattleLog = (playerTag: string) => {
  const request = axios.post(`https://proxy.royaleapi.dev/v1/players/%23${playerTag}/battlelog`, {
    headers: {
      Authorization: `Bearer ${config.API_KEY}`,
    },
  });
  return request;
}

const getMostUsedDeck = (playerTag: string) => {
  const request = axios.get(`http://localhost:3000/api/deck/getmostuseddeck/${playerTag}`, {
    headers: {
      Authorization: `Bearer ${config.API_KEY}`,
    },
  });
  return request;
}

export default { axiosInstance, getBattleLog, getMostUsedDeck };
