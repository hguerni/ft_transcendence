import React, { Component, useEffect } from "react";
import { useState } from 'react';
import './chat.css';
import { AppSettingsAltRounded, ConstructionOutlined, RestaurantRounded } from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';
import loupe from "../../images/loupe.png";
import buttonsubmit from "../../images/submitChat2.png";
import directmessage from "../../images/directChat.png";
import addgroup from "../../images/add-group.png";
import engrenage from "../../images/engrenage.png";
import Popup from 'reactjs-popup';
import { Server } from "socket.io";
import { io } from "socket.io-client";
import { V4MAPPED } from "dns";
import { v4 } from 'uuid'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import UserService from '../../services/user.service'

//import { getchannel } from "../../../../shares/models"
const login: string = UserService.getUsername(); // à récupérer

enum status {
    owner,
    admin,
    default,
    ban
}

enum chat_status {
    private,
    public,
    protected,
    pv_message
  }

const socket = io("ws://localhost:3030/chat");
socket.emit('ready', login);

let global_channel = "";
let global_name_click = "";
/*creation d'un evenement juste pour que avant de discuter les deux on rejoin le canal*/
//socket.emit("joinroom");

class info {
    /*creation d'une class qui servira a determiner le nom
    ainsi l'input de la personne qui envoi le message*/
    key: string = v4();
    name: string = "";
    inputValue: string = "";
    channel: string = "coucou";
}

// class info2 {

//     channel: string = "";
//     list: {name: string, message: string}[] = [];
// }

interface message {
    name: string;
    message: string;
}

interface info2 {

    channel: string;
    list: message[];
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

function MenuSettings() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const quit_serveur = () => {
        socket.emit("QUIT_CHAN", {channel: global_channel, login: login});
    }

    const handleClose = (ind: number) => {
        setAnchorEl(null);
        if (ind == 2)
            quit_serveur();
    };

    

    let menuEngrenage;
    let status_user = 0;
    if (status_user === 0) {
        menuEngrenage = (
        <>
            <MenuItem onClick={() => handleClose(0)}>Modifier le mot de passe</MenuItem>
            <MenuItem onClick={() => handleClose(1)}>Retirer le mot de passe</MenuItem>
            <MenuItem onClick={() => handleClose(2)}>Quitter le channel</MenuItem>
        </>)
    }
    else {
        menuEngrenage = (
            <MenuItem onClick={() => handleClose(2)}>Quitter le channel</MenuItem>
        )
    }

    return (
        <div>
        <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{ minHeight: 0, minWidth: 0, padding: 0 }}
        >
            <img
                id="buttonSettings"
                src={engrenage} 
                alt="settings" />
        </Button>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}
        >
            {menuEngrenage}
        </Menu>
        </div>
    );
}

