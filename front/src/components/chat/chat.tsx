import React, { Component } from "react";
import { useState } from 'react'; 
import './chat.css';
import { RestaurantRounded } from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';
import { Button } from "@mui/material";
import buttonsubmit from "../../images/submitChat2.png";
import directmessage from "../../images/directChat.png";
import addgroup from "../../images/add-group.png";
import Popup from 'reactjs-popup';


function ButtonCreateCanal(){

    const [Chatbox, setChatbox] = useState(["Direct Messages"]); 
    
    function addComponent() {
        setChatbox([...Chatbox, "Direct Messages"]);
    } 

    return (
         <>
             <div className="chat">
             {/* <button onClick={addComponent} className="button" name="button 1">
                 call component
              </button> */}
              {/* {Chatbox.map((item) => (<DirectMessages text={item} />))} */}
             </div>
         </>
     );
}

function CreatePopup() {
    const [gameName, setGameName] = useState("");
    const [open, setOpen] = useState(false);
  
    return (
      <div>
          <button className="buttonaddgroup"  onClick={() => setOpen(true)}> <img src={addgroup} alt="account" id="imgaddgroupet"/></button>
       
        <Popup open={open} closeOnDocumentClick onClose={() => setOpen(false)}>
          <div>Nom du Channel a creer</div>
          <input className="input"
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />
          <button className="gameButton" onClick={() => { setOpen(false); setGameName("")}}>SEND</button>
        </Popup>
      </div>
    );
  }

function Bodychat() {

    return (
        <>
          <div className="allBodyChat">
                <div className="headerChat">

                    <div className="iconeChat">
                        <CreatePopup/>
                        <button className="buttonDirectChat"> <img src={directmessage} alt="account" id="imgDirectChat"/></button>
                        <button className="buttonDirectChat"> <img src={directmessage} alt="account" id="loupe"/></button>

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

function Channel() {

    return (
        <>
            <div className="Allbodychannel">
                <div className="headerChatchannel">

                    <h1 id="h1channel"> Channel</h1>

                </div>

                <div className="centerChat">


                </div>
                <div className="footerChatchannel">
                    

                </div> 

            </div>
            
            
        </>
    );
}

function ListChannel() {
    return (
        <>
            <div className="AllbodyList">
                <div className="headerChatList">

                    <h1 id="h1channel"> List</h1>

                </div>

                <div className="centerChat">


                </div>
                <div className="footerChatList">
                    

                </div> 

            </div>
            
            
        </>
    );
}

function Chat() {

    return (
        <>
            <div className="rayaneleboloss">
                <Channel/>
                <ButtonCreateCanal/>
                <Bodychat/>
                <ListChannel/>
            </div>
            {/* <DirectMessages /> */}
            
            
            
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