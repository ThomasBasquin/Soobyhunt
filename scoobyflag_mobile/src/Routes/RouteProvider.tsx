import AppRoutes from './AppRoutes';
import {NavigationContainer} from '@react-navigation/native';
import PartyRoutes from './PartyRoutes';
import useServer from '../Constantes/Hooks/useServer';

export default function RouteProvider() {
  const [server] = useServer();

  return (
    <NavigationContainer>
      {server.map ? <PartyRoutes /> : <AppRoutes />}
    </NavigationContainer>
  );
}
