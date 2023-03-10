import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import "../css/carte.css";
import "../css/config.css";
import mechant1 from "../assets/mechant1.png";
import loupe from "../assets/loupe.png";
import pointInPolygon from "point-in-polygon";
import Config from "../components/Config";
import { EditControl } from 'react-leaflet-draw';

export default function Carte() {
    const [latitude, setLatitude] = useState(0.0);
    const [longitude, setLongitude] = useState(0.0);
    const [status, setStatus] = useState("");
    const [menuConfig, setMenuConfig] = useState(false);
    
    const [zoneJeu, setZoneJeu] = useState([]);
    const [zonesInterdites, setZonesInterdites] = useState([]);
    const [mechants, setMechants] = useState([]);
    const [items, setItems] = useState([]);

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

    const onCreated = (e) => {
        if (e.layerType === 'polygon'){
            if(e.layer.options.color=='red'){
                var tabTemp = zonesInterdites;
                tabTemp.push(e.layer.getLatLngs()[0]);
                setZonesInterdites(tabTemp);
            }
            else{
                setZoneJeu(e.layer.getLatLngs()[0]);
            }
        }
        else{
            if(e.layer._icon.attributes.src.nodeValue == "/src/assets/mechant1.png"){
                var tabTemp = mechants;
                tabTemp.push(e.layer.getLatLng());
                setMechants(tabTemp);
            }
            else{
                var tabTemp = items;
                tabTemp.push({
                    "name":"loupe",
                    "coordonnees":e.layer.getLatLng()
                });
                setItems(tabTemp);
            }
        }
    }

    const clickItem = (e) => {
        var e = document.createEvent('Event');
        e.initEvent('click', true, true);
        var cb = document.getElementsByClassName('leaflet-draw-draw-polygon');
        return !cb[0].dispatchEvent(e);
    }

    return (status == null ? <>
        <MapContainer center={[latitude, longitude]} zoom={16}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
                    onCreated={ e => onCreated(e)} />
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
        </MapContainer>
        {/*<div className='sideBar'>
            <div id='btnZone' onClick={(e) => clickItem(e)} className='btnSideBar selected'>Zone</div>
            <div id='btnZoneInterdite' onClick={() => changeMode("zoneInterdite")} className='btnSideBar'>Zone interdite</div>
            <div id='btnFlag' onClick={() => changeMode("flag")} className='btnSideBar'>Drapeaux</div>
            <div id='btnItems' onClick={() => changeMode("items")} className='btnSideBar'>Items</div>
        </div>*/}
        <img onClick={() => clickBtnConfig()} className='btnConfig' src="settings.svg" alt="" />
        <Config zoneJeu={zoneJeu} zonesInterdites={zonesInterdites} mechants={mechants} items={items}/>
    </> : <h1>{status}</h1>)
}

