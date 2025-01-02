class SensorDataBuffer {
    constructor(bufferSize, onBatchProcessed) {
        this.bufferSize = bufferSize;
        this.onBatchProcessed = onBatchProcessed;
        this.buffers = new Map();
    }

    addSensorData(sensorId, data) {
        if (!this.buffers.has(sensorId)) {
            this.buffers.set(sensorId, []);
        }

        const sensorBuffer = this.buffers.get(sensorId);
        sensorBuffer.push(data);

        if (sensorBuffer.length >= this.bufferSize) {
            const batch = sensorBuffer.splice(0, this.bufferSize); // Get a batch for processing
            this.processBatch(sensorId, batch);
        }
    }

    processBatch(sensorId, batch) {
        // Transform and process the batch, then trigger the callback
        const processedData = this.transformData(batch);
        this.onBatchProcessed(sensorId, processedData);
    }

    transformData(batch) {
        // Implement your transformation logic here
        // For example, for numeric data, you could calculate averages
        return batch; // Placeholder for actual transformed data
    }
}

const bufferSize = 10; // Define your buffer size,
const sensorBuffer = new SensorDataBuffer(bufferSize, (sensorId, processedData) => {
    // Main processing logic here
    console.log(`Processed data for ${sensorId}:`, processedData);
});

// Simulate adding sensor data
setInterval(() => {
    const sensorId = 'sensor1';
    const sensorData = Math.random(); // Example sensor data
    sensorBuffer.addSensorData(sensorId, sensorData);
}, 100); // Add data every 100ms
