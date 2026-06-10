/* eslint-disable react-native/no-inline-styles */
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {WifiEntry} from 'react-native-wifi-reborn';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CompareHorizontalIcon, WifiStrengthIcon} from '../../assets/icon';

export interface WifiItemProps {
  item: WifiEntry;
  onPress?: (wifi: WifiEntry) => void;
  isSelected?: boolean;
  connected?: boolean;
  connectHandler?: (wifi: WifiEntry) => Promise<void>;
  disconnectHandler?: (wifi: WifiEntry) => Promise<void>;
  isOpenNetwork?: boolean;
}
const WifiItem = (props: WifiItemProps) => {
  const {item, onPress, isSelected, connectHandler, connected, isOpenNetwork} =
    props;
  const max = -50;
  const min = -100;
  const signalStrength = () => {
    const percentage = ((item.level - min) * 100) / (max - min); // Converts range (-100 to -50) to percentage
    const bars = Math.ceil(percentage / 20) - 1; // Convert percentage to 1-5 bars
    return {percentage, bars};
  };
  const connectedColor = connected ? '#005eeb' : 'black';
  return (
    <Pressable
      onPress={() => onPress?.(item)}
      android_ripple={{
        color: 'lightgray',
      }}
      style={[
        styles.itemContainer,
        isSelected && {backgroundColor: '#F2F2F2'},
      ]}>
      <View style={styles.row}>
        <Text style={[styles.ssid, connected && {color: '#005eeb'}]}>
          {item.SSID}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: 12}}>
          {connected && (
            <CompareHorizontalIcon color="#005eeb" width={20} height={20} />
          )}
          {!isOpenNetwork && (
            <Fontisto name="locked" color={connectedColor} size={14} />
          )}
          <WifiStrengthIcon
            strength={signalStrength().bars}
            color={connectedColor}
            width={18}
            height={18}
          />
        </View>
      </View>
      {isSelected && (
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <TouchableOpacity
            onPress={() => connectHandler?.(item)}
            style={[
              styles.button,
              {backgroundColor: !connected ? '#005eeb' : '#bd2d58'},
            ]}>
            <Text style={[styles.connectText]}>
              {connected ? 'Disconnect' : 'Connect'}
            </Text>
            <MaterialCommunityIcons name="connection" color="white" />
          </TouchableOpacity>
        </View>
      )}
    </Pressable>
  );
};

export default React.memo(WifiItem);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 24,
  },
  connectText: {
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  itemContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  ssid: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
});
