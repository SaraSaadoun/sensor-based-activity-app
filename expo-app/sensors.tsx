import React, { useState, useEffect } from "react";
import { StyleSheet, Button, View, Text } from "react-native";
import { Accelerometer, Gyroscope, AccelerometerMeasurement, GyroscopeMeasurement } from "expo-sensors";
import { StatusBar } from "expo-status-bar";

export default function Sensors() {
    const [accReadings, setAccReadings] = useState<Array<AccelerometerMeasurement>>([]);
    const [gyroReadings, setGyroReadings] = useState<Array<GyroscopeMeasurement>>([]);

    useEffect(() => {
        const subscription = Accelerometer.addListener(accelerometerData => {
            setAccReadings(prevReadings => [...prevReadings, accelerometerData]);
        });
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        const subscription = Gyroscope.addListener(gyroscopeData => {
            setGyroReadings(prevReadings => [...prevReadings, gyroscopeData]);
        });
        return () => subscription.remove();
    }, []);

    const sendDataToServer = async () => {
        // Send the last 150 readings
        const last150AccReadings = accReadings.slice(-150);
        const last150GyroReadings = gyroReadings.slice(-150);
        const data = { gyroData: last150GyroReadings, accData: last150AccReadings };
        
        try {            
            console.log("start")
            console.log(data)

            const response = await fetch(process.env.DETECTION_MODEL_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            console.log("res", response)
            const prediction = await response.text();
            console.log("end")
            console.log('Prediction:', prediction);
            // Now, update the UI to display the prediction
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Gyroscope</Text>
            <Text>x: {gyroReadings.length > 0 ? gyroReadings[gyroReadings.length - 1].x : 0}</Text>
            <Text>y: {gyroReadings.length > 0 ? gyroReadings[gyroReadings.length - 1].y : 0}</Text>
            <Text>z: {gyroReadings.length > 0 ? gyroReadings[gyroReadings.length - 1].z : 0}</Text>

            <Text>Accelerometer</Text>
            <Text>x: {accReadings.length > 0 ? accReadings[accReadings.length - 1].x : 0}</Text>
            <Text>y: {accReadings.length > 0 ? accReadings[accReadings.length - 1].y : 0}</Text>
            <Text>z: {accReadings.length > 0 ? accReadings[accReadings.length - 1].z : 0}</Text>
            
            <Button title="Send Data" onPress={sendDataToServer} />
            
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
});
