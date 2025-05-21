import axiosInstance from "../../api/axiosInstance";

export async function sendMessageToAI(message) {
  const res = await axiosInstance.post("/chat", { message });
  return res.data.response;
}