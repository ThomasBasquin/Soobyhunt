import { MapContainer, TileLayer, Marker, Popup, Polygon, LayerGroup, useMapEvents, LayersControl, FeatureGroup } from 'react-leaflet';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import "../css/map.css";
import "../css/config.css";
import mechant1 from "../assets/mechant1.png";
import loupe from "../assets/loupe.png";
import pointInPolygon from "point-in-polygon";
import Config from "./Config";
import { EditControl } from 'react-leaflet-draw';

export default function Map() {
    const [latitude, setLatitude] = useState(0.0);
    const [longitude, setLongitude] = useState(0.0);
    const [status, setStatus] = useState("");
    const [pointsZone, setPointsZone] = useState([]);
    const [pointsInterdit, setPointsInterdits] = useState([]);
    const [flags, setFlags] = useState([]);
    const [clickMode, setClickMode] = useState("zone");
    const markerRef = useRef([]);
    const flagsRef = useRef([]);
    const pointsInterditRef = useRef([]);
    const [menuConfig, setMenuConfig] = useState(false);
    
    var zoneInterdites = [];
    var zoneJeu = [];
    var mechants = [];
    var items = [];

    var zoneJeu = pointsZone.map((point) => {
        return [point.lat, point.lng]
    })

    var zoneInterdite = pointsInterdit.map((point) => {
        return [point.lat, point.lng]
    })

    useEffect(() => {
        getLocation();
    }, [])

    const getLocation = () => {
        if (!navigator.geolocation) {
            setStatus('Votre navigateur ne supporte pas la géolocalisation');
        }
        else {
            setStatus("Localisation...");
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position);
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setStatus(null);
            }, () => {
                setStatus("Impossible de récupérer votre position");
            });
        }
    }

    const mechant1Icon = new L.icon({
        iconUrl: mechant1,
        iconSize: [50, 50],
        iconAnchor: [25, 25]
    })

    const loupeIcon = new L.icon({
        iconUrl: loupe,
        iconSize: [50, 50],
        iconAnchor: [25, 25]
    })

    const changeMode = (mode) => {
        if (mode == "flag") {
            setClickMode("flag");
            document.getElementById("btnFlag").classList.add("selected");
            document.getElementById("btnZoneInterdite").classList.remove("selected");
            document.getElementById("btnZone").classList.remove("selected");
            document.getElementById("btnItems").classList.remove("selected");
        }
        else if (mode == "zoneInterdite") {
            setClickMode("zoneInterdite");
            document.getElementById("btnFlag").classList.remove("selected");
            document.getElementById("btnZoneInterdite").classList.add("selected");
            document.getElementById("btnZone").classList.remove("selected");
            document.getElementById("btnItems").classList.remove("selected");
        }
        else if (mode == "zone") {
            setClickMode("zone");
            document.getElementById("btnFlag").classList.remove("selected");
            document.getElementById("btnZoneInterdite").classList.remove("selected");
            document.getElementById("btnZone").classList.add("selected");
            document.getElementById("btnItems").classList.remove("selected");
        }
        else if (mode == "items") {
            setClickMode("items");
            document.getElementById("btnFlag").classList.remove("selected");
            document.getElementById("btnZoneInterdite").classList.remove("selected");
            document.getElementById("btnZone").classList.remove("selected");
            document.getElementById("btnItems").classList.add("selected");
        }
    }

    const clickBtnConfig = () => {
        if (menuConfig) {
            setMenuConfig(false);
            document.querySelector(".menuConfig").classList.add("slideOut");
            document.querySelector(".menuConfig").classList.remove("slideIn");
        }
        else {
            setMenuConfig(true);
            document.querySelector(".menuConfig").classList.add("slideIn");
            document.querySelector(".menuConfig").classList.remove("slideOut");
        }
    }

    const dragPointZone = (index) => {
        setTimeout(() => {
            const marker = markerRef.current[index]
            var pointsTemp = [...pointsZone];
            pointsTemp[index] = { lat: marker.getLatLng().lat, lng: marker.getLatLng().lng }
            setPointsZone(pointsTemp);
        }, 1)
    }

    const removePointZone = (index) => {
        var pointsTemp = [...pointsZone];
        pointsTemp.splice(index, 1);
        setPointsZone(pointsTemp);
    }

    const dragFlag = (index) => {
        setTimeout(() => {
            const marker = flagsRef.current[index]
            var flagsTemp = [...flags];
            flagsTemp[index] = { lat: marker.getLatLng().lat, lng: marker.getLatLng().lng }
            setFlags(flagsTemp);

            console.log(pointInPolygon([marker.getLatLng().lat, marker.getLatLng().lng], zoneJeu))
            console.log(pointInPolygon([marker.getLatLng().lat, marker.getLatLng().lng], zoneInterdite))
        }, 1)
    }

    const removeFlag = (index) => {
        setTimeout(() => {
            var flagsTemp = [...flags];
            flagsTemp.splice(index, 1);
            setFlags(flagsTemp);
        }, 1)
    }

    const dragPointInterdit = (index) => {
        setTimeout(() => {
            const marker = pointsInterditRef.current[index]
            var pointsTemp = [...pointsInterdit];
            pointsTemp[index] = { lat: marker.getLatLng().lat, lng: marker.getLatLng().lng }
            setPointsInterdits(pointsTemp);
        }, 1)
    }

    const removePointInterdit = (index) => {
        var pointsTemp = [...pointsInterdit];
        pointsTemp.splice(index, 1);
        setPointsInterdits(pointsTemp);
    }

    const layerListener = {
        add: (e) => {
            //console.log("Added Layer:", e.target);
        },
        remove: (e) => {
            //console.log("Removed layer:", e.target);
        }
    }

    function ClickController() {
        const map = useMapEvents({
            click: (e) => {
                /*if (clickMode == "flag") {
                    var flagsTemp = [...flags];
                    flagsTemp.push({ lat: e.latlng.lat, lng: e.latlng.lng });
                    setFlags(flagsTemp);
                }
                else if (clickMode == "zone") {
                    var pointsTemp = [...pointsZone];
                    pointsTemp.push({ lat: e.latlng.lat, lng: e.latlng.lng });
                    setPointsZone(pointsTemp);
                }
                else if (clickMode == "zoneInterdite") {
                    var pointsTemp = [...pointsInterdit];
                    pointsTemp.push({ lat: e.latlng.lat, lng: e.latlng.lng });
                    setPointsInterdits(pointsTemp);
                }
                else if (clickMode == "items") {

                }*/
            }
        })
        return null
    }

    const onCreated = (e) => {
        if (e.layerType === 'polygon'){
            if(e.layer.options.color=='red'){
                zoneInterdites.push(e.layer.getLatLngs()[0]);
                console.log(zoneInterdites);
            }
            else{
                zoneJeu = e.layer.getLatLngs()[0];
                console.log(zoneJeu);
            }
        }
        else{
            if(e.layer._icon.attributes.src.nodeValue == "src/assets/mechant1.png"){
                mechants.push(e.layer.getLatLng());
                console.log(mechants);
            }
            else{
                items.push(e.layer.getLatLng());
                console.log(items);
            }
        }
    }

    return (status == null ? <>
        <MapContainer center={[latitude, longitude]} zoom={16}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LayersControl position="topleft" >
                <LayersControl.Overlay checked name='Zone de jeu'>
                    <LayerGroup eventHandlers={layerListener}>
                        <Polygon pathOptions={{ color: 'purple' }} positions={zoneJeu} />
                        {pointsZone.map((point, index) => {
                            return <Marker position={[point.lat, point.lng]} draggable={true} eventHandlers={{ dragend: () => dragPointZone(index), click: () => removePointZone(index) }} ref={el => markerRef.current[index] = el} key={index} icon={markerIcon} />
                        })}
                        <Polygon pathOptions={{ color: 'red' }} positions={zoneInterdite} />
                        {pointsInterdit.map((point, index) => {
                            return <Marker position={[point.lat, point.lng]} draggable={true} eventHandlers={{ dragend: () => dragPointInterdit(index), click: () => removePointInterdit(index) }} ref={el => pointsInterditRef.current[index] = el} key={index} icon={markerIcon} />
                        })}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay checked name='Drapeaux'>
                    <LayerGroup eventHandlers={layerListener}>
                        {flags.map((flag, index) => {
                            return <Marker position={[flag.lat, flag.lng]} key={index} draggable={true} eventHandlers={{ dragend: () => dragFlag(index) }} ref={el => flagsRef.current[index] = el} icon={flagIcon}>
                                <Popup>
                                    <button onClick={() => removeFlag(index)}>Supprimer</button>
                                </Popup>
                            </Marker>
                        })}
                    </LayerGroup>
                </LayersControl.Overlay>
            </LayersControl>
            <FeatureGroup>
                <EditControl position='topleft'
                    draw={{
                        polyline: false,
                        rectangle: false,
                        circlemarker: false,
                        circle: false,
                        marker: {
                            icon: mechant1Icon
                        },
                        polygon: true,
                    }}
                    edit={{
                        remove: false,
                        edit: false
                    }}
                    onCreated={ e => onCreated(e)}/>
                <EditControl position='topleft'
                    draw={{
                        polyline: false,
                        rectangle: false,
                        circlemarker: false,
                        circle: false,
                        marker: {
                            icon: loupeIcon
                        },
                        polygon: {
                            shapeOptions: {
                                guidelineDistance: 10,
                                color: "red",
                                weight: 3
                            }
                        },
                    }}/>
            </FeatureGroup>
            <ClickController />
        </MapContainer>
        {/*<div className='sideBar'>
            <div id='btnZone' onClick={() => changeMode("zone")} className='btnSideBar selected'>Zone</div>
            <div id='btnZoneInterdite' onClick={() => changeMode("zoneInterdite")} className='btnSideBar'>Zone interdite</div>
            <div id='btnFlag' onClick={() => changeMode("flag")} className='btnSideBar'>Drapeaux</div>
            <div id='btnItems' onClick={() => changeMode("items")} className='btnSideBar'>Items</div>
                </div>*/}
        <img onClick={() => clickBtnConfig()} className='btnConfig' src="settings.svg" alt="" />
        <Config />
    </> : <h1>{status}</h1>)
}

