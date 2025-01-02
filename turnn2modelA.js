class CircularBuffer {
    constructor(size) {
        this.size = size;
        this.buffer = new Float32Array(size); // Change Float32Array type based on your data
        this.head = 0;
        this.full = false;
    }

    add(value) {
        this.buffer[this.head] = value;
        if (this.full) {
            this.head = (this.head + 1) % this.size; // Move head circularly if full
        } else {
            this.head++;
            if (this.head === this.size) {
                this.full = true; // Mark as full once the head wraps around
                this.head = 0; // Reset head for circular writing
            }
        }
    }

    getAll() {
        if (!this.full) {
            return this.buffer.slice(0, this.head); // Return filled part
        }
        // Create a copy of the full circular buffer
        return this.buffer.slice(this.head).concat(this.buffer.slice(0, this.head));
    }

    getLatest() {
        return this.buffer[(this.head - 1 + this.size) % this.size]; // Get the latest value
    }

    getSize() {
        return this.full ? this.size : this.head; // Return current filled size
    }
}

class SensorDataBuffer {
    constructor(bufferSize, onBatchProcessed) {
        this.bufferSize = bufferSize;
        this.onBatchProcessed = onBatchProcessed;
        this.buffers = new Map();
    }

    addSensorData(sensorId, data) {
        if (!this.buffers.has(sensorId)) {
            this.buffers.set(sensorId, new CircularBuffer(this.bufferSize));
        }

        const sensorBuffer = this.buffers.get(sensorId);
        sensorBuffer.add(data);

        // Trigger processing if the buffer is full
        if (sensorBuffer.getSize() >= this.bufferSize) {
            const batch = sensorBuffer.getAll(); // Get all data for processing
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
        // For example, calculate average of the batch
        const sum = batch.reduce((acc, val) => acc + val, 0);
        const average = sum / batch.length;
        return { average, count: batch.length }; // Example result
    }
}

const bufferSize = 10; // Define your buffer size
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
