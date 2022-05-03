import React, { Component } from "react";
import './chat.css';
import { RestaurantRounded } from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';
import { Button } from "@mui/material";

function ButtonCreateCanal(){

    const creatCanal = () => {

     }
 
     return (
         <>
             <div className="chat">
             <button onClick={creatCanal} className="button" name="button 1">
                 Button 1
              </button>
             </div>
         </>
     );
}

function Chat() {

    return (
        <>
            <ButtonCreateCanal/>
            <DirectMessages />
        </>
    );
}

function DirectMessages() {
    return (
        <div className="direct-messages">
            <div className="direct-messages-header">
                <div className="direct-messages-header-title">
                    <span>Direct Messages</span>
                    <ClearIcon id="close-icon"/>
                </div>
                
            </div>
            <div className="direct-messages-list">
                <div className="direct-messages-list-item">
                    <div className="direct-messages-list-item-content">
                        <div className="direct-messages-list-item-content-name">
                            <span>John Doe</span>
                        </div>
                        <div className="direct-messages-list-item-content-message">
                            <span>Hello, how are you?</span>
                        </div>
                    </div>
                </div>
                <div className="direct-messages-list-item">
                    <div className="direct-messages-list-item-content">
                        <div className="direct-messages-list-item-content-name">
                            <span>John Doe</span>
                        </div>
                        <div className="direct-messages-list-item-content-message">
                            <span>Hello, how are you?</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="direct-messages-write">
                    <input type="text" placeholder="Write message" />
                </div>
        </div>
    );
}

export default Chat;