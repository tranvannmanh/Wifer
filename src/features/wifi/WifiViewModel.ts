import React from 'react';
import WifiManager, {WifiEntry} from 'react-native-wifi-reborn';
import { LayoutAnimation, PermissionsAndroid} from 'react-native';
import {stringCompare} from '../../utils/string-helper';

export const useWifiViewModel = () => {
  const [wifis, setWifis] = React.useState<WifiEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedWifi, setSelectedWifi] = React.useState<WifiEntry>();
  const [isWifiEnabled, setIsWifiEnabled] = React.useState(true);
  const [wifiConnected, setWifiConnected] = React.useState<string>('');
  const wifiScan = React.useCallback(async () => {
    try {
      const locationAccessGranted = await PermissionsAndroid.check(
        'android.permission.ACCESS_FINE_LOCATION',
      );
      if (locationAccessGranted) {
        const isEnabled = await WifiManager.isEnabled();
        setIsWifiEnabled(isEnabled);
        if (isEnabled) {
          const wifiList = await WifiManager.loadWifiList();
          setWifis(wifiList);
        }
      }
    } catch (error) {
      console.log('FAIL TO LOAD WIFI LIST');
    } finally {
      setLoading(false);
    }
  }, []);
  const getCurrentWifi = React.useCallback(async () => {
    await WifiManager.getCurrentWifiSSID().then(ssid => setWifiConnected(ssid))
  }, []);
  React.useEffect(() => {
    wifiScan();
    getCurrentWifi();
  }, [getCurrentWifi, wifiScan]);
  const toggleWifiEnable = React.useCallback(() => {
    WifiManager.setEnabled(!isWifiEnabled);
  }, [isWifiEnabled]);
  const onSelectWifi = React.useCallback((w: WifiEntry) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedWifi(w);
  }, []);
  const androidReloadWifiList = React.useCallback(async () => {
    try {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setLoading(true);
      const reWifiList = await WifiManager.reScanAndLoadWifiList();
      setWifis(reWifiList);
    } catch (error) {
      console.log('FAIL TO RELOAD WIFI LIST');
    } finally {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setLoading(false);
    }
  }, []);

  const sortBySSID = React.useCallback((a: WifiEntry, b: WifiEntry) => {
    return stringCompare(a.SSID, b.SSID);
  }, []);
  const isOpenNetwork = React.useCallback((wifi: WifiEntry) => {
    const capabilities = wifi.capabilities;
    return !capabilities || capabilities.includes('ESS');
  }, []);
  const wifiConnectHandler = React.useCallback(
    async (wifi: WifiEntry) => {
      try {
        const isOpen = isOpenNetwork(wifi);
        await WifiManager.connectToProtectedSSID(
          wifi.SSID,
          isOpen ? '' : 'trang1938',
          false,
          false,
        ).then(() => setWifiConnected(wifi.SSID));
      } catch (error) {
        console.log('CONNECT TO NETWORK FAIL');
      }
    },
    [isOpenNetwork],
  );
  return {
    wifis: wifis
      .reduce((list, cur) => {
        const idx = list.findIndex(w => w.SSID === cur.SSID);
        if (idx === -1) {
          list.push(cur);
        }
        return list;
      }, [] as WifiEntry[])
      .sort(sortBySSID),
    androidReloadWifiList,
    loading,
    setLoading,
    selectedWifi,
    onSelectWifi,
    wifiConnectHandler,
    isOpenNetwork,
    toggleWifiEnable,
    isWifiEnabled,
    wifiConnected,
  };
};
