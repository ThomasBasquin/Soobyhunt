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
    const [clickedSupprimer, setClickedSupprimer] = useState(false);

    const [zoneJeu, setZoneJeu] = useState([]);
    const [zonesInterdites, setZonesInterdites] = useState([]);
    const [mechants, setMechants] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        getLocation();

        // The subscriber subscribes to updates for the https://example.com/users/dunglas topic
        // and to any topic matching https://example.com/books/{id}
        /*const url = new URL("http://82.165.109.36/.well-known/mercure");
        url.searchParams.append("topic", "https://example.com/books/{id}");
        url.searchParams.append("topic", "https://example.com/users/dunglas");
        // The URL class is a convenient way to generate URLs such as https://localhost/.well-known/mercure?topic=https://example.com/books/{id}&topic=https://example.com/users/dunglas

        const eventSource = new EventSource(url);

        // The callback will be called every time an update is published
        eventSource.onmessage = (e) => console.log(e); // do something with the payload*/
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
        if (e.layerType === 'polygon') {
            if (e.layer.options.color == 'red') {
                var tabTemp = zonesInterdites;
                tabTemp.push(e.layer.getLatLngs()[0]);
                setZonesInterdites(tabTemp);
            }
            else {
                setZoneJeu(e.layer.getLatLngs()[0]);
            }
        }
        else {
            if (e.layer._icon.attributes.src.nodeValue == "/src/assets/mechant1.png") {
                var tabTemp = mechants;
                tabTemp.push(e.layer.getLatLng());
                setMechants(tabTemp);
            }
            else {
                var tabTemp = items;
                tabTemp.push({
                    "name": "loupe",
                    "coordonnees": e.layer.getLatLng()
                });
                setItems(tabTemp);
            }
        }
    }

    const clickZoneJeu = (e) => {
        if (zoneJeu.length > 0) {
            alert("La zone de jeu est déjà présente, modifiez la ou supprimez la pour en créer une nouvelle.");
        }
        else {
            var e = document.createEvent('Event');
            e.initEvent('click', true, true);
            var cb = document.getElementsByClassName('leaflet-draw-draw-polygon');
            return !cb[0].dispatchEvent(e);
        }
    }

    const clickZoneInterdite = (e) => {
        var e = document.createEvent('Event');
        e.initEvent('click', true, true);
        var cb = document.getElementsByClassName('leaflet-draw-draw-polygon');
        return !cb[1].dispatchEvent(e);
    }

    const clickMechant = (e) => {
        var e = document.createEvent('Event');
        e.initEvent('click', true, true);
        var cb = document.getElementsByClassName('leaflet-draw-draw-marker');
        return !cb[0].dispatchEvent(e);
    }

    const clickObjet = (e) => {
        var e = document.createEvent('Event');
        e.initEvent('click', true, true);
        var cb = document.getElementsByClassName('leaflet-draw-draw-marker');
        return !cb[1].dispatchEvent(e);
    }

    const clickEdit = (e) => {
        var e = document.createEvent('Event');
        e.initEvent('click', true, true);
        var cb = document.getElementsByClassName('leaflet-draw-edit-edit');
        return !cb[0].dispatchEvent(e);
    }

    const clickSupprimer = (e) => {
        if (clickedSupprimer) {
            //setClickedSupprimer(false);
            var e = document.createEvent('Event');
            e.initEvent('click', true, true);
            var cb = document.getElementsByClassName('leaflet-draw-actions')[2].children[1];
            return !cb.dispatchEvent(e);
        }
        else {
            //setClickedSupprimer(true);
            var e = document.createEvent('Event');
            e.initEvent('click', true, true);
            var cb = document.getElementsByClassName('leaflet-draw-edit-remove');
            return !cb[0].dispatchEvent(e);
        }
    }

    return (status == null ? <>
        <MapContainer center={[latitude, longitude]} zoom={16}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FeatureGroup>
                <EditControl position='topright'
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
                    onCreated={e => onCreated(e)} />
                <EditControl position='topright'
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
                    }} />
            </FeatureGroup>
        </MapContainer>
        <div className='sideBar'>
            <div id='btnZone' onClick={(e) => clickZoneJeu(e)} className='btnSideBar'>
                <img src="gaming-zone.png" alt="" className='iconBar' />
                Zone de jeu
            </div>
            <div id='btnZoneInterdite' onClick={(e) => clickZoneInterdite(e)} className='btnSideBar'>
                <img src="forbidden.png" alt="" className='iconBar' />
                Zone interdite
            </div>
            <div id='btnFlag' onClick={(e) => clickMechant(e)} className='btnSideBar'>
                <img src="mechant1.png" alt="" className='iconBar' />
                Méchants
            </div>
            <div id='btnItems' onClick={(e) => clickObjet(e)} className='btnSideBar'>
                <img src="loupe.png" alt="" className='iconBar' />
                Objets
            </div>
            <div id='btnZone' onClick={(e) => clickEdit(e)} className='btnSideBar'>
                <img src="edit.png" alt="" className='iconBar' />
                Editer
            </div>
            <div id='btnZone' onClick={(e) => clickSupprimer(e)} className='btnSideBar'>
                <img src="bin.png" alt="" className='iconBar' />
                Supprimer
            </div>
        </div>
        <img onClick={() => clickBtnConfig()} className='btnConfig' src="settings.svg" alt="" />
        <Config zoneJeu={zoneJeu} zonesInterdites={zonesInterdites} mechants={mechants} items={items} />
    </> : <h1>{status}</h1>)
}

