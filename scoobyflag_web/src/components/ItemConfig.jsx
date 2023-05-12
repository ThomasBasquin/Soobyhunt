export default function ItemConfig({ config, selectConfig }) {
    return <div className="item-config">
        <div className="div-text-config">
            <div><b>{config.json.name}</b></div>
            <div>12/05/2023</div>
        </div>
        <div className="div-btn-config">
            <div className="btn-edit-config">
                <img src="edit.svg" alt="" className="img-btn-edit-config" />
            </div>
            <div className="btn-select-config" onClick={() => selectConfig(config)}>
                <img src="fleche.svg" alt="" className="img-btn-select-config" />
            </div>
        </div>
    </div>
}