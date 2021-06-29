import * as React from 'react';
import { StyleSheet, Modal, Button } from 'react-native';
import { Text, View } from '../components/Themed';
import { observer } from 'mobx-react-lite';
import { useAppState } from '../state/AppState';
import { FlatList, ScrollView, TouchableOpacity, TextInput, Platform, StatusBar } from 'react-native';
import { SPORTS_LIST } from '../state/Test/TestState';
import { SportList } from '../components/SportList';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HomePageScreen = observer(() => {
    const [login, onChangeLogin] = React.useState("");
    const [password, onChangePassword] = React.useState("");
    const { testState } = useAppState();
    const { accountState } = testState;

    const handleLogin = () => {
        accountState.onLogin({
            login: login,
            password: password,
        });
    }

    console.log('----->', accountState.account?.name);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Sport from left menu</Text>

            <Modal
                visible={accountState.isModalVisible}
                animationType="slide"
            >
                <SafeAreaView>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 16 }}>
                        <Text style={styles.title}>Login: </Text>
                        <Text style={styles.title} onPress={accountState.onChangeModalVisibility}>X</Text>
                    </View>

                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeLogin}
                        placeholder="Type login"
                        value={login}
                    />

                    <TextInput
                        style={styles.input}
                        onChangeText={onChangePassword}
                        placeholder="Type password"
                        value={password}
                    />

                    <Button title="Login" onPress={handleLogin} />

                    <Text style={{ color: 'red'}}>{accountState.account?.name ?? 'no name'}</Text>

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
