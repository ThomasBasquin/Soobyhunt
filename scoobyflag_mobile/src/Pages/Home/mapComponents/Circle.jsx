import{Circle as CircleComponent} from 'react-native-maps';
import GAME_CONFIG from '../../../Constantes/gameConfig';

function Circle({currentPosition}){

    return (
        <CircleComponent
        center={currentPosition}
        radius={GAME_CONFIG.visibilityRange.test}
        strokeColor={'rgba(0, 255, 0,0.9)'}
        fillColor={'rgba(102, 255, 102,.3)'}
        zIndex={2}
      />
    )
}

export default Circle;