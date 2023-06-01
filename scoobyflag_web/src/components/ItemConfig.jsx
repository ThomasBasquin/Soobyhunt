export default function ItemConfig({ config, selectConfig, selected, index }) {
    return <div className={selected ? "item-config item-selected" : "item-config"} onClick={() => selectConfig(config, index)}>
        <div className="div-text-config">
            <div><b>{config.json.name}</b></div>
            <div>{config.createdAt.substr(0, 10)}</div>
        </div>
        <div className="btn-edit-config">
            <img src="edit.svg" alt="" className="img-btn-edit-config" />
        </div>
    </div>
}