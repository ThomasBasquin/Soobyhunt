import { useNavigate } from "react-router-dom"

export default function ItemConfig({ config, selectConfig, selected, index, deleteConfig }) {
    const navigate = useNavigate();

    return <div className={selected ? "item-config item-selected" : "item-config"} onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        selectConfig(config, index)
    }}>
        <div className="div-text-config" onClick={() => selectConfig(config, index)}>
            <div><b>{config.json.name}</b></div>
            <div>{config.createdAt.substr(0, 10)}</div>
        </div>

        <div className="div-btn-config">
            <div className="btn-edit-config" onClick={() => navigate("/carte", { state: { config: config } })}>
                <img src="edit.svg" alt="" className="img-btn-edit-config" />
            </div>
            <div className="btn-delete-config" onClick={() => deleteConfig(config.id)}>
                <img src="bin.png" alt="" className="img-btn-edit-config" />
            </div>
        </div>
    </div>
}