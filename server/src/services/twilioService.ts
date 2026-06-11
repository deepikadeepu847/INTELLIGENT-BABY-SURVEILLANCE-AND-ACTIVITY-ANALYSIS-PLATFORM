const { SerialPort } = require('serialport');
SerialPort.list().then(ports => {
  console.log('PORTS:', JSON.stringify(ports, null, 2));
}).catch(console.error);
