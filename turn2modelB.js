class SensorDataBuffer {
    constructor(sensorId, bufferSize) {
        this.sensorId = sensorId;
        this.bufferSize = bufferSize;
        this.data = new Float32Array(bufferSize);
        this.index = 0;
        this.count = 0;
        this.onBatchProcessed = () => {};
    }

    addSensorData(value) {
        this.data[this.index] = value;
        this.index = (this.index + 1) % this.bufferSize;
        this.count = Math.min(this.count + 1, this.bufferSize);

        if (this.count === this.bufferSize) {
            const batch = this.data.subarray(0, this.bufferSize);
            this.processBatch(batch);
        }
    }

    processBatch(batch) {
        const processedData = this.transformData(batch);
        this.onBatchProcessed(processedData);
    }

    transformData(batch) {
        // Example: Calculate average
        const sum = batch.reduce((acc, val) => acc + val, 0);
        return sum / batch.length;
    }

    getLatestReadings() {
        // Get the most recent readings as a slice of the circular buffer
        const startIndex = (this.index + this.bufferSize - this.count) % this.bufferSize;
        return this.data.subarray(startIndex, this.index);
    }
}

const bufferSize = 100; // Define the sliding window size
const sensors = {};

const handleProcessedData = (sensorId, processedData) => {
    // Main processing logic here
    console.log(`Processed data for ${sensorId}:`, processedData);
};

// Set up buffers for each sensor
const sensor1 = new SensorDataBuffer('sensor1', bufferSize);
sensor1.onBatchProcessed = (processedData) => {
    handleProcessedData('sensor1', processedData);
};
sensors['sensor1'] = sensor1;

// Simulate adding sensor data
setInterval(() => {
    const sensorId = 'sensor1';
    const sensorData = Math.random() * 100; // Example sensor data
    sensors[sensorId].addSensorData(sensorData);
}, 10); // Add data every 10ms
