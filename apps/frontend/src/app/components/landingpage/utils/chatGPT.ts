import axios from "axios";
const server_url = "https://server-wyqxm5q4yq-lz.a.run.app/";

export async function chatGPT(packageForChatGPT: any) {
  try {
    const response = await axios.post(`${server_url}/get-conversation`, packageForChatGPT, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
