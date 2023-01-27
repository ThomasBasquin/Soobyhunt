import React from "react";
import { View, Text, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../Services/reducers/userSlice";


export default function Home({navigation}){

    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    dispatch(setUser({email:"hello",firstname:"hello",lastname:"hello"}));

    return (
        <View>
            <Text>Envoie fesse</Text>
            <Text>{user.email}</Text>
            <Button title="Signin" onPress={()=> navigation.navigate('Signin')}  />
            <Button title="Signup" onPress={()=> navigation.navigate('Signup')}  />
        </View>
    )
}