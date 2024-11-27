import axios from "axios";

export const api = axios.create({
  baseURL:
    "https://ezpdf-harshtewari6-gmailcom-vedus-projects-66859201.vercel.app",
});

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
  console.log(messages);
  return await api.post("/getAnswer", {
    messages: messages,
    question: question,
  });
};
