import React from "react"

export default function ItemEquipe({ equipe, deleteEquipe, updateEquipe }) {
    return <div className="itemEquipe">
        <input type="text" placeholder="Nom de l'équipe" value={equipe.nom} onChange={(e) => updateEquipe(equipe.id, e.target.value, equipe.nbJoueur)}></input>
        <input type="number" min={1} max={999} value={equipe.nbJoueur} onChange={(e) => updateEquipe(equipe.id, equipe.nom, e.target.value)}></input>
        <img src="bin.png" alt="" className="btnDeleteEquipe" onClick={deleteEquipe} />
    </div>
}