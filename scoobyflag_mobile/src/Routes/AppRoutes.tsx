import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../Pages/Home/Home';
import Signin from '../Pages/Signin/Signin';
import Signup from '../Pages/Signup/Signup';

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Signin" component={Signin} />
    </Stack.Navigator>
  );
}
