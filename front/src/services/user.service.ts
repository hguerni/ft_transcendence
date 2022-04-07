import axios from "axios";

export default class UserService {
  static async findName(userID: number) {
    return await axios.get("users/findName", {
      params: {
        userID: userID,
      },
    });
  }

  static async getActiveUserID() {
    return await axios.get("users/getActiveUserID");
  }

  static async getUserData() {
    return await axios.get("userData");
  }
}