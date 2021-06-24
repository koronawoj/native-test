import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { observer } from 'mobx-react-lite';
import { useAppState } from '../state/AppState';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { SPORTS_LIST } from '../state/Test/TestState'; 
import { SportList } from '../components/SportList'; 
import { EventRow } from '../components/EventRow'; 

const renderItem = ({ item }: {
    item: {
        id: number;
        name: string;
    }
}) => (
    <EventRow id={item.id}/>
);

export const SportPageScreen = observer(() => {
    const { testState } = useAppState();

    const { listEventName, activeSportForView, eventsList, onChangeSport } = testState;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{activeSportForView}</Text>

            {activeSportForView === '' ? (
                <Text style={styles.title}>Select Sport</Text>
            ) : eventsList.isLoading ? (
                <Text style={styles.title}>Loading</Text>
            ) : (
                <FlatList
                    data={listEventName}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                />
            )}

        </View>
    );
});

const styles = StyleSheet.create({
    container: {
    },
    title: {
        marginVertical: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
