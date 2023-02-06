import json
import mysql.connector




def lambda_handler(event, context):
    data = json.loads(event['body'])
    data_list = data['data_list']


    mydb = mysql.connector.connect(
      host="smoothridedb1.caypjersxse1.us-east-2.rds.amazonaws.com",
      user="admin",
      password="OkZs9OK3K3QwEy7ZNYjF",
      database="smoothrideDB"
    )

    cursor = mydb.cursor()
    for data in data_list:
        sql = "INSERT INTO location_data (latitude, longitude, quality_measurement) VALUES (%s, %s, %s)"
        val = (data['latitude'], data['longitude'], data['quality'])
        cursor.execute(sql, val)
    mydb.commit()

    transactionResponse = {}
    transactionResponse['message'] = 'Placed in DB'


    responseObject = {}
    responseObject['statusCode'] = 200
    responseObject['headers'] = {}
    responseObject['headers']['Content-Type'] = 'application/json'
    responseObject['body'] = json.dumps(transactionResponse)

    return responseObject
