import {
  ActivityIndicator,
  Animated,
  FlatList,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useWifiViewModel} from './WifiViewModel';
import WifiItem from './WifiItem';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {WifiEntry} from 'react-native-wifi-reborn';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

interface WiferListProps extends NativeStackScreenProps<any, any> {}
const WifiList = (props: WiferListProps) => {
  const {navigation} = props;
  const {
    wifis,
    androidReloadWifiList,
    selectedWifi,
    onSelectWifi,
    isWifiEnabled,
    toggleWifiEnable,
    wifiConnectHandler,
    wifiConnected,
    loading,
  } = useWifiViewModel();
  const scrollOffsetY = React.useRef(new Animated.Value(0)).current;
  const elevation = scrollOffsetY.interpolate({
    inputRange: [5, 50],
    outputRange: [0, 4],
    extrapolate: 'clamp',
  });
  React.useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <Switch
          value={isWifiEnabled}
          onValueChange={toggleWifiEnable}
          thumbColor={'black'}
          trackColor={{
            false: '#F2F2F2',
            true: 'lightgray',
          }}
        />
      ),
    });
  }, [isWifiEnabled, navigation, toggleWifiEnable]);
  const renderWifiItem = React.useCallback(
    ({item}: {item: WifiEntry}) => {
      return (
        <WifiItem
          item={item}
          isSelected={item.SSID === selectedWifi?.SSID}
          onPress={onSelectWifi}
          connectHandler={wifiConnectHandler}
          connected={item.SSID === wifiConnected}
        />
      );
    },
    [onSelectWifi, selectedWifi?.SSID, wifiConnectHandler, wifiConnected],
  );
  const renderWifiList = React.useCallback(() => {
    return (
      <FlatList
        data={wifis}
        onScroll={event => {
          const offsetY = event.nativeEvent.contentOffset.y;
          scrollOffsetY.setValue(offsetY);
        }}
        renderItem={renderWifiItem}
        keyExtractor={item => `${item.BSSID}`}
      />
    );
  }, [renderWifiItem, scrollOffsetY, wifis]);
  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor={'white'}
        barStyle={'dark-content'}
      />
      <View style={styles.container}>
        <Animated.View style={[styles.headerContainer, {elevation}]}>
          <Text style={styles.wifiList}>tranvanmanh's wifer</Text>
          <TouchableOpacity onPress={androidReloadWifiList}>
            <MaterialCommunityIcons
              name="reload"
              color="black"
              size={22}
              // eslint-disable-next-line react-native/no-inline-styles
              style={{marginRight: 6}}
            />
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.list}>
          {loading && (
            <ActivityIndicator
              size="small"
              color="black"
              style={styles.loadingIndicator}
            />
          )}
          {renderWifiList()}
        </View>
      </View>
    </View>
  );
};

export default WifiList;

const styles = StyleSheet.create({
  loadingIndicator: {
    marginVertical: 16,
  },
  container: {
    marginTop: 8,
    overflow: 'hidden',
    flex: 1,
  },
  flastlist: {
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'white',
  },
  root: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'white',
  },
  list: {
    flex: 1,
    backgroundColor: 'white',
  },
  wifiList: {
    color: 'black',
    fontSize: 24,
    fontWeight: '500',
  },
});
