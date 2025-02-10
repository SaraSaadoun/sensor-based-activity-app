# Motion Detection System using mobile sensors🚀

This project is a **real-time motion classification system** that collects **accelerometer** and **gyroscope** sensor data from a **React Native app** and uses a **Flask-based API with a deep learning model** for activity classification.  

---

## 📌 Features
- 📡 **Real-time motion detection** using mobile sensors.
- 📱 **React Native mobile app** to collect sensor data.
- 🧠 **Deep learning model** for activity classification.
- 🌐 **Flask-based API** for prediction.
- 📊 **Displays prediction results dynamically**.

---

## 📷 Preview
![sensor](https://github.com/user-attachments/assets/0c4a00dc-d08e-4a7e-9417-98d9905b639c)

---

## 🛠️ Technologies Used
### **Backend (Flask)**
### **Frontend (React Native)**

---

## ⚙️ How It Works
### **Mobile App (React Native)**
1. Collects **accelerometer** and **gyroscope** data using `expo-sensors`.
2. Stores **the last 150 readings** from both sensors.
3. Sends the collected data to the Flask backend for classification.
4. Displays the **predicted activity** in real-time.

### **Backend (Flask)**
1. Receives **sensor data** from the mobile app.
2. Preprocesses and reshapes the data for input to the model.
3. Uses a **trained deep learning model** (`latest_motion_detection_model.h5`) to predict activity.
4. Sends back the **predicted motion** (e.g., *sitting, jogging, walking*) as a response.
---

