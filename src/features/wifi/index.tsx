import {
  Animated,
  FlatList,
  RefreshControl,
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
import {WifiEntry} from 'react-native-wifi-reborn';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RefreshIcon} from '../../assets/icon';
import WifiConnectModal from './components/WifiConnectModal';

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
    disconnectWifi,
  } = useWifiViewModel();
  const [connectModalWifi, setConnectModalWifi] =
    React.useState<WifiEntry | null>(null);
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
  const isOpenNetwork = React.useCallback((wifi: WifiEntry) => {
    return wifi.capabilities.toUpperCase().includes('OPEN');
  }, []);
  const openConnectModal = React.useCallback(
    async (wifi: WifiEntry) => {
      const isConnected = wifiConnected === wifi.SSID;
      if (isConnected) {
        await disconnectWifi();
        return;
      }
      if (isOpenNetwork(wifi)) {
        await wifiConnectHandler(wifi);
      } else {
        setConnectModalWifi(wifi);
      }
    },
    [isOpenNetwork, wifiConnectHandler, disconnectWifi, wifiConnected],
  );
  const renderWifiItem = React.useCallback(
    ({item}: {item: WifiEntry}) => {
      return (
        <WifiItem
          item={item}
          isSelected={item.SSID === selectedWifi?.SSID}
          onPress={onSelectWifi}
          connectHandler={openConnectModal}
          connected={item.SSID === wifiConnected}
          disconnectHandler={disconnectWifi}
        />
      );
    },
    [
      onSelectWifi,
      selectedWifi?.SSID,
      openConnectModal,
      wifiConnected,
      disconnectWifi,
    ],
  );
  const renderWifiList = React.useCallback(() => {
    return (
      <View style={styles.list}>
        <FlatList
          data={wifis}
          onScroll={event => {
            const offsetY = event.nativeEvent.contentOffset.y;
            scrollOffsetY.setValue(offsetY);
          }}
          renderItem={renderWifiItem}
          keyExtractor={item => `${item.BSSID}`}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={androidReloadWifiList}
              tintColor="black"
            />
          }
        />
      </View>
    );
  }, [renderWifiItem, scrollOffsetY, wifis]);
  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor={'white'}
        barStyle={'dark-content'}
      />
      <WifiConnectModal
        wifi={connectModalWifi}
        visible={connectModalWifi !== null}
        onCancel={() => setConnectModalWifi(null)}
        onConnect={wifiConnectHandler}
      />
      <View style={styles.container}>
        <Animated.View style={[styles.headerContainer, {elevation}]}>
          <Text style={styles.wifiList}>{wifis.length} items</Text>
          <TouchableOpacity
            onPress={androidReloadWifiList}
            style={styles.refreshButton}>
            <RefreshIcon color="black" width={22} height={22} />
          </TouchableOpacity>
        </Animated.View>
        {renderWifiList()}
      </View>
    </View>
  );
};

export default WifiList;

const styles = StyleSheet.create({
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
  },
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
