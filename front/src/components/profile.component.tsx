// import React from 'react';
// import { BrowserRouter, Route } from 'react-router-dom';
import './profile.component.css';
import account_image from '../images/account-image.png';

function Profile() {
  return (
    <div className="bigOne">
      <img src={account_image} alt="account" id="acc-img"/>
      <h1>User.login ici</h1>
    </div>
  );
}

export default Profile;