import { SerialPort } from 'serialport';
import { Socket } from 'socket.io';

/**
 * ArduinoBridge: Connects our Web App to a physical Arduino via USB
 * Listens for 'fan-control' events from the dashboard and 
 * sends '1' or '0' to the Arduino over Serial.
 * Now supports dynamic COM port switching!
 */
export class ArduinoBridge {
  private port: SerialPort | null = null;
  private isConnected = false;
  private currentPath: string;
  private baudRate: number;

  constructor(path: string = 'COM3', baudRate: number = 115200) {
    this.currentPath = path;
    this.baudRate = baudRate;
    this.connect(path);
  }

  // List all available serial ports on the host system
  static async listPorts() {
    try {
      const ports = await SerialPort.list();
      return ports.map(p => ({
        path: p.path,
        manufacturer: p.manufacturer || 'Unknown',
        pnpId: p.pnpId || 'N/A'
      }));
    } catch (err) {
      console.error('[Arduino Bridge] Error listing ports:', err);
      return [];
    }
  }

  // Connect or reconnect to a specific COM port
  connect(path: string) {
    // Close existing connection if open
    if (this.port && this.port.isOpen) {
      this.port.close();
      this.isConnected = false;
      console.log(`[Arduino Bridge] Closed old connection on ${this.currentPath}`);
    }

    this.currentPath = path;

    try {
      this.port = new SerialPort({
        path: this.currentPath,
        baudRate: this.baudRate,
        autoOpen: false
      });

      this.port.open((err: Error | null) => {
        if (err) {
          console.error(`[Arduino Bridge] Error opening port ${this.currentPath}:`, err.message);
          this.isConnected = false;
          return;
        }
        this.isConnected = true;
        console.log(`[Arduino Bridge] Successfully connected to Arduino on ${this.currentPath}`);
      });
    } catch (error) {
      this.isConnected = false;
      console.error('[Arduino Bridge] Setup Error:', error);
    }
  }

  setupListeners(socket: Socket) {
    socket.on('fan-control', (data: any) => {
      if (!this.isConnected || !this.port) return;

      const command = data.state === 'on' ? '1' : '0';
      this.port.write(command, (err: Error | null | undefined) => {
        if (err) {
          console.error('[Arduino Bridge] Error writing to serial:', err.message);
        } else {
          console.log(`[Arduino Bridge] Relayed command '${command}' to Arduino`);
        }
      });
    });
  }

  // Directly send a serial command to the Arduino
  sendCommand(command: string) {
    if (!this.isConnected || !this.port) {
      console.warn('[Arduino Bridge] Cannot send command, not connected.');
      return;
    }
    this.port.write(command, (err: Error | null | undefined) => {
      if (err) {
        console.error('[Arduino Bridge] Error writing to serial:', err.message);
      } else {
        console.log(`[Arduino Bridge] Sent command '${command}' to Arduino`);
      }
    });
  }

  getStatus() {
    return {
      status: this.isConnected ? 'Connected' : 'Disconnected',
      path: this.currentPath
    };
  }
}
