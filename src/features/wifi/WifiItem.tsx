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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface WifiItemProps {
  item: WifiEntry;
  onPress?: (wifi: WifiEntry) => void;
  isSelected?: boolean;
  connected?: boolean;
  connectHandler?: (wifi: WifiEntry) => void;
  isOpenNetwork?: boolean;
}
const WifiItem = (props: WifiItemProps) => {
  const {item, onPress, isSelected, connectHandler, connected, isOpenNetwork} =
    props;
  const signalStrength = () => {
    const percentage = (item.level + 100) / 2; // Converts range (-100 to 0) to percentage
    const bars = Math.ceil(percentage / 20); // Convert percentage to 1-5 bars
    return {percentage, bars};
  };
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
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
          {connected && (
            <Text style={connected && {color: '#005eeb'}}>connected</Text>
          )}
          {!isOpenNetwork && (
            <Fontisto
              name="locked"
              color={connected ? '#005eeb' : 'black'}
              size={14}
            />
          )}
          <MaterialIcons
            name={`network-wifi-${signalStrength().bars}-bar`}
            style={{marginRight: 8}}
            size={18}
            color={connected ? '#005eeb' : 'black'}
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
    borderRadius: 50,
    marginTop: 24,
    marginRight: 8,
  },
  connectText: {
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
