import os
import os.path
from tabnanny import verbose
from textwrap import indent
from tkinter import Y
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS,cross_origin

import numpy as np
from random import randint
from sklearn.utils import shuffle
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import MinMaxScaler

import tensorflow as tf
from tensorflow import keras
from keras.models import Sequential
from keras.layers import Activation, Dense, Dropout, Flatten
from keras.optimizers import adam_v2
from keras.metrics import categorical_crossentropy
from keras.models import load_model
from keras.applications.vgg16 import VGG16

import pandas as pd
from pandas import DataFrame
pd.options.mode.chained_assignment = None  # default='warn'
import sqlite3

import warnings

from flask import request

import sys


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///course.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.route('/')
def index():
    return 'Welcome to BukSU CRS'

@app.route('/api/courses/recommend/')
def get_course_recommendation():

    train_labels = [
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    ]
    
    train_samples = [
        
        [5,4,5,4,4,2,5,3,3,4,3,4,2,4,3,3,3,3,2,3,3,2,1,3,3,2,1,2,3,4,4,3,4,4,4,4,3,3,3,2,3,3,2,2,2,3,2,2,2,4,3,3,3,3,1,3,3,4,3,1,2,2,4,4,2,3,3,3,3,3,3,3,2,2,2,2,1,1,1,2,1,2], 
        [5,4,5,4,4,2,5,3,3,4,3,4,2,4,3,3,3,3,2,3,3,2,1,3,3,2,1,2,3,4,4,3,4,4,4,4,3,3,3,2,3,3,2,2,2,3,2,2,2,4,3,3,3,3,1,3,3,4,3,1,2,2,4,4,2,3,3,3,3,3,3,3,2,2,2,2,1,1,1,2,1,2], 
        [5,1,1,2,5,1,5,1,2,1,1,1,1,1,1,1,1,2,2,2,2,2,3,1,1,1,1,1,3,3,3,3,4,4,4,4,4,2,4,1,4,4,4,1,4,5,4,5,5,4,4,5,5,5,5,5,5,5,5,5,3,2,2,2,1,5,5,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1], 
	    [3,4,5,3,5,3,4,3,5,5,4,4,3,5,4,4,3,3,4,4,3,3,3,5,4,2,3,3,5,5,5,5,5,4,5,5,4,4,5,4,5,5,5,5,5,5,4,4,5,5,5,4,5,4,4,5,5,4,5,4,1,4,5,5,5,4,5,5,3,4,4,5,5,4,4,4,3,4,5,4,3,5], 
	    [4,1,1,3,4,4,4,1,5,4,4,3,5,4,1,4,3,3,4,5,4,4,3,5,5,1,1,2,5,5,5,5,5,4,5,5,4,3,5,3,4,5,5,1,5,5,5,5,4,4,4,4,4,5,5,4,5,4,5,5,5,5,3,5,4,4,4,5,5,5,3,4,3,5,5,3,3,5,5,2,2,5], 
	    [5,5,5,4,5,1,4,3,4,4,4,3,4,4,2,3,3,3,3,4,5,5,4,4,4,4,3,5,5,5,4,4,5,5,4,4,4,4,5,3,4,5,5,3,5,5,4,4,4,4,4,3,5,4,4,4,4,5,5,5,5,4,4,4,3,4,3,4,2,3,3,3,3,3,3,4,2,3,4,3,3,4], 
	    [4,1,1,3,4,4,4,1,5,4,4,3,5,4,2,4,3,3,4,5,3,4,3,5,5,1,1,2,5,5,5,5,5,4,5,5,4,3,4,3,4,5,5,2,5,5,5,4,4,4,4,4,4,5,5,4,5,4,5,5,4,5,3,5,4,4,4,4,5,5,3,4,3,5,5,3,3,5,5,2,2,5], 
	    [5,4,4,5,4,3,5,4,4,4,4,4,2,4,5,5,5,3,3,3,3,3,2,4,4,3,3,3,4,4,4,4,4,4,4,4,4,5,4,5,4,5,4,4,5,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,4,5,5,3,4], 
	    [5,5,5,3,5,3,5,2,4,4,4,2,2,3,3,4,2,2,2,4,2,2,3,3,2,2,2,3,3,5,5,5,5,4,5,4,4,3,4,2,3,3,4,3,3,5,5,4,4,3,4,3,4,4,4,3,4,4,3,3,2,5,5,5,4,4,4,4,2,3,4,4,4,5,4,4,2,3,3,5,2,4], 
	    [5,1,4,5,5,1,5,3,5,5,1,3,1,4,4,5,5,3,3,5,5,5,5,5,3,1,3,3,5,5,5,5,5,5,5,5,5,5,5,3,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,5,5,5,3,5,1,1,1,1,1,1,5,5], 
	    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,1,5,5,5,5,1,4,1,1,4,1,1,4,5,4,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,5,1,1,1,1,1,1,1,5,1,1,1,1,1,1,1,1,1,5], 
	    [3,4,3,5,3,3,4,4,3,4,3,4,4,4,4,4,4,3,4,3,1,4,4,3,4,3,4,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4], 
        [5,5,5,5,5,1,5,5,2,5,1,1,1,5,1,5,1,5,5,5,5,5,5,5,5,5,1,1,5,5,5,5,5,5,5,5,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5], 
        [5,5,5,5,5,1,5,5,2,5,1,1,1,5,1,5,1,5,5,5,5,5,5,5,5,5,1,1,5,5,5,5,5,5,5,5,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5], 
        [5,5,5,5,5,5,5,5,2,5,1,1,5,5,1,5,1,5,5,5,5,5,5,5,5,5,1,1,5,5,5,5,5,5,5,5,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5], 
        [5,5,5,1,3,1,5,1,1,4,5,1,1,4,3,1,1,1,3,3,4,1,1,3,3,5,3,1,4,4,3,1,3,5,4,4,3,3,5,1,3,5,1,3,1,1,1,3,3,5,1,3,5,1,1,1,1,1,1,1,1,3,1,1,3,1,1,1,1,4,5,3,1,4,1,4,1,1,1,1,1,4], 
        [5,5,5,4,3,3,5,5,3,4,5,3,3,4,5,4,3,5,2,5,5,5,1,4,5,3,4,5,5,5,5,3,3,5,5,5,4,5,5,5,4,4,5,3,5,5,4,2,2,4,3,3,5,4,3,5,4,4,4,3,3,4,4,3,3,4,3,3,3,4,4,4,3,3,3,2,2,2,4,3,3,4], 
        [5,2,5,3,5,5,4,1,1,4,2,1,5,5,2,2,3,3,1,5,5,1,1,1,1,1,1,1,2,5,1,2,2,5,4,4,4,4,4,4,5,5,4,4,4,5,4,5,5,5,5,5,5,4,3,4,4,3,4,2,5,3,2,2,4,3,4,2,2,4,5,5,4,2,4,3,3,1,4,4,4,5], 
        [5,4,3,5,4,1,5,5,1,4,1,5,1,5,2,4,4,1,3,3,4,1,1,1,1,1,1,1,5,5,3,3,3,5,5,5,5,5,5,4,3,5,5,3,3,3,1,4,4,5,4,5,5,1,1,1,1,1,1,1,1,3,1,1,3,1,1,1,1,4,5,3,1,4,1,4,1,1,1,1,1,4], 
        [5,4,3,5,4,1,5,1,5,4,1,5,1,5,2,5,5,1,3,4,4,1,1,1,1,1,1,5,5,5,3,3,3,5,5,5,5,5,5,4,3,5,3,3,3,3,1,4,4,5,4,5,5,3,3,3,3,3,1,1,1,5,1,1,3,1,1,1,1,4,5,3,1,4,1,4,1,1,1,1,1,4], 
        [5,5,5,5,5,2,5,1,2,3,2,1,1,1,2,5,5,4,4,5,3,3,3,4,4,3,4,3,5,5,5,4,5,5,5,4,4,3,4,3,4,3,3,3,3,3,4,5,5,5,5,5,5,4,4,5,5,5,4,4,3,5,5,4,4,5,5,5,4,4,4,4,4,4,3,3,3,4,4,4,4,4], 
        [5,4,4,5,4,3,5,4,4,4,4,4,2,4,5,5,5,3,3,3,3,3,2,4,4,3,3,3,4,4,4,4,4,4,4,4,4,5,4,5,4,5,4,4,5,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,4,5,5,3,4], 
        [5,5,5,5,5,2,5,1,2,3,2,1,1,1,2,5,4,4,4,5,3,3,3,4,4,3,4,3,5,5,5,4,5,5,5,4,4,3,4,3,4,3,3,3,3,3,4,5,5,5,5,5,5,4,4,5,5,5,4,4,3,5,5,4,4,5,5,5,4,4,4,4,4,4,3,3,3,4,4,4,4,4], 
        [5,1,1,2,5,1,5,1,2,1,1,1,1,1,1,1,1,2,2,2,2,2,3,1,1,1,1,1,3,3,3,3,4,4,4,4,4,2,4,1,4,4,4,1,4,5,4,5,5,4,4,5,5,5,5,5,5,5,5,5,3,2,2,2,1,5,5,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1], 
        [5,5,5,5,5,2,5,1,2,3,2,1,1,1,2,5,4,4,4,5,3,3,3,4,4,3,4,3,5,5,5,4,5,5,5,4,4,3,4,3,4,3,3,3,3,3,4,5,5,5,5,5,5,4,4,5,5,5,4,4,3,5,5,4,4,5,5,5,4,4,4,4,4,4,3,3,3,4,4,4,4,4], 
        [5,5,5,5,5,2,5,1,2,3,2,1,1,1,2,5,4,4,4,5,3,3,3,4,4,3,4,3,5,5,5,4,5,5,5,4,4,3,4,3,4,3,3,3,3,3,4,5,5,5,5,5,5,4,4,5,5,5,4,4,3,5,5,4,4,5,5,5,4,4,4,4,4,4,3,3,3,4,4,4,4,4], 
        [5,5,5,5,5,2,5,1,2,3,2,1,1,1,2,5,4,4,4,5,3,3,3,4,4,3,4,3,5,5,5,4,5,5,5,4,4,3,4,3,4,3,3,3,3,3,4,5,5,5,5,5,5,4,4,5,5,5,4,4,3,5,5,4,4,5,5,5,4,4,4,4,4,4,3,3,3,4,4,4,4,4], 
        [5,5,5,5,5,2,5,1,2,3,2,1,1,1,2,5,4,5,5,5,3,5,3,5,5,5,3,5,5,5,5,4,5,5,5,5,4,3,4,3,4,3,3,3,3,3,4,5,5,5,5,5,5,5,4,5,5,5,4,4,3,5,5,4,4,5,5,5,4,4,4,4,4,4,3,3,3,4,4,4,4,4]    
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
    Dense(units = 16, activation = 'relu', input_shape = (scaled_train_samples.shape[1], )),
    Dense(units = 32, activation = 'relu'),
    Dense(units = 4, activation = 'sigmoid')
    ])

    print(model.summary())

    # prepares the model for training
    # gets the order needed before training

    model.compile(optimizer=adam_v2.Adam(learning_rate=0.0001), loss='binary_crossentropy', metrics=['accuracy'])

    # training accured when fit function is called
    # batch_size, how many samples is included in one batch to be process
    # epochs, train the data 30x before completing the training process 
    # verbose, option to see output when we run the fit function
    # validation_split, it splits the portion of the training dataset to a validation dataset

    model.fit(x=scaled_train_samples, y=train_labels, batch_size=10, epochs=1000)
    scores = model.evaluate(scaled_train_samples, train_labels, verbose=0)

    print("%s: %.2f%%" % (model.metrics_names[1], scores[1]*100))

    # Save trained model
    if os.path.isfile('new_models/new_model.h5') is False:
        model.save('new_models/new_model.h5')


    
    # # Load trained model
    try:
        new_model = load_model('new_models/new_model.h5')
        # actual_sample = np.array([request.get_json()])
        actual_sample = np.array([[73,58,97,79,91,46,30,50,44,72]])

        prediction = new_model.predict(actual_sample, batch_size=None, verbose=0, steps=None)
       

        convertedPrediction = np.array(prediction).tolist()
        print(convertedPrediction)

        # return jsonify({'prediction': convertedPrediction})

    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")

if __name__ == "__main__":
    app.run(debug=True, port=3000)

