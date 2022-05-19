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

export function GetUserData() { //do not call this function more than one time, userData is updated every one second
  const [userData, setUserData] = useState<User>(new DefaultUser());

  useEffect(() => {
    async function getActiveUserData() {
      const {data} = await axios.get("userModel");
      if (data)
        setUserData(data);
    }
    setInterval(getActiveUserData, 1000);
  }, []);

  if (userData.id != 0)
    localStorage.setItem("userData", JSON.stringify(userData))
}

export default class UserService {
  static isUserConnected() {
    const userData = localStorage.getItem("userData");

    if (userData)
      return true;
    return false;
  }

  static getUserData() {
    const userData = localStorage.getItem("userData");

    if (userData)
      return userData;
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
