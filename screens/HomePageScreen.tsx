import * as React from 'react';
import { StyleSheet, Modal, Button } from 'react-native';
import { Text, View } from '../components/Themed';
import { observer } from 'mobx-react-lite';
import { useAppState } from '../state/AppState';
import { FlatList, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Platform, StatusBar } from 'react-native';
import { SPORTS_LIST } from '../state/Test/TestState';
import { SportList } from '../components/SportList';


export const HomePageScreen = observer(() => {
    const [text, onChangeText] = React.useState("");

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Sport from left menu</Text>

            <Modal
                visible={true}
            >
                <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, flex: 1 }}>
                    <Text style={styles.title}>Login: </Text>    

                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeText}
                        placeholder="Type login"
                        value={text}
                    />
                    <Button title="Login" onPress={() => console.log('log in')} />
                </SafeAreaView>
            </Modal>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
    },
});
