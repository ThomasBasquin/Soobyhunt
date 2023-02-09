import AppRoutes from './AppRoutes';
import {NavigationContainer} from '@react-navigation/native';

export default function RouteProvider() {
  return (
    <NavigationContainer>
      <AppRoutes />
    </NavigationContainer>
  );
}
