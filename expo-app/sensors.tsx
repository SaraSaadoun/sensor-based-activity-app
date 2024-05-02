import React, { useState, useEffect } from "react";
import { StyleSheet, Button, View, Text } from "react-native";
import { Accelerometer, Gyroscope, AccelerometerMeasurement, GyroscopeMeasurement } from "expo-sensors";
import { StatusBar } from "expo-status-bar";


export default function Sensors() {
    const [accReadings, setAccReadings] = useState<Array<AccelerometerMeasurement>>(
        Array.from({ length: 150 }, () => ({ x: 0, y: 0, z: 0 }))
    );
    const [gyroReadings, setGyroReadings] = useState<Array<GyroscopeMeasurement>>(
        Array.from({ length: 150 }, () => ({ x: 0, y: 0, z: 0 }))
    );
    const [prediction, setPrediction] = useState<string>("");

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
            console.log("start predicting")
            // console.log(data)
            const response = await fetch(process.env.DETECTION_MODEL_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const prediction = await response.text();
            setPrediction(prediction);
            console.log("end prediction")
            console.log('Prediction:', prediction);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gyroscope</Text>
            <View style={styles.readingsContainer}>
                <Text style={styles.reading}>x: {gyroReadings.length > 0 ? gyroReadings[gyroReadings.length - 1].x : 0}</Text>
                <Text style={styles.reading}>y: {gyroReadings.length > 0 ? gyroReadings[gyroReadings.length - 1].y : 0}</Text>
                <Text style={styles.reading}>z: {gyroReadings.length > 0 ? gyroReadings[gyroReadings.length - 1].z : 0}</Text>
            </View>

            <Text style={styles.title}>Accelerometer</Text>
            <View style={styles.readingsContainer}>
                <Text style={styles.reading}>x: {accReadings.length > 0 ? accReadings[accReadings.length - 1].x : 0}</Text>
                <Text style={styles.reading}>y: {accReadings.length > 0 ? accReadings[accReadings.length - 1].y : 0}</Text>
                <Text style={styles.reading}>z: {accReadings.length > 0 ? accReadings[accReadings.length - 1].z : 0}</Text>
            </View>
            
            <Button title="Send Data" onPress={sendDataToServer} />
            {prediction !== "" && <Text style={styles.prediction}>{prediction}</Text>} 

            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    readingsContainer: {
        marginBottom: 20
    },
    reading: {
        fontSize: 16,
        marginBottom: 5
    },
    prediction: {
        fontSize: 18,
        marginTop: 20,
        fontWeight: 'bold'
    }
});