from flask import Flask, render_template, request, jsonify
import numpy as np
from tensorflow.keras.models import load_model
import json
from flask_cors import CORS



app = Flask(__name__)
cors = CORS(app)

# Load the model
model = load_model('./latest_motion_detection_model.h5')
motion = {0: 'downstairs', 1: 'jogging', 2: 'sitting', 3: 'standing', 4: 'upstairs', 5: 'walking'}

#dws: downstairs
# ups: upstairs
# sit: sitting
# std: standing
# wlk: walking
# jog: jogging

def parse_data(data_string):
    data = json.loads(data_string)
    # print(data)
    if data is None:
        return jsonify({"error": "No JSON data received"}), 400
    
    acc_data = data["accData"]
    gyro_data = data["gyroData"]
    # print("acc:\n",len(acc_data))
    # print("gyro:\n",len(gyro_data))
    # Combine historical accelerometer and gyroscope data
    combined_data = []
    for acc, gyro in zip(acc_data, gyro_data):
        # print("row",acc, gyro)
        acc_x = acc['x']; acc_y = acc['y']; acc_z = acc['z']
        acc_np = [acc_x, acc_y, acc_z]
        gyro_x = gyro['x']; gyro_y = gyro['y']; gyro_z = gyro['z']
        gyro_np = [gyro_x, gyro_y, gyro_z]
        # print(np.concatenate((acc_np, gyro_np)))
        combined_data.append(np.concatenate((acc_np, gyro_np)))
    
    # Convert the combined data to a 2D numpy array
    np_data = np.array(combined_data)
    print(np_data.shape)
    
    return np_data

@app.route('/', methods=['GET'])
def test():
    return render_template('index.html')

@app.route('/', methods=['POST'])
def predict():
    data = request.form['data']
    np_data = parse_data(data)
    
    # Assuming np_data is in the desired format: [acc1, gyro1, acc2, gyro2, ...]
    prediction = motion[np.argmax(model.predict(np.array([np_data])))]
    
    return prediction

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')
