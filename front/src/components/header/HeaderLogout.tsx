import logout from "../../images/logout_white.png";
import UserService from "../../services/user.service";

export default function HeaderLogout () {


  return (
    <button className="buttonLogout" onClick={() => {UserService.logout()}}>
      <img style={{width: '40px'}} src={logout}/>
    </button>
  );
}
