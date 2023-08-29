// import fsExtra from "fs-extra";
import axios from "axios";

// const systemDocs = fsExtra.readFileSync("prompts/system3.md", "utf-8");

const config = {
  url: "http://localhost:5173/chatgpt",
  method: "post",
};

function getMessage({ choices }) {
  const [{ message }] = choices;
  return message;
}

function getData({ data }) {
  return data;
}

function makeRequest(data) {
  return axios({ ...config, data });
}

function main() {
  return makeRequest({
    messages: [
      // {
      //   role: "system",
      //   content: systemDocs
      // },
      {
        role: "user",
        content: "What are you?"
      },
    ]
  });
}

main()
  .then(getData)
  .then(getMessage)
  .then(console.log)
  .catch(console.error);
