import React, { Component, useEffect } from "react";
import { useState } from 'react';
import './chat.css';
import { RestaurantRounded } from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';
import { Button } from "@mui/material";
import loupe from "../../images/loupe.png";
import buttonsubmit from "../../images/submitChat2.png";
import directmessage from "../../images/directChat.png";
import addgroup from "../../images/add-group.png";
import Popup from 'reactjs-popup';
import { Server } from "socket.io";
import { io } from "socket.io-client";
import { V4MAPPED } from "dns";
import { v4 } from 'uuid'


const socket = io("ws://localhost:3030/chat");

/*creation d'un evenement juste pour que avant de discuter les deux on rejoin le canal*/
socket.emit("joinroom");

class info {
    /*creation d'une class qui servira a determiner le nom
    ainsi l'input de la personne qui envoi le message*/
    key: string = v4();
    name: string = "";
    inputValue: string = "";
}

class info2 {
    /*creation d'une class qui servira a determiner le nom
    ainsi l'input de la personne qui envoi le message*/
    key: string = v4();
    name: string = "";
    message: string = "";
}

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

function CreatePopupChannel() {
    const [channelName, setChannelName] = useState("");
    const [open, setOpen] = useState(false);

   function sendChannelName ()
   {
        socket.emit("CREATE_CHANNEL",  channelName);
   }


    return (
      <div>
          <button className="buttonaddgroup"  onClick={() => setOpen(true)}> <img src={addgroup} alt="account" id="imgaddgroupet"/></button>
        <Popup open={open} closeOnDocumentClick onClose={() => setOpen(false)}>
          <div>Nom du Channel a creer</div>
          <input className="input"
            type="text"
            value={channelName}

            onChange={(e) => setChannelName(e.target.value)}
          />
          <button className="gameButton" onClick={() => { setOpen(false); sendChannelName(); setChannelName("")}}>SEND</button>
        </Popup>

      </div>

    );
  }

  function CreatePopupInviteUser() {
    const [InvitUserName, setChannelName] = useState("");
    const [open, setOpen] = useState(false);

   function sendChannelName ()
   {
        socket.emit("addmember",  {login: InvitUserName});
   }


    return (
      <div>
          <button className="buttonInviteUsers" onClick={() => setOpen(true)}> <img src={loupe} alt="niqueLaLoupe" id="imgLoupe"/></button>
        <Popup open={open} closeOnDocumentClick onClose={() => setOpen(false)}>
          <div>Login de la personne a ajouter dans le channel</div>
          <input className="input"
            type="text"
            value={InvitUserName}

            onChange={(e) => setChannelName(e.target.value)}
          />
          <button className="gameButton" onClick={() => { setOpen(false); sendChannelName(); setChannelName("")}}>SEND</button>
        </Popup>

      </div>

    );
  }

/*fonction qui sera executer quand l'utilisateur  aura appuyer pour envoyer le message*/
function sendInput(message: string) {
    let infoInputChat = new info(); // créé infoInputChat avec une nouvelle clé unique

    // future post a envoyer au back ...
    infoInputChat.name = "rayane";
    infoInputChat.inputValue = message;
    // envoi d'un message au serveur. Le Json.stringify sert a transformer un objet en string
    socket.emit("bonjour du client",  JSON.stringify(infoInputChat));
}

