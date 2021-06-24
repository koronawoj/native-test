
import * as React from 'react';
import { useAppState } from '../state/AppState';
import { observer } from 'mobx-react-lite';
import { SPORTS_LIST } from 'state/Test/TestState'; 
import { ScrollView, TouchableOpacity, Text } from 'react-native';

export const SportList = observer(({closeDrawer, navigation}) => {
    const { testState } = useAppState();

    const { onChangeSport } = testState;

    const changeSport = (id: string) => {
        onChangeSport(id);
        closeDrawer();
        navigation.navigate('SportPageScreen')
    }

    return (
        <ScrollView>
            {SPORTS_LIST.map(elem => {
                return (
                    <TouchableOpacity key={elem.id} onPress={() => changeSport(elem.id)}>
                        <Text style={{ color: '#fff', fontSize: 16, marginBottom: 4 }}>{elem.name}</Text>
                    </TouchableOpacity>
                )
            })}
        </ScrollView>
    )
});
