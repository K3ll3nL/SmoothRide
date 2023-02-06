import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import axios from 'axios';

var gyroData = []
var post_data = []
var count = 0
export default async function gyro_data_handler(data){
    count += 1;
    var location;
    [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS === 'android' && !Constants.isDevice) {
                setErrorMsg(
                    'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
                );
                return;
            }
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
        })();
    }, []);

    async function get_location(){

        let location = await Location.watchPositionAsync(
            {accuracy:Location.Accuracy.High},
            (loc) => {console.log("")}
        ).then(
            function log(){}
        )
    }


    const { x, y, z } = data;
    var net_force = Math.sqrt(x*x+y*y+z*z);
    if(net_force === 0){
        return;
    }

    gyroData.push(net_force)
    if(gyroData.length > 10){
        var gyro_change = []
        for(var i = 1; i < gyroData.length; i++){
            gyro_change.push(Math.abs(gyroData[i]-gyroData[i-1]))
        }
        var total = 0;
        for(var i = 0; i < gyro_change.length; i++){
            total += gyro_change[i]
        }
        var avg = total/gyro_change.length;
        gyroData = []
        try{
            await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest, timeInterval: 100, distanceInterval: 0 }).then(
                function(loc){
                    post_data.push({
                        "latitude": loc.coords.latitude,
                        "longitude": loc.coords.longitude,
                        "quality": avg
                    })
                }
            )

        }
        catch (e){
            console.log("location coords null")
        }
        if(post_data.length > 10){
            send_to_server(post_data);
        }

        gyroData = [];

    }

}

function round(n){
    if (!n) {
        return 0;
    }
    return Math.floor(n * 100000) / 100000;
}

function send_to_server(){
    var axios = require('axios');

    var config = {
        method: 'post',
        url: 'https://mut7xqutbc.execute-api.us-east-2.amazonaws.com/Test/datacollect',
        headers: { },
        data : {
            "data_list": post_data
        }
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    console.log("Sent to server")
    post_data = []

}
