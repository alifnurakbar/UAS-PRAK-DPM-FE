import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HomeScreen from '../screens/HomeScreen';
import TravelScreen from '../screens/TravelScreen';
import ReportScreen from '../screens/ReportScreen';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#F4ECE2', height: 90, paddingBottom: 10, paddingTop: 10, borderColor: '#5C4033', borderWidth: 1 },
        tabBarActiveTintColor: '#5C4033',
        tabBarInactiveTintColor: '#8B5E3C',
        tabBarLabelStyle: { fontSize: 12, marginTop: 4 },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
            return <AntDesign name={iconName} size={size} color={color} />;
          } else if (route.name === 'Travel') {
            iconName = 'car';
            return <AntDesign name={iconName} size={size} color={color} />;
          } else if (route.name === 'Report') {
            iconName = 'filetext1';
            return <AntDesign name={iconName} size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Travel" component={TravelScreen} />
      <Tab.Screen name="Report" component={ReportScreen} />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
