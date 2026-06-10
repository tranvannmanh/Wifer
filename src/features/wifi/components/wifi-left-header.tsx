/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {IncognitoIcon} from '../../../assets/icon';

const WiferLeftHeader = () => {
  return (
    <View style={styles.rowWithGap}>
      <IncognitoIcon width={22} height={22} color="black" />
      <Text style={styles.wifier}>W I F E R v2</Text>
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
