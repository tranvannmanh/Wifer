import { PermissionsAndroid } from 'react-native';

export const requestLocationPermission = async () => {
  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Access location',
      message: 'We need to access your location for scanning Wifi',
      buttonPositive: 'ACCESS',
      buttonNegative: 'DENY',
      buttonNeutral: 'Ask me later',
    }
  );
  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    //TODO
  } else {
    //TODO
  }
  return status;
};
