import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useAppState } from '../state/AppState';
import { View, TouchableOpacity, Image, Text, SafeAreaView, Button, Platform, StatusBar } from 'react-native';
import { SportList } from '../components/SportList';

export const DrawerContent = observer((props: any) => {

    return (
        <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, backgroundColor: '#072d4f', flex: 1 }}>
            <View style={{ marginLeft: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: '#fff' }}>Sport list</Text>
                    <TouchableOpacity style={{ marginRight: 8 }} onPress={() => props.navigation.closeDrawer()}><Text style={{ fontSize: 24, fontWeight: '700', color: '#fff' }}>X</Text></TouchableOpacity>
                </View>
                <View>
                    <SportList closeDrawer={props.navigation.closeDrawer} navigation={props.navigation} />
                </View>
            </View>
        </SafeAreaView>
    )
})
