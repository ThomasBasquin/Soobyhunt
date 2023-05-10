export const NOTIF_IN_MAP = {
  nearAObject: {
    type: 'NEAR_OBJECT',
    title: 'Un objet est proche',
    desc: "Vous vous approchez d'un objet, cherchez autour de vous pour le découvrir",
  },
  outOfMap: {
    type: 'OUT_OF_MAP',
    title: 'Vous êtes en dehors de la zone de jeu',
    desc: "Attention ! Vous vous éloignez de la zone de jeu. Faites demi-tour pour continuer à jouer",
  },
  inUnauthorizedZone: {
    type: 'IN_UNAUTHORIZED_ZONE',
    title: 'Attention ! Vous êtes dans une zone interdite',
    desc: "Sortez de la zone interdite pour continuer de jouer",
  },
};

export const NOTIF_PUSH = {};
