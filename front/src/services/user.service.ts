import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "../models/user.model";

class DefaultUser implements User {
  id: number = 0;
  username: string = '';
  online: number = 0;
  avatar: string = '';
  email: string = '';
  twofa: boolean = false;
}

export function GetUserData() { //works only for UserId for now
  const [userID, setUserID] = useState<number>(-1);

  useEffect(() => {
    async function getActiveUserID() {
      const {data} = await axios.get("userID");
      setUserID(data);
    }
    getActiveUserID();
  }, []);

  let user = new DefaultUser();
  user.id = userID;
  localStorage.setItem("userData", JSON.stringify(user))
}

export default class UserService { //works only for isUserConnected() & getUserId() for now
  static isUserConnected() {
    const userData = localStorage.getItem("userData");

    if (userData)
      return true;
    return false;
  }

  static getUserData() {
    const userData = localStorage.getItem("userData");

    if (userData)
      return JSON.parse(userData);
    return 0;
  }

  static getUserId() {
    const userData = localStorage.getItem("userData");

    if (userData)
      return JSON.parse(userData).id;
    return 0;
  }

  static getUsername() {
    const userData = localStorage.getItem("userData");

    if (userData)
      return JSON.parse(userData).username;
    return 0;
  }

  static getOnlineStatus() {
    const userData = localStorage.getItem("userData");

    if (userData)
      return JSON.parse(userData).online;
    return 0;
  }

  static getAvatar() {
    const userData = localStorage.getItem("userData");

    if (userData)
      return JSON.parse(userData).avatar;
    return 0;
  }

  static getEmail() {
    const userData = localStorage.getItem("userData");

    if (userData)
      return JSON.parse(userData).email;
    return 0;
  }

  static getTwofaStatus() {
    const userData = localStorage.getItem("userData");

    if (userData)
      return JSON.parse(userData).twofa;
    return 0;
  }

  //old function
  static async logout(){
    await axios.get("logout");
    return window.location.reload();
  }
}
