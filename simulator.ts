/**
 * Sober Guard Hardware Simulator
 * 
 * This script simulates a microcontroller (ESP32/ESP8266) by:
 * 1. Sending random sensor readings to the API via POST requests.
 * 2. Connecting to the WebSocket to monitor broadcasts (verifying the real-time flow).
 * 
 * Usage:
 *   bun simulator.ts [server_url] [device_id]
 */

const args = process.argv.slice(2);
const BASE_URL = args[0] || 'http://localhost:3000';
const DEVICE_ID = args[1] || 'simulated_device_01';

// Convert http(s) to ws(s)
const WS_URL = BASE_URL.replace(/^http/, 'ws') + '/ws';

console.log(`🚀 Starting simulator for device: ${DEVICE_ID}`);
console.log(`📡 Target API: ${BASE_URL}`);
console.log(`🔌 WebSocket: ${WS_URL}`);

async function startSimulator() {
  // 1. Connect to WebSocket to monitor broadcasts
  const ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log('✅ Connected to WebSocket broadcast channel');
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'new_reading' && message.data.deviceId === DEVICE_ID) {
      console.log(`   [WS Broadcast Received] Value: ${message.data.value} PPM`);
    }
  };

  ws.onerror = (error) => {
    console.error('❌ WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('🔌 WebSocket connection closed');
  };

  // 2. Start sending readings via POST (matching hardware behavior)
  while (true) {
    // 20% chance of a high "UNSAFE" reading (401 - 800 PPM)
    // 80% chance of a "SAFE" reading (10 - 150 PPM)
    const isUnsafe = Math.random() < 0.2;
    const value = isUnsafe 
      ? parseFloat((Math.random() * 400 + 401).toFixed(2))
      : parseFloat((Math.random() * 140 + 10).toFixed(2));
    
    const statusLabel = value > 400 ? '🔴 UNSAFE' : '🟢 SAFE';
    console.log(`\n📤 Sending reading: ${value} PPM [${statusLabel}]...`);

    try {
      const response = await fetch(`${BASE_URL}/api/sensor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value,
          deviceId: DEVICE_ID,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ API Response:', result);

      if (result.turnOnLed) {
        console.log('🚨 [ALERT] Server commanded LED ON!');
      }

    } catch (error) {
      console.error('❌ Error sending reading:', error.message);
    }

    // Wait for 5 seconds before next reading (matching hardware loop)
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

startSimulator().catch(console.error);
