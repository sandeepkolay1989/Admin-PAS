import { API } from "./api";

export async function getUsers() {
    const res = await fetch(API.users);
  
    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }
  
    return res.json();
  }