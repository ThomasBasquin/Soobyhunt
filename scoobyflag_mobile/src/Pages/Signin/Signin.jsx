import { Button, Text, View } from "react-native";


export default function Signin({navigation}){
    return (
        <View>
        <Text>Signin</Text>
        <Button title="Home" onPress={()=> navigation.navigate("Home")}  />
        <Button title="Signup" onPress={()=> navigation.navigate("Signup")}  />
        </View>
    )
}