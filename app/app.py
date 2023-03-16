import os
import os.path
# from tabnanny import verbose
# from textwrap import indent
# from tkinter import Y
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS,cross_origin

import numpy as np
# from random import randint
# from sklearn.utils import shuffle
# from sklearn.preprocessing import LabelEncoder
# from sklearn.preprocessing import MinMaxScaler

# import tensorflow as tf
# from tensorflow import keras
# from keras.models import Sequential
# from keras.layers import Activation, Dense, Dropout, Flatten
# from keras.optimizers import adam_v2
# from keras.metrics import categorical_crossentropy
from keras.models import load_model
# from keras.applications.vgg16 import VGG16

# import pandas as pd
# from pandas import DataFrame
# pd.options.mode.chained_assignment = None  # default='warn'
# import sqlite3

# import warnings

from flask import request

# import sys


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///course.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.route('/')
def index():
    return 'Welcome to BukSU CRS'

@app.route('/api/courses/recommend/', methods=['POST'])
def get_course_recommendation():

    # Load trained model
    try:
        new_model = load_model('./models/final_crs_ai_trained_model.h5')
        actual_sample = np.array([request.get_json()])

        prediction = new_model.predict(actual_sample, batch_size=None, verbose=0, steps=None)

        convertedPrediction = np.array(prediction).tolist()

        return jsonify({'prediction': convertedPrediction})

    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")

if __name__ == "__main__":
    app.run(debug=True, port=3000)

