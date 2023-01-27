import { View, Text, Button } from "react-native";


export default function Home({navigation}){

    return (
        <View>
            <Text>Envoie fesse</Text>
            <Button title="Signin" onPress={()=> navigation.navigate('Signin')}  />
            <Button title="Signup" onPress={()=> navigation.navigate('Signup')}  />
        </View>
    )
}