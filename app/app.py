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

import urllib.request, json
import requests



app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///course.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})

from sqlalchemy import create_engine

# dfs = pd.read_excel('data/BUKSU-Enrollment-Data.xlsx')

# import excel data to sqlite db
engine = create_engine('sqlite:///course.db')
# dfs.to_sql('Enrollmentdata', con= engine)

class Enrollmentdata(db.Model):
    courseID = db.Column(db.Integer, primary_key=True, nullable=False)
    course = db.Column(db.String(300), index=True, nullable=False)
    college = db.Column(db.String(64), nullable=False)
    enrolledStudents = db.Column(db.Float(), nullable=False)
    studentDropouts = db.Column(db.Float(), nullable=False)
    studentShiftees = db.Column(db.Float(), nullable=False)

    def serialize(self):
        return {
            "courseID" : self.courseID,
            "course" : self.course,
            "college" : self.college,
            "enrolledStudents" : self.enrolledStudents,
            "studentDropouts" : self.studentDropouts,
            "studentShiftees" : self.studentShiftees
        }

@app.route('/')
def index():
    return 'Welcome to BukSU CRS'
    
@app.route('/api/courses')
def get_courses():
    courseData = Enrollmentdata.query.order_by(Enrollmentdata.course).all()
    return jsonify({'Courses': list(map(lambda course: course.serialize(), courseData))})

@app.route('/api/courses/recommend/')
def get_course_recommendation():

    def get_api_value():
        # get user choices values
        url = "http://localhost:5000/api/user/evaluate/data"

        response = urllib.request.urlopen(url)
        data = response.read()
        dict = json.loads(data)

        arrVal = dict["data"]
        return arrVal

  
        

    # print(d)    
       

   
    

    # response = requests.get("http://localhost:5000/api/user/evaluate/data")
    # dict = json.loads(response)

    # print(dict["data"])

    # url = "http://localhost:5000/api/user/evaluate/data"
    # headers = {'Accept': 'application/json'}
    
    # response = requests.get(url, headers=headers).json()
    
    # print(response)
    # train_labels = [[1,0,0,0,0],[0,1,0,0,0],[0,0,1,0,0],[0,0,0,1,0],[0,0,0,0,1]]
    # train_samples = [
    #     [2,3,4,5,2,4,5,2,5,5],
    #     [5,5,4,3,2,1,3,3,3,4],
    #     [2,3,1,5,5,5,5,5,5,5],
    #     [4,2,1,5,5,2,5,4,1,5],
    #     [1,3,1,3,5,3,5,4,3,1]
    # ]

    # to use the fit function the data type of X and y should be the same
    # that's why train_samples (X) is stored as a numpy array and also the train_lables (y)

    # train_labels = np.array(train_labels)
    # train_samples = np.array(train_samples)
    # # used the shuffle function to shuffle both train samples and labels to remove any impose order for the data generation process
    # train_labels, train_samples = shuffle(train_labels, train_samples)

    # # we are normalizing or standardizing the data to train the data much quicker and effecient
    # # MinMaxScaler function is use to create a feature range of (0 - 1)

    # scaler = MinMaxScaler(feature_range=(0, 1))
    # # and is used to rescale from 13-100 (the range of age in the dataset) to 0-1

    # scaled_train_samples = scaler.fit_transform(train_samples)
    # # reshape the data because the fit function does not accecpt 1 dimensional data


    # # training the data model
    # model = Sequential([
    # Dense(units = 16, activation = 'relu', input_shape = (scaled_train_samples.shape[1], )),
    # Dense(units = 32, activation = 'relu'),
    # Dense(units = 5, activation = 'sigmoid')
    # ])

    # print(model.summary())

    # # prepares the model for training
    # # gets the order needed before training

    # model.compile(optimizer=adam_v2.Adam(learning_rate=0.0001), loss='binary_crossentropy', metrics=['accuracy'])

    # # training accured when fit function is called
    # # batch_size, how many samples is included in one batch to be process
    # # epochs, train the data 30x before completing the training process 
    # # verbose, option to see output when we run the fit function
    # # validation_split, it splits the portion of the training dataset to a validation dataset

    # model.fit(x=scaled_train_samples, y=train_labels, batch_size=10, epochs=5000)
    # scores = model.evaluate(scaled_train_samples, train_labels, verbose=0)

    # print("%s: %.2f%%" % (model.metrics_names[1], scores[1]*100))


    # if os.path.isfile('models/crs_model.h5') is False:
    #     model.save('models/crs_model.h5')


   
    new_model = load_model('models/crs_model.h5')
    # new_model.compile(optimizer=adam_v2.Adam(learning_rate=0.0001), loss='binary_crossentropy', metrics=['accuracy'])
    # new_model.fit(x=scaled_train_samples, y=train_labels, batch_size=10, epochs=100)
    # score = new_model.evaluate(scaled_train_samples, train_labels, verbose=0)
    # print("%s: %.2f%%" % (new_model.metrics_names[1], score[1]*100))
    actual_sample = np.array([get_api_value()])
    # actual_sample = np.array([[2,3,4,5,2,4,5,2,5,5]])

    prediction = new_model.predict(actual_sample, batch_size=None, verbose=0, steps=None)
    print(prediction)

    convertedPrediction = np.array(prediction).tolist()

    print(convertedPrediction)

    return jsonify({'prediction': convertedPrediction})




    


if __name__ == "__main__":
    app.run(debug=True, port=3000)

