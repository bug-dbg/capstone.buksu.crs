import os
from tabnanny import verbose
from textwrap import indent
from tkinter import Y
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS,cross_origin

import numpy as np 
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import MinMaxScaler
from sklearn.svm import SVR
from sklearn.model_selection import train_test_split
from keras.models import Sequential
from keras.layers import Dense, LSTM

from sklearn import datasets

import pandas as pd
from pandas import DataFrame
pd.options.mode.chained_assignment = None  # default='warn'
import sqlite3

import warnings

from keras.models import load_model
from sklearn.model_selection import train_test_split
from keras.layers import Input, Embedding, Flatten, Dot, Dense, Concatenate
from keras.models import Model
warnings.filterwarnings('ignore')


from keras.preprocessing.text import hashing_trick
from keras.preprocessing.text import text_to_word_sequence


# example making new probability predictions for a classification problem
from keras.models import Sequential
from keras.layers import Dense
from sklearn.datasets import make_blobs
from sklearn.preprocessing import MinMaxScaler

from sklearn.linear_model import LinearRegression
from sklearn.feature_extraction import DictVectorizer

# from Techvidvan tutorial
from ast import literal_eval
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# from medium.com
import re
from collections import Counter
from keras.preprocessing.text import Tokenizer
from keras.utils import np_utils
from keras.models import Sequential, load_model
from keras.layers import Dense, Dropout, LSTM, Bidirectional

import matplotlib.pyplot as plt
from matplotlib.pylab import rcParams
rcParams['figure.figsize']=20,10
from keras.models import Sequential
from keras.layers import LSTM,Dropout,Dense
from sklearn.preprocessing import MinMaxScaler





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

# @app.route('/')
# def index():
#     return 'Welcome to BukSU CRS'

# @app.route('/api/courses')
# def get_courses():
#     courseData = Enrollmentdata.query.order_by(Enrollmentdata.course).all()
#     return jsonify({'Courses': list(map(lambda course: course.serialize(), courseData))})

# @app.route('/api/courses/recommend/')
# def get_course_recommendation():
  

# sample code 1
    # coursedatadf = pd.read_sql('Enrollmentdata', con= engine)   
    # coursedatadf = coursedatadf.set_index('index')
    # data = coursedatadf.filter(['courseID'])


    # data['Prediction'] = data[['courseID']]
    # X = np.array(data.drop(['Prediction'],1))
    # y = np.array(data['Prediction'])
    # x_train, x_test, y_train, y_test = train_test_split(X, y,test_size=0.2)
    # #  radial basis function (rbf)
    # svr_rbf = SVR(kernel='rbf', C=1e3, gamma=0.1)
    # svr_rbf.fit(x_train, y_train)
    # svm_confidence = svr_rbf.score(x_test, y_test)
    # print("svm confidence: ", svm_confidence)

    # lr = LinearRegression()

    # lr.fit(x_train, y_train)

    # lr_confidence =lr.score(x_test, y_test)
    # print("lr confidence: ", lr_confidence)

    # x_forecast = np.array(data.drop(['Prediction'],1))
    # #print(x_forecast)

    # lr_prediction = lr.predict(x_forecast)
    # #print("lr prediction: ", lr_prediction)
    # dflr=pd.DataFrame(lr_prediction, columns=["prediction"])
    # dflr['courseID'] = dflr.index + 1 
    # # print(df.reset_index().to_json(orient='records'))
    # svm_prediction = svr_rbf.predict(x_forecast)
    # #print("svm prediction: ", svm_prediction)
    # dfsvm=pd.DataFrame(svm_prediction, columns=["prediction"])
    # dfsvm['courseID'] = dfsvm.index + 1

    # return jsonify({'lr': dflr.to_json(orient='records'), 'svm' : dfsvm.to_json(orient='records')})




    
