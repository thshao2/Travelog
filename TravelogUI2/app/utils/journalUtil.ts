import config from "../config";
const { API_URL } = config;

export const updateUserStats = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/travel/memory/update-stats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("updateUserStats - network response was not ok");
    }
  } catch (err) {
    console.error("Error updating stats after posting pin to database: " + err);
  }
};
