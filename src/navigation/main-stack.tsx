import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Screens} from '../routes/screen';
import WifiList from '../features/wifi';
import WiferLeftHeader from '../features/wifi/components/wifi-left-header';

// export interface MainStackParamsList {
//   [Screens.WIFI_HOME]: undefined;
// }

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Screens.WIFI_HOME}
        component={WifiList}
        options={{
          title: '',
          headerShadowVisible: false,
          headerLeft: WiferLeftHeader,
        }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
