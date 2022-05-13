import axios from "axios";
import React from "react";


export default class UserService {
  static async findName(userID: number) {
    return await axios.get("users/findName", {
      params: {
        userID: userID,
      },
    });
  }

  static async getActiveUserID() {
    return await axios.get("userID");
  }

  static async getUserData() {
    return await axios.get("userData");
  }

  static async logout(){
    await axios.get("logout");
    return window.location.reload();
  }
}
