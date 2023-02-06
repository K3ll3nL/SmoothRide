import mysql.connector



def lambda_handler(event, context):
    mydb = mysql.connector.connect(
              host="smoothridedb1.caypjersxse1.us-east-2.rds.amazonaws.com",
              user="admin",
              password="OkZs9OK3K3QwEy7ZNYjF",
              database="smoothrideDB"
        )
    cursor = mydb.cursor()

    fastest_route = event["fastest_route"]
    excellent = event["excellent"]
    good = event["good"]
    poor = event["poor"]

    cursor.execute("UPDATE preferences SET fastest_route = %d, excellent = %d, good = %d, poor = %d;"% (fastest_route,excellent,good,poor))
    mydb.commit()