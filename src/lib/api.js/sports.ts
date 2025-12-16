import { API } from "./api";

export async function getSports() {
    const res = await fetch(API.sports);
  
    if (!res.ok) {
      throw new Error("Failed to fetch sports");
    }
  
    return res.json();
  }
  