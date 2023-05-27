import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

import Screen1 from './components/Screen1';
import Screen2 from './components/Screen2';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Drawer.Navigator  useLegacyImplementation screenOptions={{ drawerPosition: "left" }} initialRouteName="Recherche">
          <Drawer.Screen name="Recherche" component={Screen1} />
          <Drawer.Screen name="A propos" component={Screen2} />
        </Drawer.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
  },
});
