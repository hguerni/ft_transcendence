import account from "../../images/account-circle.svg";

export default function HeaderProfile () {
  return (
    <a href="/profile">
      <img className="accountImg" src={account}/>
    </a>
  );
}
