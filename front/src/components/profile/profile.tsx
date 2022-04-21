// import React from 'react';
// import { BrowserRouter, Route } from 'react-router-dom';
import './profile.css';
import account_image from '../../images/avatar.png';
import camera from '../../images/camera-solid.svg';

function Profile() {
  return (
    <div className="bigOne">

    <div className="img-holder">
    <button className="btn"> <img src={camera} alt="account" id="camera"/></button>
    </div>

      <img src={account_image} alt="account" id="acc-img"/>
      <h1>User.login ici</h1>
      <h1>  </h1>
    </div>
  );
}

export default Profile;





// // import React from 'react';
// // import { BrowserRouter, Route } from 'react-router-dom';
// import './profile.css';
// import React, { useState } from "react";
// // let account_image = require('../../images/avatar.png');
// import camera from '../../images/camera-solid.svg';

// function Profile() {
//   // let account_image = require('../../images/avatar.png');
//   // account_image = require('../../images/react-logo.png');

//   const [file, setFile] = useState('../../images/avatar.png');
//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     console.log(e.target.files);
//     setFile(URL.createObjectURL(e.target.files[0]));
//   }
//   return (
//     <div className="bigOne">
//     <div className="img-holder">
//       <input type="file" onChange={handleChange} />
     
//     </div>
//       {/* <div <button className="btn"> <img src={camera} alt="account" id="camera"/></button> </div> */}
//       <img src={file} alt="account" id="acc-img"/>
//       <h1>User.login ici</h1>
//     </div>
//   );
// }

// export default Profile;