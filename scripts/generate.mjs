import axios from "axios";
import apps from "./apps.mjs";

const config = {
  // url: "http://localhost:5173/test",
  url: "http://localhost:5173",
  method: "post",
};

function makeRequest(data) {
  return axios({ ...config, data });
}

function main() {
  return Promise.all(apps.map(makeRequest));
}

function getData({ data }) {
  return data;
}

function mapResponses(responses) {
  return responses.map(getData)
}

main().then(mapResponses).then(console.log).catch(console.error);
