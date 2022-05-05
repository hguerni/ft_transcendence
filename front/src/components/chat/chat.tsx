import React, { Component } from "react";
import { useState } from 'react'; 
import './chat.css';
import { RestaurantRounded } from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';
import { Button } from "@mui/material";
import buttonsubmit from "../../images/submitChat2.png";
import directmessage from "../../images/directChat.png";
import addgroup from "../../images/add-group.png";

function ButtonCreateCanal(){

    const [Chatbox, setChatbox] = useState(["Direct Messages"]); 
    
    function addComponent() {
        setChatbox([...Chatbox, "Direct Messages"]);
    } 

    return (
         <>
             <div className="chat">
             <button onClick={addComponent} className="button" name="button 1">
                 call component
              </button>
              {Chatbox.map((item) => (<DirectMessages text={item} />))}
             </div>
         </>
     );
}

function Bodychat() {

    return (
        <>
          <div className="allBodyChat">
                <div className="headerChat">

                    <div className="iconeChat">
                        <button className="buttonaddgroup"> <img src={addgroup} alt="account" id="imgaddgroupet"/></button>
                        <button className="buttonDirectChat"> <img src={directmessage} alt="account" id="imgDirectChat"/></button>

                    </div>


                </div>

                <div className="centerChat">


                </div>
                <div className="footerChat">
                    
                    <input id="inputrayane" type="text" placeholder="Write message" />
                    <div className="submitChat">
                        <button className="buttonSubmit"> <img src={buttonsubmit} alt="account" id="imgSubmit"/></button>

                    </div> 
                </div>

            </div>
        </>
    );
}

function Chat() {

    return (
        <>
            <Bodychat/>
            {/* <DirectMessages /> */}
            <ButtonCreateCanal/>
            
        </>
    );
}

function DirectMessages(props: any) {
    return (
        <>
            <div className="allBodyChat">
                <div className="headerChat">

                    <div className="iconeChat">
                        <button className="buttonaddgroup"> <img src={addgroup} alt="account" id="imgaddgroupet"/></button>
                        <button className="buttonDirectChat"> <img src={directmessage} alt="account" id="imgDirectChat"/></button>

                    </div>


                </div>

                <div className="centerChat">
                    <h1> {props.text} </h1>
                </div>
                <div className="footerChat">
                    
                    <input id="inputrayane" type="text" placeholder="Write message" />
                    <div className="submitChat">
                        <button className="buttonSubmit"> <img src={buttonsubmit} alt="account" id="imgSubmit"/></button>

                    </div> 
                </div>

            </div>
        </>
    );
}

export default Chat;