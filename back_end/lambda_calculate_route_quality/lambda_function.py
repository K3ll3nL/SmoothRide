import json
import polyline
import math
import mysql.connector


# Outputs how bad a route is
def rate_route(route):

    mydb = mysql.connector.connect(
          host="smoothridedb1.caypjersxse1.us-east-2.rds.amazonaws.com",
          user="admin",
          password="OkZs9OK3K3QwEy7ZNYjF",
          database="smoothrideDB"
    )
    cursor = mydb.cursor()
    # Getting all of the "shitty" road segments
    cursor.execute("SELECT latitude, longitude FROM worst_road_segments")

    rows = cursor.fetchall()


    # Check how far a point is away from a line:
    def distance_from_line(point, line):
        # https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
        x0, y0 = point
        x1, y1 = line[0]
        x2, y2 = line[1]

        dx = x2 - x1
        dy = y2 - y1

        u = ((x0 - x1) * dx + (y0 - y1) * dy) / (dx * dx + dy * dy)

        if u > 1:
            x = x2
            y = y2
        elif u < 0:
            x = x1
            y = y1
        else:
            x = x1 + u * dx
            y = y1 + u * dy

        dx = x - x0
        dy = y - y0

        return math.sqrt(dx * dx + dy * dy)

    # Checks to see if a coordinate is on a polyline:
    def isLocationOnPolyline(polyline, lat, long, tolerance):
        latlong = (lat, long)
        for i in range(0, len(polyline) - 1):
            line = (polyline[i], polyline[i + 1])
            if distance_from_line(latlong, line) <= tolerance:
                return True
        return False

    # List of steps
    steps_list = route[0]["legs"][0]["steps"]
    total_score = 0

    for step in steps_list:
        line_list = polyline.decode(step["polyline"]["points"])
        for row in rows:
            if isLocationOnPolyline(line_list, float(row[0]), float(row[1]), 10e-4):
                total_score += 1



    return total_score



def lambda_handler(event, context):
    data = event["route"]
    # Getting the route from a file
    quality = rate_route(data)


    transactionResponse = {}
    transactionResponse['route_quality'] = quality


    responseObject = {}
    responseObject['statusCode'] = 200
    responseObject['headers'] = {}
    responseObject['headers']['Content-Type'] = 'application/json'
    responseObject['body'] = {'route_quality' : quality}

    return responseObject