//"getmsg": permet d'avoir tout les groupes d'un login
//param: string - login du user

//"addmember": permet d'enregistré un nouveau membre d'un groupe
//param: addmember
export class AddMemberDTO {
    login: string;

    channel: string;
}