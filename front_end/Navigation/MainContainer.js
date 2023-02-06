import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import MapsScreen from './Screens/MapsScreen';
import PreferencesScreen from './Screens/PreferencesScreen';

//Screen names
const mapsName = "Maps";
const preferencesName = "Preferences";

const Tab = createBottomTabNavigator();

function MainContainer() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={mapsName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === mapsName) {
              iconName = focused ? 'navigate' : 'navigate-outline';

            } else if (rn === preferencesName) {
              iconName = focused ? 'ios-car' : 'ios-car-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          headerShown: false,
          tabBarActiveTintColor: '#10b5f2',
          tabBarLabelStyle: { fontSize: 13 },
          tabBarStyle: {
            height: '12%',
            paddingBottom: '10%',
            borderTopWidth: 0,
            borderTopLeftRadius:40,
            borderTopRightRadius:40,
            position: 'absolute',
            overflow:'hidden',
            left: 0,
            bottom: 0,
            right: 0,
            padding:5,
          }
        })}
        >

        <Tab.Screen name={mapsName} component={MapsScreen} />
        <Tab.Screen name={preferencesName} component={PreferencesScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;
