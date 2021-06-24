import loadFile from "../storage/load-file";

async function loadUserLessons(username): Promise<any[]> {
  const userLessons = await loadFile(["users", username, "lessons.json"]);
  return JSON.parse(userLessons);
}

export default loadUserLessons;
