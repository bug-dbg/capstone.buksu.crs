from flask_cors import CORS, cross_origin
import sys
from flask import request
import warnings
import sqlite3
from pandas import DataFrame
import pandas as pd
from keras.applications.vgg16 import VGG16
from keras.models import load_model
from keras.metrics import categorical_crossentropy
from keras.optimizers import adam_v2
from keras.layers import Activation, Dense, Dropout, Flatten
from keras.models import Sequential
from tensorflow import keras
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import LabelEncoder
from sklearn.utils import shuffle
from random import randint
import numpy as np
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, jsonify
import os
import os.path
from tabnanny import verbose
from textwrap import indent
from tkinter import Y
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'


pd.options.mode.chained_assignment = None  # default='warn'


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///course.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})


# df = pd.read_csv('data/Dataset.csv')
# print(df.head())

@app.route('/')
def index():
    return 'Welcome to BukSU CRS'


@app.route('/api/courses/recommend/')
def get_course_recommendation():

    train_labels = [
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    ]
    train_samples = [

        [71, 45, 74, 54, 38, 50, 62],
        [71, 45, 74, 54, 38, 50, 62],
        [46, 35, 72, 68, 24, 96, 47],
        [78, 63, 80, 80, 84, 75, 62],
        [64, 70, 94, 88, 69, 91, 90],
        [74, 81, 88, 90, 61, 83, 70],
        [65, 66, 94, 86, 70, 90, 58],
        [83, 63, 80, 92, 78, 80, 67],
        [71, 48, 86, 68, 73, 75, 54],
        [72, 76, 85, 88, 66, 100, 65],
        [20, 20, 68, 46, 32, 38, 30],
        [74, 66, 76, 80, 80, 80, 96],
        [68, 60, 80, 90, 89, 70, 50],
        [68, 86, 92, 87, 100, 85, 65],
        [77, 86, 92, 60, 91, 89, 75],
        [90, 48, 72, 52, 49, 30, 32],
        [81, 78, 88, 94, 60, 68, 70],
        [90, 43, 68, 88, 73, 80, 55],
        [95, 31, 88, 78, 49, 41, 32],
        [95, 70, 70, 74, 49, 58, 37],
        [64, 71, 94, 70, 73, 91, 80],
        [83, 63, 94, 92, 78, 80, 80],
        [64, 71, 94, 70, 73, 93, 68],
        [36, 35, 72, 68, 24, 96, 47],
        [64, 71, 94, 70, 73, 92, 74],
        [64, 71, 94, 70, 73, 89, 75],
        [64, 71, 98, 70, 73, 91, 92],
        [63, 86, 96, 70, 73, 70, 74],

    ]

    # to use the fit function the data type of X and y should be the same
    # that's why train_samples (X) is stored as a numpy array and also the train_lables (y)

    train_labels = np.array(train_labels)
    train_samples = np.array(train_samples)
    # used the shuffle function to shuffle both train samples and labels to remove any impose order for the data generation process
    train_labels, train_samples = shuffle(train_labels, train_samples)

    # we are normalizing or standardizing the data to train the data much quicker and effecient
    # MinMaxScaler function is use to create a feature range of (0 - 1)

    scaler = MinMaxScaler(feature_range=(0, 1))
    # and is used to rescale from 13-100 (the range of age in the dataset) to 0-1

    scaled_train_samples = scaler.fit_transform(train_samples)
    # reshape the data because the fit function does not accecpt 1 dimensional data

    # # training the data model
    # model = Sequential([
    # # Dense(units = 28, activation = 'relu', input_shape = (28, 28, 82, 1)),
    # # Dense(units = 82, activation = 'relu', input_shape = (scaled_train_samples.shape[1], )),
    # Dense(units = 28, activation = 'relu', input_shape = (scaled_train_samples.shape[1], )),
    # Dense(units = 32, activation = 'relu'),
    # Dense(units = 28, activation = 'sigmoid')
    # ])

    # training the data model
    model = Sequential([
        # Dense(units = 28, activation = 'relu', input_shape = (28, 28, 82, 1)),
        # Dense(units = 82, activation = 'relu', input_shape = (scaled_train_samples.shape[1], )),
        Dense(units=28, activation='relu', input_shape=(
            scaled_train_samples.shape[1], )),
        Dense(units=32, activation='relu'),
        Dense(units=28, activation='sigmoid')
    ])

    print(model.summary())

    # prepares the model for training
    # gets the order needed before training

    model.compile(optimizer=adam_v2.Adam(learning_rate=0.0001),
                  loss='binary_crossentropy', metrics=['accuracy'])

    # training accured when fit function is called
    # batch_size, how many samples is included in one batch to be process
    # epochs, train the data 30x before completing the training process
    # verbose, option to see output when we run the fit function
    # validation_split, it splits the portion of the training dataset to a validation dataset

    model.fit(x=scaled_train_samples, y=train_labels,
              batch_size=10, epochs=10000)
    scores = model.evaluate(scaled_train_samples, train_labels, verbose=0)

    print("%s: %.2f%%" % (model.metrics_names[1], scores[1]*100))

    # Save trained model
    if os.path.isfile('new_models/trained_dataset_trial_7.h5') is False:
        model.save('new_models/trained_dataset_trial_7.h5')

    # # Load trained model
    try:
        # new_model = load_model('./new_models/trained_dataset_trial_3.h5') mao ni final
        new_model = load_model('./new_models/trained_dataset_trial_7.h5')
        # actual_sample = np.array([request.get_json()])
        actual_sample = np.array([[74.11, 66.66, 76, 80, 80, 80, 80]])

        prediction = new_model.predict(
            actual_sample, batch_size=None, verbose=0, steps=None)

        convertedPrediction = np.array(prediction).tolist()
        print(convertedPrediction)

        # return jsonify({'prediction': convertedPrediction})

    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")


if __name__ == "__main__":
    app.run(debug=True, port=3000)
