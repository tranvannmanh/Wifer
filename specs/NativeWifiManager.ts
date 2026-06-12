import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export type WifiEntry = Readonly<{
  SSID: string;
  BSSID: string;
  capabilities: string;
  frequency: number;
  level: number;
}>;

export interface Spec extends TurboModule {
  isEnabled(): Promise<boolean>;
  setEnabled(enabled: boolean): Promise<void>;
  loadWifiList(): Promise<ReadonlyArray<WifiEntry>>;
  reScanAndLoadWifiList(): Promise<ReadonlyArray<WifiEntry>>;
  getCurrentWifiSSID(): Promise<string>;
  connectToProtectedSSID(
    ssid: string,
    password: string,
    isWEP: boolean,
  ): Promise<void>;
  disconnect(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeWifiManager');
