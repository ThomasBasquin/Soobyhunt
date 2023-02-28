import {useMemo} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import COLORS from '../../Constantes/colors';

function Team({navigation}) {
//   const gameConfiguration = useMemo(
//     () => ({
//       name: 'Sprint 1',
//       modeDejeu: 'TIME',
//       limitTime: 600,
//       teams: [
//         {name: 'Team 1', nbJoueur: 4},
//         {name: 'Team 2', nbJoueur: 4},
//       ],
//       authorizedZone: [
//         {longitude: 7.739077538193167, latitude: 48.53086599339388},
//         {longitude: 7.7342370696461815, latitude: 48.53039720700373},
//         {longitude: 7.735364007999698, latitude: 48.528436780531386},
//         {longitude: 7.739345856848781, latitude: 48.52830892399476},
//       ],
//       unauthorizedZone: [],
//       mechants: [
//         {idMechant: 1, longitude: 48.5298, latitude: 7.736889},
//         {idMechant: 2, longitude: 48.529857, latitude: 7.737983},
//       ],
//       items: [{name: "SAC_A_DOS", quantite: 3, longitude: 48.529949, latitude: 7.735344}], 
//       private: true,
//       idCreator: 3,
//     }),
//     [],
//   );

  const gameConfiguration = useMemo(
    () => ({
      name: 'Sprint 1',
      modeDejeu: 'TIME',
      limitTime: 600,
      teams: [
        {name: 'Team 1', nbJoueur: 4},
        {name: 'Team 2', nbJoueur: 4},
      ],
      authorizedZone: [
        {longitude: 7.682864480865984, latitude: 48.493037111158976},
        {longitude: 7.6810674009482796, latitude: 48.492982007713096},
        {longitude: 7.681142502795587, latitude: 48.49206834830178},
        {longitude: 7.682751828095023, latitude: 48.49226565746728},
      ],
      unauthorizedZone: [],
      mechants: [
        {idMechant: 1, longitude: 7.6822341617903716, latitude: 48.49264605315083},
        {idMechant: 2, longitude: 7.681874745806831, latitude: 48.529492747373015156857},
      ],
      items: [{name: "SAC_A_DOS", quantite: 3, longitude: 7.682032996127943, latitude: 48.49256961873324}], 
      private: true,
      idCreator: 3,
    }),
    [],
  );

  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        flex: 1,
      }}>
      <TouchableOpacity
        style={{
          marginVertical: '1%',
          padding: 10,
          width: '48%',
          backgroundColor: COLORS.primary,
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          navigation.navigate('Home', {gameConfiguration});
        }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: '600',
            color: COLORS.white,
          }}>
          Charger la configuration
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default Team;
