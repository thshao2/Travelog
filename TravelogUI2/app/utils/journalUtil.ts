import config from "../config";
import { Journal } from "../popupMenu";
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
  console.log("stat updated");
};

export const deleteJournal = async (journalId: number, token: string) => {
  try {
    const response = await fetch(`${API_URL}/travel/memory/${journalId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete memory.");
    }
    await updateUserStats(token);
  } catch (err) {
    console.error(err);
  }
};

export const editJournal = async (updatedJournal: Journal, token: string) => {
  try {
    const response = await fetch(`${API_URL}/travel/memory/${updatedJournal.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(updatedJournal),
    });

    if (!response.ok) {
      throw new Error("Failed to edit memory.");
    }
    await updateUserStats(token);
  } catch (err) {
    console.error(err);
  }
};
