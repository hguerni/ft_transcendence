import React, { useEffect } from "react";
import { useState } from 'react';
import { useHistory, Link, Redirect } from 'react-router-dom';
import './chat.css';
import loupe from "../../images/loupe.png";
import buttonsubmit from "../../images/submitChat2.png";
import addgroup from "../../images/add-group.png";
import engrenage from "../../images/engrenage.png";
import join_channel from "../../images/join_channel.png";
import cadenas from "../../images/cadenas.png";
import Popup from 'reactjs-popup';
import { io, Socket } from "socket.io-client";
import { v4 } from 'uuid'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import UserService from '../../services/user.service'
import {socket as GameSocket} from "../game/Game"
import { GameCreate } from "../game/GameArea";
import axios from "axios";

const userId: number = UserService.getUserId(); // à récupérer

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
let global_blocked: number[] = [];
let global_channel = "";
let global_status = status.ban;

class info {
    /*creation d'une class qui servira a determiner le nom
    ainsi l'input de la personne qui envoi le message*/
    key: string = v4();
    name: string = "";
    inputValue: string = "";
    channel: string = "coucou";
}

interface message {
    id: number;
    name: string;
    message: string;
}

interface info2 {

    channel: string;
    list: message[];
}

function ModifierPopupMdp() {
    const [newPassword, setNewPassword] = useState("");
    const [open, setOpen] = useState(false);

    const modifier_mdp = (password: string) => {


        socket.emit("CHANGE_STATUS_CHAN", {channel: global_channel, id: userId, status: chat_status.protected, password: password});
    }


    return (
      <div>
          <MenuItem onClick={() => setOpen(true)}>Modifier le mot de passe</MenuItem>
        <Popup contentStyle={{fontSize:'20px'}} open={open} closeOnDocumentClick onClose={() => setOpen(false)}>

          <div>Quel est le nouveau mot de pass ?</div>
          <input className="input"
            type="text"
            value={newPassword}

            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="gameButton" onClick={() => {setOpen(false); modifier_mdp(newPassword); setNewPassword("")}}>SEND</button>
        </Popup>

      </div>

    );
  }