# sample code 2

    # dat = sqlite3.connect('course.db')
    # query = dat.execute("SELECT * From Enrollmentdata")
    # cols = [column[0] for column in query.description]
    # dataset= pd.DataFrame.from_records(data = query.fetchall(), columns = cols)

    # #print(datadf)

    # train, test = train_test_split(dataset, test_size=0.2, random_state=42)

    # # creating course embedding path
    # student_dropout_input = Input(shape=[1], name="Student-Dropout-Input")
    # student_dropout_embedding = Embedding(1000, 5, name="Course-Embedding")(student_dropout_input)
    # student_dropout_vec = Flatten(name="Flatten-dropout")(student_dropout_embedding)

    # # creating enrolled student embedding path
    # enrolled_student_input = Input(shape=[1], name="Enrolled-Student-Input")
    # enrolled_student_embedding = Embedding(1000, 5, name="Enrolled-Student-Embedding")(enrolled_student_input)
    # enrolled_student_vec = Flatten(name="Flatten-enrollment")(enrolled_student_embedding)
    # conc = Concatenate()([student_dropout_vec, enrolled_student_vec])
    # # add fully-connected-layers
    # fc1 = Dense(128, activation='relu')(conc)
    # fc2 = Dense(32, activation='relu')(fc1)
    # out = Dense(1)(fc2)
    # # Create model and compile it
    # model2 = Model([student_dropout_input, enrolled_student_input], out)
    # model2.compile('adam', 'mean_squared_error')

    # history = model2.fit([train.student_dropouts, train.enrolled_students], train.student_dropouts, epochs=5, verbose=1)

# sample code 3
# generate 2d classification dataset
    # X, y = make_blobs(n_samples=100, centers=2, n_features=2, random_state=1)
    # scalar = MinMaxScaler()
    # scalar.fit(X)
    # X = scalar.transform(X)
    # # define and fit the final model
    # model = Sequential()
    # model.add(Dense(4, input_shape=(2,), activation='relu'))
    # model.add(Dense(4, activation='relu'))
    # model.add(Dense(1, activation='sigmoid'))
    # model.compile(loss='binary_crossentropy', optimizer='adam')
    # model.fit(X, y, epochs=500, verbose=0)
    # # new instances where we do not know the answer
    # Xnew, _ = make_blobs(n_samples=3, centers=2, n_features=2, random_state=1)
    # Xnew = scalar.transform(Xnew)
    # # make a prediction
    # ynew = model.predict(Xnew)
    # # show the inputs and predicted outputs
    # for i in range(len(Xnew)):
    #     print("X=%s, Predicted=%s" % (Xnew[i], ynew[i]))


# sample code 4
    # mapping  = {}

    # cols = coursedatadf.drop('courseID', axis= 1).columns
    
    # for col in cols:
    #     mapping[col] = {course: i for i, course in enumerate(df[col].unique())}

    # def mapping_func(row):
    #     return pd.Series([mapping[col][row[col]] for col in cols])
    # #return 'Recommended Course API in JSON format'

    # X = coursedatadf.apply(mapping_func, axis=1 )
    # y = coursedatadf['course']
    # model = LinearRegression()
    # model.fit(X, y)
    # print(model.predict([mapping['course']['Bachelor in Science in Information Technology'], mapping['enrolledStudents']['200']]))



# if __name__ == "__main__":
#     app.run(debug=True)

# test code

coursedatadf = pd.read_sql('Enrollmentdata', con= engine) 


features = ["course", "enrolledStudents", "studentDropouts", "studentShiftees"]


    
#print(coursedatadf[features].head(10))

def clean_data(row):
    if isinstance(row, list):
        return [str.lower(i.replace("", "")) for i in row]
    else:
        if isinstance(row, str):
            return str.lower(row.replace("", ""))
        else:
            return ""

for feature in features:
    coursedatadf[feature] = coursedatadf[feature].apply(clean_data)

def create_soup(features):
    return ' '.join(features['course']) + ' ' + ''.join(features['enrolledStudents'])

coursedatadf["soup"] = coursedatadf.apply(create_soup, axis=1)

# print(coursedatadf["soup"].head())


# Create a reverse mapping of course to indices. 
# By this, we can easily find the course description of the course based on the index.

coursedatadf = coursedatadf.reset_index()
indices = pd.Series(coursedatadf.index, index=coursedatadf['course'])
indices = pd.Series(coursedatadf.index, index=coursedatadf["course"]).drop_duplicates()

print(indices.head())

