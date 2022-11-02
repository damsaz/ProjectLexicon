import axios from "axios";
import authService from '../components/api-authorization/AuthorizeService'

let userId = 99; // Guest
export function setUserId(newUserId) {
  userId = newUserId;
}


let nextUid = 1;
export function getNextUid() {
  return nextUid++;
}

export const callServer = true;
const URL_BASE = "api";

const configGetJson = {
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
};

const configPostJson = {
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

const configPostText = {
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "text/plain",
  },
};

function checkResponse(response) {
  let errText = "";
  if (!response) {
    errText = `API Call status No Response`;
  }
  if (!response.status) {
    errText = `API Call Missing Response status`;
  } else if (response.status < 200 || response.status > 299) {
    errText = `API Call status ${response.status}`;
  } else if (!response.data) {
    errText = `API Call No data returned`;
  } else if (response.data.errorMessage) {
    errText = `API Call Error Message: ${response.data.errorMessage}`;
  }
  if (errText) {
    console.log(errText);
    throw new Error(errText);
  }
}

export async function apiGet(url, qryParams) {
  const params = new URLSearchParams(qryParams);
  const token = await authService.getAccessToken();
  const response = await fetch(`${URL_BASE}/${url}?${params}`, {
    headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  return data;
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
  try {
    const response = await axios.post(`${URL_BASE}/${url}?${params}`, data, config);
    console.log(response);
    checkResponse(response);
    return response.data;
  } catch (error) {
    console.log(error.message || error);
    throw error;
  }
}





//export async function getJson(url, qryParams, data) {
//  const token = await authService.getAccessToken();
//  const params = new URLSearchParams(qryParams);
//  try {
//    const response = await fetch(`forumcategory/Item/?Id=${popupId}`, {
//      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
//    });

//    const response = await axios.get(`${URL_BASE}/${url}?${params}`, data, configGetJson);
//    console.log(response);
//    checkResponse(response);
//    return response.data.result;
//    } catch (error) {
//    console.log(error.message || error);
//    throw error;
//  }
//}




export async function postJson(url, qryParams, data) {
  qryParams.currentUser = userId;
  const params = new URLSearchParams(qryParams);
  try {
    const response = await axios.post(`${URL_BASE}/${url}?${params}`, data, configPostJson);
    console.log(response);
    checkResponse(response);
    return response.data.result;
  } catch (error) {
    console.log(error.message || error);
    throw error;
  }
}