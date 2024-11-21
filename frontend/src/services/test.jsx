import axios from "axios";

export const api = axios.create({ baseURL: "http://localhost:8000/" });

export const getTest = (test) => {
  return api.get();
};

export const getText = async (formData) => {
  return await api.post("/uploadPdf", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAnswer = async (messages, question) => {
  return await api.post("/getAnswer", {
    messages: messages,
    question: question,
  });
};
