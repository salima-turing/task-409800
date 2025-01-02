
const BufferPool = require('buffer-pool');
const Buffer = require('buffer');

class SensorDataBuffer {
    constructor(sensorType, bufferSize = 1024) {
        this.sensorType = sensorType;
        this.bufferSize = bufferSize;
        this.bufferPool = new BufferPool(bufferSize);
        this.currentBuffer = this.bufferPool.take();
        this.currentIndex = 0;
    }

    push(data) {
        const dataLength = data.length;
        if (this.currentIndex + dataLength > this.bufferSize) {
            // If adding data would overflow the current buffer, flush the current buffer
            this.flush();
            // Start a new buffer
            this.currentBuffer = this.bufferPool.take();
            this.currentIndex = 0;
        }

        // Copy data into the current buffer
        data.copy(this.currentBuffer, this.currentIndex);
        this.currentIndex += dataLength;
    }

    flush() {
        if (this.currentIndex > 0) {
            // Process the current buffer
            processSensorData(this.sensorType, this.currentBuffer.slice(0, this.currentIndex));

            // Return the buffer to the pool for reuse
            this.bufferPool.put(this.currentBuffer);
            this.currentBuffer = this.bufferPool.take();
            this.currentIndex = 0;
        }
    }

    destroy() {
        this.bufferPool.destroy();
    }
}

function processSensorData(sensorType, dataBuffer) {
    // Main processing logic for sensor data
    // Implement the specific processing for each sensor type here
    if (sensorType === 'accelerometer') {
        // Example: Accelerometer data processing
        const numSamples = dataBuffer.length / (3 * 2); // Assuming 2 bytes per axis value
        for (let i = 0; i < numSamples; i++) {
            const x = dataBuffer.readInt16LE(i * 6);
            const y = dataBuffer.readInt16LE(i * 6 + 2);
            const z = dataBuffer.readInt16LE(i * 6 + 4);
            // Process accelerometer values (x, y, z)
        }
    } else if (sensorType === 'gyroscope') {
        // Example: Gyroscope data processing
        // Implement gyroscope data processing here
    }
    // Add processing logic for other sensor types as needed
}

// Example usage:
const accelerometerBuffer = new SensorDataBuffer('accelerometer');
const gyroscopeBuffer = new SensorDataBuffer('gyroscope');

setInterval(() => {
    // Simulate accelerometer data
    const accelerometerData = Buffer.alloc(6); // 3 axes * 2 bytes per axis
    accelerometerData.writeInt16LE(Math.random() * 1000 - 500, 0); // x
    accelerometerData.writeInt16LE(Math.random() * 1000 - 500, 2); // y
    accelerometerData.writeInt16LE(Math.random() * 1000 - 500, 4); // z
    accelerometerBuffer.push(accelerometerData);

    // Simulate gyroscope data
    const gyroscopeData = Buffer.alloc(6); // 3 axes * 2 bytes per axis
    gyroscopeData.writeInt16LE(Math.random() * 1000 - 500, 0); // x
    gyroscopeData.writeInt16LE(Math.random() * 1000 - 500, 2); // y
    gyroscopeData.writeInt16LE(Math.random() * 1000 - 500, 4); // z
    gyroscopeBuffer.push(gyroscopeData);
}, 10); // Simulate sensor data at 100Hz

process.on('SIGINT', () => {
    accelerometerBuffer.destroy();
    gyroscopeBuffer.destroy();
    console.log('System shutting down...');
});
