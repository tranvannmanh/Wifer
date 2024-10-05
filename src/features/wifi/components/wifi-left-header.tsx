/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';

const WiferLeftHeader = () => {
  return (
    <View style={styles.rowWithGap}>
      <Fontisto name="wifi-logo" size={30} color="black" />
      <Text style={styles.wifier}>W I F E R </Text>
    </View>
  );
};

export default WiferLeftHeader;

const styles = StyleSheet.create({
  rowWithGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  wifier: {
    fontSize: 20,
    color: 'black',
    fontWeight: '500',
  },
});
