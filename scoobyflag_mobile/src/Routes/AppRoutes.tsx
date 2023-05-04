import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Team from '../Pages/Team/Team';
import Welcome from '../Pages/Welcome/Welcome';


const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown:false}}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Team" component={Team} />
    </Stack.Navigator>
  );
}
