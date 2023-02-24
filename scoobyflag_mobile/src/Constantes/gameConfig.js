const GAME_CONFIG={
    visibilityRange: {
        //Visibilité en mètre
        user: 50,
        flag: 100,
        item: 50,
      },
      map:{
        refreshUserLocation:10000,
        minZoom:11,
        maxZoom:18,
      },
      item:{
        max:2,
        maxWithSac:4
      }
};

export default GAME_CONFIG;