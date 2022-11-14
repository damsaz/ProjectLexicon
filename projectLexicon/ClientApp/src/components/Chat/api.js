import axios from "axios";
import authService from '../api-authorization/AuthorizeService'

let nextUid = 1;
export function getNextUid() {
  return nextUid++;
}

const URL_BASE = "api";

const configPostJson = {
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

function checkResponse(response) {
  let errText = "";
  if (!response) {
    errText = `API Call status No Response`;
  } else if (!response.status) {
    errText = `API Call Missing Response status`;
  } else if (response.status < 200 || response.status > 299) {
    if (response.statusText) {
      errText = `API Call error ${response.status} ${response.statusText}`;
    } else {
      errText = `API Call error ${response.status}`;
    }
  }
  return errText;
}

export async function apiGet(url, qryParams) {
  const params = new URLSearchParams(qryParams);
  const token = await authService.getAccessToken();
  const response = await fetch(`${URL_BASE}/${url}?${params}`, {
    headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
  });
  const errText = checkResponse(response)
  const body = await response.json();
  if (!body) body = { errText: "No data from server" }
  body.errText = body.errText || errText;
  return body;
}

export async function apiPost(url, qryParams, data) {
  const params = new URLSearchParams(qryParams);
  const token = await authService.getAccessToken();
  let config = {
    ...configPostJson,
    headers: !token
      ? {}
      : { 'Authorization': `Bearer ${token}` }
  }
  let response;
  try {
    response = await axios.post(`${URL_BASE}/${url}?${params}`, data, config);
  } catch (error) {
    console.log(error.message || error);
    if (error.response) {
      response = error.response;
    } else {
      return { errText: error.message }
    }
  }
  const errText = checkResponse(response)
  const body = response.data;
  if (!body) body = { errText: "No data from server" }
  body.errText = body.errText || errText;
  return body
}
