import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {WifiEntry} from 'react-native-wifi-reborn';
import Fontisto from 'react-native-vector-icons/Fontisto';

interface WifiConnectModalProps {
  wifi: WifiEntry | null;
  visible: boolean;
  onCancel: () => void;
  onConnect: (wifi: WifiEntry, password: string) => Promise<void>;
}

const WifiConnectModal = ({
  wifi,
  visible,
  onCancel,
  onConnect,
}: WifiConnectModalProps) => {
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [connecting, setConnecting] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      setPassword('');
      setShowPassword(false);
    }
  }, [visible]);

  const handleConnect = async () => {
    if (!wifi) {
      return;
    }
    setConnecting(true);
    try {
      await onConnect(wifi, password);
      onCancel();
    } finally {
      setConnecting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onCancel}>
        <TouchableOpacity activeOpacity={1} style={styles.card}>
          <View style={styles.header}>
            <Fontisto name="locked" color="black" size={16} />
            <Text style={styles.title} numberOfLines={1}>
              {wifi?.SSID}
            </Text>
          </View>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Enter password"
              placeholderTextColor="#999"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleConnect}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(v => !v)}
              style={styles.eyeButton}>
              <Fontisto
                name={showPassword ? 'eye' : 'eye-slash'}
                color="#666"
                size={16}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              disabled={connecting}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.connectButton,
                connecting && styles.connectButtonDisabled,
              ]}
              onPress={handleConnect}
              disabled={connecting}>
              <Text style={styles.connectText}>
                {connecting ? 'Connecting…' : 'Connect'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default WifiConnectModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    height: 46,
    fontSize: 16,
    color: 'black',
  },
  eyeButton: {
    paddingLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelText: {
    color: '#333',
    fontSize: 15,
  },
  connectButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#005eeb',
  },
  connectButtonDisabled: {
    opacity: 0.6,
  },
  connectText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});
