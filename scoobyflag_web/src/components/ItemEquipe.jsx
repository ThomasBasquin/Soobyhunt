export default function ItemEquipe({ equipe, deleteEquipe }) {
    return <div className="itemEquipe">
        <div>{equipe.nom}</div>
        <div>{equipe.nbJoueur}</div>
        <img src="scooby.png" alt="" className="btnDeleteEquipe" onClick={deleteEquipe} />
    </div>
}