import ITeam from "./ITeam";

export default interface IServer{
    server?:string;
    idUser?:string;
    pseudo?:string; //PSEUDO DU JOUEUR DANS LE SERVER
    team?:ITeam;
    map?:string;//JSON DE LA MAP
}