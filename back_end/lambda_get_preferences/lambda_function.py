import mysql.connector


def lambda_handler(event, context):
    mydb = mysql.connector.connect(
              host="smoothridedb1.caypjersxse1.us-east-2.rds.amazonaws.com",
              user="admin",
              password="OkZs9OK3K3QwEy7ZNYjF",
              database="smoothrideDB"
        )
    cursor = mydb.cursor()

    cursor.execute("SELECT * FROM preferences LIMIT 1")

    row = cursor.fetchall()[0]
    body = {
        "fastest_route": row[0],
        "excellent": row[1],
        "good": row[2],
        "poor": row[3]
    }

    responseObject = {}
    responseObject['statusCode'] = 200
    responseObject['headers'] = {}
    responseObject['headers']['Content-Type'] = 'application/json'
    responseObject['body'] = body

    return responseObject
