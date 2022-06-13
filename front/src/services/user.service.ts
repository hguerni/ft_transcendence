import axios from "axios";
// import { User } from "../models/user.model";

export function GetUserData() { //do not call this function more than one time, userData is updated every one second
  async function getActiveUserData() {
    const {data} = await axios.get("userModel");
    if (data)
      localStorage.setItem("userData", JSON.stringify(data))
  }
 // setInterval(getActiveUserData, 1000);
  getActiveUserData();
  console.log("testt");
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
    return null;
  }

  static getUserId() {
    const userData = localStorage.getItem("userData");

    if (userData)
      return JSON.parse(userData).id;
    return 0;
  }

  static getUserRealID() {
    const userData = localStorage.getItem("userData");

    if (userData)
      return JSON.parse(userData).rlid;
    return 0;
  }

  static getUsername() {
    const userData = localStorage.getItem("userData");

    if (userData)
      return JSON.parse(userData).username;
    return "";
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
    return "";
  }

  static getEmail() {
    const userData = localStorage.getItem("userData");

    if (userData)
      return JSON.parse(userData).email;
    return "";
  }

  static getTwofaStatus() {
    const userData = localStorage.getItem("userData");

    if (userData)
      return JSON.parse(userData).twofa;
    return false;
  }

  //old function
  static async logout(){
    await axios.get("logout");
    return window.location.reload();
  }
}