function Bodychat() {
    /*A chaque fois que le state sera appeler le composant sera recre et changera*/

    const [arrayHistory, setArrayhistory] = useState<info[]>([]);
    const [newInfo, setNewInfo] = useState<info>(new info());
    const [message, setMessage] = useState("");

/*************************************************** */
    const [arrayChat, setArraylistChat] = useState<info2[]>([]);
    
    useEffect(() => {    
        socket.on("LIST_CHAT", (message: info2[]) => {
        // ... on recupere le message envoyer par le serveur ici et on remet la string en un objet
        //setInputValue(message);
        // setlistName(message);
        

        // let tmp = [...arraylistName];
        // tmp.push(message);
        setArraylistChat(message);
        });
    },[])

  
/********************************************************** */

    useEffect(() => {
        let tmp = [...arrayHistory];
        tmp.push(newInfo);
        setArrayhistory(tmp);
   
    }, [newInfo]); // useEffect est appelé uniquement quand newInfo change

    useEffect(() => {
        // réception d'un message envoyé par le serveur
        socket.on("bonjour du serveur", (message: info) => {
        // ... on recupere le message envoyer par le serveur ici et on remet la string en un objet
            setNewInfo(message);
        });
    }, []); // useEffect est appelé uniquement lors du premier render du composant

    return (
        <>
          <div className="allBodyChat">
                <div className="headerChat">

                    <div className="iconeChat">
                        <CreatePopupChannel/>
                        <button className="buttonDirectChat"> <img src={directmessage} alt="account" id="imgDirectChat"/></button>
                        <CreatePopupInviteUser/>
                    </div>
                </div>

                <div className="centerChat">
                    {arrayChat.map((item) => {
                        return (
                            <div >
                              { console.log(item)};
                                <h1 className="inputName"> {item.name} </h1>
                                <h1 className="chathistory"> {item.message} </h1>
                                <h1> </h1>
                            </div>
                        );
                    })}

                    {/* {arrayHistory.map((item) => {
                        return (
                            <div >
                              { console.log(item)};
                                <h1 className="inputName"> {item.name} </h1>
                                <h1 className="chathistory"> {item.inputValue} </h1>
                                <h1> </h1>
                            </div>
                        );
                    })} */}

                </div>

                <div className="footerChat">

                    <input id="inputrayane" type="text" placeholder="Write message" value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => {if (e.key === "Enter") {sendInput(message); setMessage("");}}}/>

                    <div className="submitChat">
                        <button className="buttonSubmit" onClick={() => {  sendInput(message); setMessage("");}}> <img src={buttonsubmit} alt="account" id="imgSubmit"/></button>

                    </div>
                </div>

            </div>
        </>
    );
}


function Channel() {

    const [channelName, setChannelName] = useState("");
    const [arrayChannelName, setArrayChannelName] = useState<string[]>([]);

    // useEffect(() => {

        // socket.on("ready", (ready_chat: object) => {

        // })
      // réception d'un message envoyé par le serveur
        socket.on("CHANNEL_CREATED", (message: string) => {
            // ... on recupere le message envoyer par le serveur ici et on remet la string en un objet
            //setInputValue(message);
            setChannelName(message);
            

            let tmp = [...arrayChannelName];
            tmp.push(message);
            setArrayChannelName(tmp);
        });


    //   }, []);


    return (
        <>
            <div className="Allbodychannel">
                <div className="headerChatchannel">

                    <h1 id="h1channel"> Channel</h1>

                </div>

                <div className="centerChat">

                    {arrayChannelName.map((item) => {

                        return  <button className="buttonInviteUsers" onClick={() => {socket.emit("JUST_NAME_CHANNEL",  item); console.log(item); }}> <h1 className="channelName"> <span className="dieseChannel"> # </span> {item.substring(0, 10)}  </h1> </button>

                    })}


                </div>
                <div className="footerChatchannel">


                </div>

            </div>

        </>
    );
}

function ListChannel() {

    const [arraylistName, setArraylistName] = useState<string[]>([]);

    // useEffect(() => {

        // socket.on("ready", (ready_chat: object) => {

        // })
      // réception d'un message envoyé par le serveur
        socket.on("LIST_NAME", (message: string[]) => {
            // ... on recupere le message envoyer par le serveur ici et on remet la string en un objet
            //setInputValue(message);
            // setlistName(message);
            

            // let tmp = [...arraylistName];
            // tmp.push(message);
            setArraylistName(message);
        });
    //   }, []);


    return (
        <>
            <div className="AllbodyList">
                <div className="headerChatList">

                    <h1 id="h1channel"> List</h1>

                </div>

                <div className="centerChat">
                {arraylistName.map((item) => {
                    console.log(item);

                    return   <h1 className="channelName"> {item}  </h1>

                })}

                </div>
                <div className="footerChatList">


                </div>

            </div>


        </>
    );
}

function Chat() {
    //all ready
    
    return (
        <>
            <div className="rayaneleboloss">
                <Channel/>
                {/* <ButtonCreateCanal/> */}
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

