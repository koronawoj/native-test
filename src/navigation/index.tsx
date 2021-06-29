/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme, DarkTheme, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import { DrawerContent } from './DrawerContent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, TouchableOpacity, Image, Modal } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useAppState } from 'src/state/AppState';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
    const Drawer = createDrawerNavigator();

    return (
        <NavigationContainer>
            <Drawer.Navigator
                drawerContent={props => <DrawerContent {...props} />}
            >
                <Drawer.Screen
                    name="HomeScreenDrawerStack"
                    component={RootNavigator}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

const getHeaderTitle = (route: any) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Root';

    switch (routeName) {
        case 'HomePage':
            return 'Home';
        case 'Root':
            return 'Home';
        case 'TabOne':
            return 'TabOne';
        case 'TabTwo':
            return 'TabTwo';
    }
};

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator({ navigation }: any) {

    return (
        <Stack.Navigator initialRouteName="Root">
            <Stack.Screen
                name="Root"
                component={BottomTabNavigator}
                options={({ route }) => ({
                    headerTitle: 'Star sports',
                    headerLeft: () => (
                        <NavigationDrawerStructure
                            navigationProps={navigation}
                        />
                    ),
                    headerRight: () => (
                        <UserMenuOptions />
                    ),
                    headerStyle: {
                        backgroundColor: '#072d4f', //Set Header color
                    },
                    headerTintColor: 'rgb(253, 197, 0)', //Set Header text color
                    headerTitleStyle: {
                        fontWeight: 'bold', //Set Header text style
                    },
                })}
            />
            <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
        </Stack.Navigator>
    );
}

const NavigationDrawerStructure = (props: any) => {
    const toggleDrawer = () => {
        props.navigationProps.toggleDrawer();
    };

    return (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => toggleDrawer()}>
                <Image
                    source={{
                        uri:
                            'https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png',
                    }}
                    style={{ width: 25, height: 25, marginLeft: 5 }}
                />
            </TouchableOpacity>
        </View>
    );
};

const UserMenuOptions = observer(() => {
    const { testState } = useAppState();

    const toggleDrawer = () => {
        testState.accountState.onChangeModalVisibility();
    };

    return (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => toggleDrawer()}>
                <Image
                    source={{
                        uri:
                            'https://cdn.iconscout.com/icon/free/png-512/account-269-866236.png',
                    }}
                    style={{ width: 25, height: 25, marginLeft: 5 }}
                />
            </TouchableOpacity>
        </View>
    );
});