def get_recommendations():
    # coursedatadf = pd.read_sql('Enrollmentdata', con= engine)
    # data = coursedatadf.filter(['courseID'])
    # pd.set_option("display.max.columns", None)
    # data['Prediction'] = data[['courseID']]
    # X = np.array(data.drop(['Prediction'],1))
    # X = np_utils.to_categorical(X)
    # print(X.shape)
    # y = np.array(data['Prediction'])
    # print(y.shape)

    coursedatadf = pd.read_sql('Enrollmentdata', con= engine)
    data = coursedatadf.filter(['courseID'])
    pd.set_option("display.max.columns", None)

    
    data['Prediction Data'] = coursedatadf[["enrolledStudents"]]
    X = np.array(data.drop(['Prediction Data'],1))
    print(X.shape)
    y = np.array(data['Prediction Data'])
    print(y.shape)


   
    x_train, x_test, y_train, y_test = train_test_split(X, y, test_size= 0.2)
    #  radial basis function (rbf)
    # support vector regression (svr)
    svr_rbf = SVR(kernel='rbf', C=1e3, gamma=0.1)
    svr_rbf.fit(x_train, y_train)

    svm_confidence = svr_rbf.score(x_test, y_test)
    print("svm confidence: ", svm_confidence)

    # linear regression (lr)
    lr = LinearRegression()

    lr.fit(x_train, y_train)

    lr_confidence =lr.score(x_test, y_test)
    print("lr confidence: ", lr_confidence)

    x_forecast = np.array(data.drop(['Prediction Data'],1))[-3:]
    # print(x_forecast)

    lr_prediction = lr.predict(x_forecast)
    #print("lr prediction: ", lr_prediction)
    # Course Prediction Rate
    dflr=pd.DataFrame(lr_prediction, columns=["prediction"])
    print(dflr)
    # print(df.reset_index().to_json(orient='records'))
    svm_prediction = svr_rbf.predict(x_forecast)
    #print("svm prediction: ", svm_prediction)
    dfsvm=pd.DataFrame(svm_prediction, columns=["prediction"])
    print(dfsvm)

    prediction_score = list(enumerate(dflr))
    prediction_score = sorted(prediction_score, key=lambda x: x[1], reverse=True)
# get course description  by index
    course_indices = [ind[0] for ind in prediction_score]
    course = coursedatadf["course"].iloc(course_indices)

    return course

print(get_recommendations())



# towardsdatascience.com

# coursedatadf = pd.read_sql('Enrollmentdata', con= engine) 

# coursedatadf = coursedatadf.sort_index(ascending=True, axis=0)

# data = pd.DataFrame(index=range(0, len(coursedatadf)), columns=['enrolledStudents', 'studentDropouts', 'studentShiftees'])

# for i in range(0, len(data)):
#     data["enrolledStudents"][i] = coursedatadf['enrolledStudents'][i]
#     data["studentDropouts"][i] = coursedatadf['studentDropouts'][i]
#     data["studentShiftees"][i] = coursedatadf['studentShiftees'][i]

# #print(data.head())

# scaler=MinMaxScaler(feature_range=(0,1))

# final_data = data.values
# train_data = final_data[0:200,:]
# valid_data = final_data[200:,:]

# scaler=MinMaxScaler(feature_range=(0,1))

# scaled_data=scaler.fit_transform(final_data)
# x_train_data,y_train_data=[],[]
# for i in range(60,len(train_data)):
#     x_train_data.append(scaled_data[i-60:i,0])
#     y_train_data.append(scaled_data[i,0])

# #LSTM Model

# lstm_model=Sequential()
# lstm_model.add(LSTM(units=50,return_sequences=True,input_shape=(np.shape(x_train_data)[1],1)))
# lstm_model.add(LSTM(units=50))
# lstm_model.add(Dense(1))
# model_data=data[len(data)-len(valid_data)-60:].values
# model_data=model_data.reshape(-1,1)
# model_data=scaler.transform(model_data)

# # Train and test data

# lstm_model.compile(loss='mean_squared_error',optimizer='adam')
# lstm_model.fit(x_train_data,y_train_data,epochs=1,batch_size=1,verbose=2)

# X_test=[]
# for i in range(60,model_data.shape[0]):
#     X_test.append(model_data[i-60:i,0])
# X_test=np.array(X_test)
# X_test=np.reshape(X_test,(X_test.shape[0],X_test.shape[1],1))

# # Prediction Function
# predicted_course_data=lstm_model.predict(X_test)
# predicted_course_data=scaler.inverse_transform(predicted_course_data)
# print(predicted_course_data)

# train_data=data[:200]
# valid_data=data[200:]
# valid_data['Predictions']=predicted_course_data
# plt.plot(train_data["Close"])
# plt.plot(valid_data[['Close',"Predictions"]])

