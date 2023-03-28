import { MapContainer, TileLayer, FeatureGroup, Marker, Popup } from 'react-leaflet';
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
    const [partieLancee, setPartieLancee] = useState(false);

    const [zoneJeu, setZoneJeu] = useState([]);
    const [zonesInterdites, setZonesInterdites] = useState([]);
    const [mechants, setMechants] = useState([]);
    const [items, setItems] = useState([]);
    const [joueurs, setJoueurs] = useState([]);

    useEffect(() => {
        getLocation();
    }, [])

    const getLocation = () => {
        if (!navigator.geolocation) {
            setStatus('Votre navigateur ne supporte pas la géolocalisation');
        }
        else {
            setStatus("Localisation...");
            setLatitude(48.530437);
            setLongitude(7.735647777777776);
            setStatus(null);
            /*navigator.geolocation.getCurrentPosition((position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                console.log(position.coords);
                setStatus(null);
            }, () => {
                setStatus("Impossible de récupérer votre position");
            });*/
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
        console.log(e.layerType);
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
            console.log(zoneJeu);
            console.log(pointInPolygon([e.layer.getLatLng().lat, e.layer.getLatLng().lng], zoneJeu));
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

    const ajouterJoueur = (coordonnees) => {
        setJoueurs(oldJoueurs => [...oldJoueurs, { id: oldJoueurs.length, coordonnees: coordonnees }]);
    }

    const deplacerJoueur = (idJoueur, coordonnees) => {
        const newJoueurs = joueurs.map((joueur, i) => {
            if (i === idJoueur) {
                // Increment the clicked counter
                return { id: joueur.id, coordonnees: coordonnees };
            } else {
                // The rest haven't changed
                return joueur;
            }
        });
        setJoueurs(newJoueurs);
    }

    async function createGame(modeJeu, listeEquipe) {
        const response = await fetch("http://127.0.0.1:8000/game/create/template", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: "Sprint 1", //A CHANGER
                modeDeJeu: modeJeu,
                limitTime: 600, //A CHANGER
                teams: listeEquipe,
                authorizedZone: zoneJeu,
                unauthorizedZone: zonesInterdites,
                mechants: mechants,
                items: items,
                private: true, //A CHANGER
                idCreator: 3, //
            }),
        })
            .then((res) => {
                console.log(res);
                if (res.ok) {
                    return res.json();
                }
            })
            .then((json) => {
                console.log(json);
                const id = json.gameTemplate.id;
                launchGame(id);
            });

        // ajouterJoueur([48.530437, 7.735647777777776]);
        // ajouterJoueur([48.531437, 7.735]);
        // setPartieLancee(true);
    }

    async function launchGame(id) {
        fetch("http://127.0.0.1:8000/game/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id,
            }),
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((json) => {
                console.log(json);
            });
    }

    const test = () => {
        console.log("a");
        deplacerJoueur(0, [48.536, 7.735647777777776])
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
            {partieLancee ? <>
                {joueurs.map(joueur => {
                    return <Marker key={joueur.id} position={joueur.coordonnees}>
                        <Popup>ID Joueur : {joueur.id}</Popup>
                    </Marker>
                })}
                <div onClick={test} className='btnTest'></div>
            </> : <></>}
        </MapContainer>
        {!partieLancee ? <>
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
            <Config createGame={createGame} /> </> : <></>}
    </> : <h1>{status}</h1>)
}