function MenuSettings() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const quit_serveur = () => {
        socket.emit("QUIT_CHAN", {channel: global_channel, id: userId});
    }

    const retirer_mdp = () => {


        socket.emit("CHANGE_STATUS_CHAN", {channel: global_channel, id: userId, status: chat_status.public, password: ""});
    }




    const handleClose = (ind: number) => {

        setAnchorEl(null);
        if (ind === 2)
        {

            quit_serveur();
        }
        else if (ind === 1)
        {

            retirer_mdp();
        }



    };



    let menuEngrenage;
    if (global_status === 0) {
        menuEngrenage = (
        <div key={Math.random() * 100}>

            <ModifierPopupMdp/>
            <MenuItem onClick={() => handleClose(1)}>Retirer le mot de passe</MenuItem>
            <MenuItem onClick={() => handleClose(2)}>Quitter le channel</MenuItem>
        </div>)
    }
    else {
        menuEngrenage = (<div key={Math.random() * 100}>
            <MenuItem onClick={() => handleClose(2)}>Quitter le channel</MenuItem>
            </div>
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
    const [channelAttribute, setChannelAttribute] = useState<number>(chat_status.public);
    const [channelPassword, setChannelPassword] = useState<string>("");
    const [open, setOpen] = useState(false);

   function sendChannelName ()
   {
        socket.emit("CREATE_CHANNEL",  {channel: channelName, id: userId, status: channelAttribute, password: channelPassword});
        setChannelPassword("");
    }

    return (
      <div>
          <button className="buttonaddgroup"  onClick={() => setOpen(true)}> <img src={loupe} alt="niqueLaLoupe" id="imgLoupe"/></button>

          <Popup contentStyle={{fontSize:'20px'}} open={open} closeOnDocumentClick onClose={() => setOpen(false)}>
          <div>Nom du Channel à créer:</div>

          <input className="input"
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />

          <div className="checkBoxes">
            <input type="checkbox" id="public" name="public"
                onChange={(e) => {setChannelAttribute(chat_status.public)}} checked={channelAttribute === chat_status.public}/>
            <label htmlFor="scales">Public</label>

            <input type="checkbox" id="private" name="private"
                onChange={(e) => {setChannelAttribute(chat_status.private)}} checked={channelAttribute === chat_status.private}/>
            <label htmlFor="horns">Private</label>

            <input type="checkbox" id="protected" name="protected"
                onChange={(e) => {setChannelAttribute(chat_status.protected)}} checked={channelAttribute === chat_status.protected}/>
            <label htmlFor="horns">Protected</label>

            <div>
              {channelAttribute === chat_status.protected &&
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
        <Popup contentStyle={{fontSize:'20px'}} open={open} closeOnDocumentClick onClose={() => setOpen(false)}>

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

  const print_status = (status: number) => {
    if (status === chat_status.protected)
        return (
            <img src={cadenas} alt="cadenas" id="imgcadenas"/>
        );
}

  function InputPassword(props: {name: string, status: number, setOpen: (open: boolean) => void}) {
      const [password, setPassword] = useState("");
      const handleKey = async (e: React.KeyboardEvent<HTMLInputElement>, name: string, password: string) => {
        if (e.key === "Enter"){
          socket.emit("JOIN_CHAN",  {channel: name, id: userId, password: password});
          setPassword("");
          setOpen(false);
        }
      };

      return (
        <input
        id="input-mdp"
        type="text"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => handleKey(e, props.name, password)}
    />
      );
  }


  function CreatePopupSearchChannel() {
    // const [isclic, setisclic] = useState(false);
    const [open, setOpen] = useState(false);
    // const [password, setPassword] = useState("");
    const [serverName, setServerName] = useState<{name: string, status: number}[]>([]);

    useEffect(() => {
      socket.on("ALL_CHAN", (data: {name: string, status: number}[]) => {
            setServerName(data);
      })
      return () => {
        socket.off("ALL_CHAN");
      }
    }, [])

    const searchChannel = () => {
        socket.emit("ALL_CHAN", userId);
    }

    return (
      <div>
           <img onClick={() => {setOpen(true); searchChannel();}}
            src={join_channel}
            alt="account"
            id="imgJoinChannel"
            />

        <Popup contentStyle={{fontSize:'20px'}} open={open} closeOnDocumentClick onClose={() => setOpen(false)}>
          {serverName.map((item) => {
            // const [password, setPassword] = useState("");
            return (
                    item.status === chat_status.public ? (
                        <h1  className="allServers" onClick={() => {setOpen(false); socket.emit("JOIN_CHAN",  {channel: item.name, id: userId, password: ""})}}> {item.name} </h1>
                    )
                    : (
                            <>
                                <h1
                                className="allServers"
                                onClick={() => {setOpen(true)}}>
                                {item.name}
                                <span id="leCadenas">{print_status(item.status)}</span>
                                <InputPassword name={item.name} status={item.status} setOpen={setOpen}/>
                                </h1>
                            </>
                    )
                )
            })}
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
    socket.emit("addmsg",  {message: message, channel: global_channel, id: userId});//changer login
}

function Bodychat() {
    /*A chaque fois que le state sera appeler le composant sera recre et changera*/
    const [message, setMessage] = useState("");

/*************************************************** */
    const [arrayChat, setArraylistChat] = useState<message[]>([]);

    useEffect(() => {
        socket.on("LIST_CHAT", (message: info2) => {
        // ... on recupere le message envoyer par le serveur ici et on remet la string en un objet
        if (global_channel === message.channel)
            setArraylistChat(message.list);
        });

        return () => {
          socket.off("LIST_CHAT");
        }
    },[])

    return (
        <>
          <div className="allBodyChat">
                <div className="headerChat">

                    <div className="iconeChat">
                        <CreatePopupChannel/>
                        <CreatePopupInviteUser/>
                        <MenuSettings />




                    </div>


                </div>

                <div className="centerChat">
                    {arrayChat.map((item) => {
                        if (!global_blocked.includes(item.id))
                        {
                            return (
                                <div >
                                    <h1 className="inputName"> {item.name} </h1>
                                    <h1 className="chathistory"> {item.message} </h1>
                                    <h1> </h1>
                                </div>
                            );
                        }
                        else
                            return (
                                <></>
                            );
                    })}

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

    // const [channelName, setChannelName] = useState("");
    const [arrayChannelName, setArrayChannelName] = useState<string[]>([]);
    const [arrayMpName, setArrayMpName] = useState<{name: string, username: string}[]>([]);

    useEffect(() => {
        socket.on("CHANNEL_CREATED", (message: string[]) => {
            setArrayChannelName(message);
        });

        socket.on("MP_CREATED", (data: {name: string, username: string}[]) => {
            setArrayMpName(data);
        });

        return (() => {
          socket.off("CHANNEL_CREATED");
          socket.off("MP_CREATED");
        })
    }, []);

    const display_channel = (char: string, item: string) => {
        return (
            <h1 className="channelName">
                <span className="dieseChannel">{char} </span>{item.substring(0, 10)}
            </h1>
        );
    }


    return (
        <>
            <div className="Allbodychannel">
                <div className="divJoinChannel">
                    <CreatePopupSearchChannel/>
                    <div className="headerChatchannel">
                        <h1 id="h1channel"> Channel</h1>
                    </div>
                <div className="centerChat">

                    <div className="testDM">
                    {arrayMpName.map((item) => {
                        return  <button className="buttonInviteUsers"
                                        onClick={() => {
                                            socket.emit("JUST_NAME_CHANNEL",
                                            {name: item.name, id: userId});
                                            global_channel = item.name;}}>
                                            {display_channel('@', item.username)}
                                </button>
                    })}
                    </div>

                    <div id="separation2"></div>
                    <div className="lesChannels">
                    {arrayChannelName.map((item) => {
                        return  <button className="buttonInviteUsers"
                                        onClick={() => {
                                            socket.emit("JUST_NAME_CHANNEL",
                                            {name: item, id: userId});
                                            global_channel = item;}}>
                                            {display_channel('#', item)}
                                </button>
                    })}

                    </div>
                </div>
                <div className="footerChatchannel">
                </div>
            </div>
            </div>
        </>
    );
}

function InviteUser(cible: number, gameName: string) {

    const gameInviteLink = "http://localhost:3000/game/join/".concat(gameName);
    socket.emit("INVITE", {target: cible, message: gameInviteLink, sender: userId}); //send invite link to user
}

function InviteUserPopUp(props: {cible: number}) {
    const [gameName, setGameName] = useState<string>(v4().substring(0, 10));
    const [open, setOpen] = useState(false);
    const [customMode, setCustomMode] = useState<string>("");

    return (
      <div>
        <MenuItem onClick={() => setOpen(true)}>Inviter à jouer</MenuItem>
        <Popup open={open} closeOnDocumentClick onClose={() => setOpen(false)}>
          <h5>Enter a name for your game:</h5>

          <div style={{margin: '2.5em auto 0 auto', width: 'fit-content'}}>
            <input className="input"
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />
          </div>

          <div className="checkBoxes">
            <input type="checkbox" id="customModeSpeed" name="customModeSpeed"
              onChange={(e) => {setCustomMode("customModeSpeed")}}/>
            <label><p>2x speed</p></label>

            <input type="checkbox" id="customModeColor" name="customModeColor"
              onChange={(e) => {setCustomMode("customModeColor")}}/>
            <label><p>color mode</p></label>

            <input type="checkbox" id="customModeOther" name="customModeOther"
              onChange={(e) => {setCustomMode("customModeOther")}}/>
            <label><p>other</p></label>
          </div>

          <br></br>

          <div style={{margin: 'auto', width: 'fit-content'}}>
            <button className="gameButton"
            onClick={() => {GameCreate(GameSocket, gameName, customMode); InviteUser(props.cible, gameName); setOpen(false); setGameName(v4().substring(0, 10))}}><h4>SEND</h4></button>
          </div>
        </Popup>
      </div>
    );
  }

function MenuMembre(props: {item: {id: number, name: string, status: number}}) {
    
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    let history = useHistory();

  const BlockOrUnblock = (id: number) => {
    if (global_blocked.includes(id))
        return <MenuItem onClick={() => handleClose({n: 8, id: id})} key={8}>Debloquer</MenuItem>;
    else
        return <MenuItem onClick={() => handleClose({n: 6, id: id})} key={6}>Bloquer</MenuItem>;
  }

  function promouvoir_admin(cible: number) {
    //recup la target pour que ca marche
    socket.emit("CHANGE_STATUS",  {channel: global_channel,  target: cible, sender: userId, status: status.admin});
  }

  function ban(cible: number) {
    //recup la target pour que ca marche
    socket.emit("CHANGE_STATUS",  {channel: global_channel,  target: cible, sender: userId, status: status.ban});
  }

  function mute(cible: number) {
    //recup la target pour que ca marche
    socket.emit("MUTE",  {channel: global_channel,  target: cible, sender: userId});
  }

  function block(cible: number) {
    socket.emit("BLOCK", {target: cible, sender: userId});
  }

  function unblock(cible: number) {
    socket.emit("UNBLOCK", {target: cible, sender: userId});
  }

  function sendmp(cible: number){
    socket.emit("CREATE_MP_CHAN", {target: cible, sender: userId});
  }

  const handleClose = (param: {n: number, id: number}) => {

    setAnchorEl(null);
    if (param.n === 4)
        promouvoir_admin(param.id);
    else if (param.n === 3)
        sendmp(param.id);
    else if (param.n === 5)
        mute(param.id);
    else if (param.n === 7)
        ban(param.id);
    else if (param.n === 6)
        block(param.id);
    else if (param.n === 8)
        unblock(param.id);
    else if (param.n === 1) {
        history.push("/profile");
        // <Link to={{ pathname: "/profiles", state: {id: param.id} }}></Link>
    }
  };

  let menu_onclick;
  let h1_name_role;
  if (props.item.id === userId)
  {
    menu_onclick = (<div key={Math.random() * 100}>
        <MenuItem onClick={() => handleClose({n: 1, id: props.item.id})} key={1}><Link to={{ pathname: "/profiles", state: {id: props.item.id} }}>Profil</Link></MenuItem>
        </div>)
  }
  else if (global_status === 0)
  {
    menu_onclick = (<div key={Math.random() * 100}>
        <MenuItem onClick={() => handleClose({n: 0, id: props.item.id})} key={0}><Link to={{ pathname: "/profiles", state: {id: props.item.id} }}>Profil</Link></MenuItem>
        <InviteUserPopUp cible={props.item.id}/>
        <MenuItem onClick={() => handleClose({n: 3, id: props.item.id})} key={3}>Envoyer un message</MenuItem>
        <MenuItem onClick={() => handleClose({n: 4, id: props.item.id})} key={4}>Promouvoir en admin</MenuItem>
        <MenuItem onClick={() => handleClose({n: 5, id: props.item.id})} key={5}>Mute</MenuItem>
        {BlockOrUnblock(props.item.id)}
        <MenuItem onClick={() => handleClose({n: 7, id: props.item.id})} key={7}>Bannir</MenuItem>


      </div>)
  }
  else if (global_status === 1)
  {
    menu_onclick = (
      <div key={Math.random() * 100}>
        <MenuItem onClick={() => handleClose({n: 0, id: props.item.id})} key={0}><Link to={{ pathname: "/profiles", state: {id: props.item.id} }}>Profil</Link></MenuItem>
        <InviteUserPopUp cible={props.item.id}/>
        <MenuItem onClick={() => handleClose({n: 3, id: props.item.id})} key={3}>Envoyer un message</MenuItem>
        <MenuItem onClick={() => handleClose({n: 4, id: props.item.id})} key={4}>Mute</MenuItem>
        {BlockOrUnblock(props.item.id)}
        <MenuItem onClick={() => handleClose({n: 7, id: props.item.id})} key={7}>Bannir</MenuItem>
        </div>)
  }
  else if (global_status)
  {
    menu_onclick =( <div key={Math.random() * 100}>
        <MenuItem selected className="MenuItem" onClick={() => handleClose({n: 0, id: props.item.id})} key={0}><Link to={{ pathname: "/profiles", state: {id: props.item.id} }}>Profil</Link></MenuItem> 
        <InviteUserPopUp cible={props.item.id}/>
        <MenuItem onClick={() => handleClose({n: 3, id: props.item.id})} key={3}>Envoyer un message</MenuItem>
        {BlockOrUnblock(props.item.id)}
            </div>)
  }

  if (props.item.status === 0)
  {
    h1_name_role = (<>
        <h1 className="personneDansChannelOwner"> {props.item.name}  </h1>
    </>)
  }
  else if (props.item.status === 1)
  {
    h1_name_role = (<>
        <h1 className="personneDansChannelAdmin"> {props.item.name}  </h1>
    </>)
  }
  else if (props.item.status === 2) {
    h1_name_role = (<>
        <h1 className="personneDansChannelDefault"> {props.item.name}  </h1>
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
            {}menu_onclick
      </Menu>
    </div>
  );
}

function ListChannel() {

    const [arraylistName, setArraylistName] = useState<{id: number, name: string, status: number}[]>([]);

      // réception d'un message envoyé par le serveur
    useEffect(() => {
        socket.on("LIST_NAME", (message: {channel: string, list: {id: number, name: string, status: number}[]}) => {
            // ... on recupere le message envoyer par le serveur ici et on remet la string en un objet
            if (message.channel === global_channel)
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

                    return <MenuMembre item={item} />
                })}

                </div>
                <div className="footerChatList">


                </div>

            </div>


        </>
    );
}

function Chat() {

    useEffect(() => {

        socket.on('BLOCKED', (data: number[]) => {
            global_blocked = data;
        });
        socket.on('STATUS', (status: number) => {
            global_status = status;
        });
        socket.on('ERROR', (data: string)=>{
          return (alert(data));
        });

        socket.emit('ready', userId);
        socket.emit("GET_CHANNEL", userId); 

        return () => {
          socket.off('ERROR');
          socket.off('STATUS');
          socket.off('BLOCKED');
        }
    }, [])
    
    return (
        <>
            <div className="rayaneleboloss">
                <Channel/>
                <Bodychat/>
                <ListChannel/>
            </div>
        </>
    );
}

export default Chat;
function setOpen(arg0: boolean) {
    throw new Error("Function not implemented.");
}
