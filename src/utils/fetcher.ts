import axios from "axios";

export const fetcher = (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
    })
    .then((response) => {
      return response.data;
    });
