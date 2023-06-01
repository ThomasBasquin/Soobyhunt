import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../Pages/Home/Home';
import Party from '../Pages/Party/Party';


const Stack = createNativeStackNavigator();

export default function PartyRoutes() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown:false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Party" component={Party} />
    </Stack.Navigator>
  );
}
