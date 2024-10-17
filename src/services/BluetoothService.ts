import { toast } from "@/hooks/use-toast";

const NICLA_SERVICE_UUID = '19b10000-0000-537e-4f6c-d104768a1214';

const NICLA_CHARACTERISTIC_UUIDS = {
  temperature: '19b10000-2001-537e-4f6c-d104768a1214',
  humidity: '19b10000-3001-537e-4f6c-d104768a1214',
  pressure: '19b10000-4001-537e-4f6c-d104768a1214',
  iaq: '19b10000-9001-537e-4f6c-d104768a1214',
  co2: '19b10000-9002-537e-4f6c-d104768a1214',
  gas: '19b10000-9003-537e-4f6c-d104768a1214'
};

class BluetoothService {
  device: BluetoothDevice | null = null;
  server: BluetoothRemoteGATTServer | null = null;
  service: BluetoothRemoteGATTService | null = null;
  characteristics: { [key: string]: BluetoothRemoteGATTCharacteristic } = {};

  async connect() {
    try {
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [NICLA_SERVICE_UUID] }]
      });

      if (!this.device) {
        throw new Error('No device selected');
      }

      this.device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));
      
      this.server = await this.device.gatt?.connect();
      if (!this.server) {
        throw new Error('Failed to connect to GATT server');
      }

      this.service = await this.server.getPrimaryService(NICLA_SERVICE_UUID);
      if (!this.service) {
        throw new Error('Service not found');
      }

      for (const [key, uuid] of Object.entries(NICLA_CHARACTERISTIC_UUIDS)) {
        this.characteristics[key] = await this.service.getCharacteristic(uuid);
      }

      toast({
        title: "Connected",
        description: "Successfully connected to Nicla Sense ME.",
      });

      return true;
    } catch (error) {
      console.error('Error connecting to Nicla Sense ME:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to Nicla Sense ME. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  async disconnect() {
    if (this.device && this.device.gatt?.connected) {
      await this.device.gatt.disconnect();
    }
  }

  onDisconnected() {
    toast({
      title: "Disconnected",
      description: "Nicla Sense ME has been disconnected.",
      variant: "destructive",
    });
    this.device = null;
    this.server = null;
    this.service = null;
    this.characteristics = {};
  }

  async readCharacteristic(characteristicKey: string): Promise<number> {
    const characteristic = this.characteristics[characteristicKey];
    if (!characteristic) {
      throw new Error(`Characteristic ${characteristicKey} not found`);
    }

    const value = await characteristic.readValue();
    switch (characteristicKey) {
      case 'temperature':
        return value.getFloat32(0, true);
      case 'humidity':
        return value.getUint8(0);
      case 'pressure':
        return value.getFloat32(0, true);
      case 'iaq':
        return value.getFloat32(0, true);
      case 'co2':
      case 'gas':
        return value.getUint32(0, true);
      default:
        throw new Error(`Unknown characteristic: ${characteristicKey}`);
    }
  }

  isConnected(): boolean {
    return this.device !== null && this.device.gatt?.connected === true;
  }
}

export const bluetoothService = new BluetoothService();