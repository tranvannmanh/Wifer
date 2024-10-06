/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import MainStack from './src/navigation/main-stack';
import {requestLocationPermission} from './src/permissions';
import {Platform, UIManager} from 'react-native';
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
function App(): React.JSX.Element {
  React.useEffect(() => {
    requestLocationPermission();
  }, []);
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}

export default App;
