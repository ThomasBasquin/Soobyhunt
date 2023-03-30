import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../Pages/Home/Home';
import Team from '../Pages/Team/Team';


const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <Stack.Navigator initialRouteName="Team" screenOptions={{headerShown:false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Team" component={Team} />
    </Stack.Navigator>
  );
}