function CreatePopupChannel() {
    const [channelName, setChannelName] = useState("");
    const [channelAttribute, setChannelAttribute] = useState<string>("public");
    const [channelPassword, setChannelPassword] = useState<string>("");
    const [open, setOpen] = useState(false);

   function sendChannelName ()
   {
        socket.emit("CREATE_CHANNEL",  {channel: channelName, login: login, status: chat_status.public, password: ""});
   }

    return (
      <div>
          <button className="buttonaddgroup"  onClick={() => setOpen(true)}> <img src={loupe} alt="niqueLaLoupe" id="imgLoupe"/></button>
        <Popup open={open} closeOnDocumentClick onClose={() => setOpen(false)}>
          <div>Nom du Channel à créer:</div>

          <input className="input"
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />

          <div className="checkBoxes">
            <input type="checkbox" id="public" name="public"
                onChange={(e) => {setChannelAttribute("public")}} checked={channelAttribute === "public"}/>
            <label htmlFor="scales">Public</label>

            <input type="checkbox" id="private" name="private"
                onChange={(e) => {setChannelAttribute("private")}} checked={channelAttribute === "private"}/>
            <label htmlFor="horns">Private</label>

            <input type="checkbox" id="protected" name="protected"
                onChange={(e) => {setChannelAttribute("protected")}} checked={channelAttribute === "protected"}/>
            <label htmlFor="horns">Protected</label>

            <div>
              {channelAttribute === "protected" &&
                <input className="input"
                  type="text"
                  value={channelPassword}
                  onChange={(e) => setChannelPassword(e.target.value)}
                />
              }
            </div>
          </div>


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
        socket.emit("addmember",  {channel: global_channel, login: InvitUserName});
   }


    return (
      <div>
          <button className="buttonInviteUsers" onClick={() => setOpen(true)}> <img src={addgroup} alt="account" id="imgaddgroupet"/></button>
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
    socket.emit("addmsg",  {message: message, channel: global_channel, login: login});//changer login
}

function Bodychat() {
    /*A chaque fois que le state sera appeler le composant sera recre et changera*/

    const [arrayHistory, setArrayhistory] = useState<info[]>([]);
    const [newInfo, setNewInfo] = useState<info>(new info());
    const [message, setMessage] = useState("");

/*************************************************** */
    const [arrayChat, setArraylistChat] = useState<message[]>([]);

    useEffect(() => {
        socket.on("LIST_CHAT", (message: info2) => {
        // ... on recupere le message envoyer par le serveur ici et on remet la string en un objet
        //setInputValue(message);
        // setlistName(message);
        // let tmp = [...arraylistName];
        // tmp.push(message);
        console.log("<List chat>", global_channel, message.channel)
        if (global_channel == message.channel)
            setArraylistChat(message.list);
        });
    },[])


/********************************************************** */

    // useEffect(() => {
    //     let tmp = [...arrayHistory];
    //     tmp.push(newInfo);
    //     setArrayhistory(tmp);

    // }, [newInfo]); // useEffect est appelé uniquement quand newInfo change

    // useEffect(() => {
    //     // réception d'un message envoyé par le serveur
    //     socket.on("bonjour du serveur", (message: info) => {
    //     // ... on recupere le message envoyer par le serveur ici et on remet la string en un objet
    //         setNewInfo(message);
    //     });
    // }, []); // useEffect est appelé uniquement lors du premier render du composant

    return (
        <>
          <div className="allBodyChat">
                <div className="headerChat">

                    <div className="iconeChat">
                        <CreatePopupChannel/>
                        {/* <button className="buttonDirectChat"> <img src={directmessage} alt="account" id="imgDirectChat"/></button> */}
                        <CreatePopupInviteUser/>
                        <MenuSettings />




                    </div>


                </div>

                <div className="centerChat">
                    {arrayChat.map((item) => {
                        return (
                            <div >
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

    useEffect(() => {
        // socket.on("ready", (ready_chat: object) => {

        // })
      // réception d'un message envoyé par le serveur
        socket.on("CHANNEL_CREATED", (message: string[]) => {
            // ... on recupere le message envoyer par le serveur ici et on remet la string en un objet
            //setInputValue(message);
            //setChannelName(message);

            //const filteredArray = message.filter(function(ele , pos){
            //    return message.indexOf(ele) == pos;
            //})
            console.log("<List channel>", message);
            setArrayChannelName(message);
        });
    }, []);

    return (
        <>
            <div className="Allbodychannel">
                <div className="headerChatchannel">
                    <h1 id="h1channel"> Channel</h1>
                </div>
                <div className="centerChat">

                    {arrayChannelName.map((item) => {
                        return  <button className="buttonInviteUsers" onClick={() => {socket.emit("JUST_NAME_CHANNEL",  item); global_channel = item; console.log(global_channel);}}> <h1 className="channelName"> <span className="dieseChannel"> # </span> {item.substring(0, 10)}  </h1> </button>
                    })}
                </div>
                <div className="footerChatchannel">
                </div>
            </div>

        </>
    );
}

function promouvoir_admin(cible: string) {

    //recup la target pour que ca marche
   
    socket.emit("CHANGE_STATUS",  {channel: global_channel,  target: cible, sender: login, status: status.admin}); 
    
}

function mute(cible: string) {

    //recup la target pour que ca marche
    socket.emit("MUTE",  {channel: global_channel,  target: cible, sender: login}); 
    
}

function bloquer() {

    //recup la target pour que ca marche
   // socket.emit("CHANGE_STATUS",  {channel: global_channel,  target: "elarbi", sender: login, status: status.admin}); 
    
}

function bannir() {

    //recup la target pour que ca marche
    //socket.emit("CHANGE_STATUS",  {channel: global_channel,  target: "elarbi", sender: login, status: status.admin}); 
    
}

function MenuMembre(props: {item: {login: string, status: number}}) {
    
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = (param: number, cible: string) => {

    setAnchorEl(null);
    if (param == 4)
        promouvoir_admin(cible);
    else if (param == 5)
        mute(cible);

  };

  let menu_onclick;
  let h1_name_role;
  let status_du_gars_connecte = 0;
  //recup le status

  if (status_du_gars_connecte == 0)
  {
    menu_onclick = (<>
        <MenuItem onClick={() => handleClose(1, props.item.login)}>Profil</MenuItem> 
        <MenuItem onClick={() => handleClose(2, props.item.login)}>Inviter a jouer</MenuItem> 
        <MenuItem onClick={() => handleClose(3, props.item.login)}>Envoyer un message</MenuItem>
        <MenuItem onClick={() => handleClose(4, props.item.login)}>Promouvoir en admin</MenuItem>
        <MenuItem onClick={() => handleClose(5, props.item.login)}>Mute</MenuItem>
        <MenuItem onClick={() => handleClose(6, props.item.login)}>Bloquer</MenuItem>
        <MenuItem onClick={() => handleClose(7, props.item.login)}>Bannir</MenuItem>


      </>)
  }
  else if (status_du_gars_connecte == 1)
  {
    menu_onclick = (<>
        <MenuItem onClick={() => handleClose(1, props.item.login)}>Profil</MenuItem> 
        <MenuItem onClick={() => handleClose(2, props.item.login)}>Inviter a jouer</MenuItem> 
        <MenuItem onClick={() => handleClose(3, props.item.login)}>Envoyer un message</MenuItem>
        <MenuItem onClick={() => handleClose(5, props.item.login)}>Mute</MenuItem>
        <MenuItem onClick={() => handleClose(6, props.item.login)}>Bloquer</MenuItem>
        <MenuItem onClick={() => handleClose(7, props.item.login)}>Bannir</MenuItem>
        </>)
  }
  else if (status_du_gars_connecte)
  {
    menu_onclick =( <>
        <MenuItem selected className="MenuItem" onClick={() => handleClose(1, props.item.login)}>Profil</MenuItem> 
        <MenuItem onClick={() => handleClose(2, props.item.login)}>Inviter a jouer</MenuItem> 
        <MenuItem onClick={() => handleClose(3, props.item.login)}>Envoyer un message</MenuItem> 
            </>)
  }

  if (props.item.status == 0)
  {
    h1_name_role = (<>
        <h1 className="personneDansChannelOwner"> {props.item.login}  </h1>
    </>)   
  }
  else if (props.item.status == 1)
  {
    h1_name_role = (<>
        <h1 className="personneDansChannelAdmin"> {props.item.login}  </h1>
    </>)
  }  
  else if (props.item.status == 2) {
    h1_name_role = (<>
        <h1 className="personneDansChannelDefault"> {props.item.login}  </h1>
    </>)

  }

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ minHeight: 0, minWidth: 0, padding: 0 }}
      >
        
        {/* <h1 className="personneDansChannelOwner"> {props.item.login}  </h1> */}

        {h1_name_role}

       
        
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
         
            {/* <MenuItem onClick={handleClose}>Profil</MenuItem> 
            <MenuItem onClick={handleClose}>Inviter a jouer</MenuItem> 
            <MenuItem onClick={handleClose}>Envoyer un message</MenuItem> 
            <MenuItem onClick={handleClose}>Promouvoir en admin</MenuItem>
       
            <MenuItem onClick={handleClose}>Mute</MenuItem>
            <MenuItem onClick={handleClose}>Bloquer</MenuItem>
            <MenuItem onClick={handleClose}>Bannir</MenuItem> */}
            {menu_onclick}


      </Menu>
    </div>
  );
}

function ListChannel() {

    const [arraylistName, setArraylistName] = useState<{login: string, status: number}[]>([]);


        // socket.on("ready", (ready_chat: object) => {

        // })
      // réception d'un message envoyé par le serveur
    useEffect(() => {
        socket.on("LIST_NAME", (message: {channel: string, list: {login: string, status: number}[]}) => {
            // ... on recupere le message envoyer par le serveur ici et on remet la string en un objet
            //setInputValue(message);
            // setlistName(message);


            // let tmp = [...arraylistName];
            // tmp.push(message);
            console.log("<List name>", global_channel, message.channel);
            if (message.channel == global_channel)
                setArraylistName(message.list);
        });
      }, []);


    return (
        <>
            <div className="AllbodyList">
                <div className="headerChatList">

                    <h1 id="h1channel"> List</h1>

                </div>

                <div className="centerChat">
                {/* <Menu_Membre/> */}
                {arraylistName.map((item) => {
                    
                    return <MenuMembre item={item}/>
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

    useEffect(() => {socket.emit("GET_CHANNEL", login); }, []);
    // remplacer par votre pseudo
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
