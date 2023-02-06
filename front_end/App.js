import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';
import gyro_data_handler from "./handleGyroData"

import MainContainer from './Navigation/MainContainer';

function App() {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const _subscribe = () => {
    setSubscription(
        Accelerometer.addListener(accelerometerData => {
          setData(accelerometerData);
        })
    );
    Accelerometer.setUpdateInterval(300);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const { x, y, z } = data;

  gyro_data_handler(data);


  return (
    <MainContainer/>
  );
}

export default App;

// export default function App() {
//
//   const [data, setData] = useState({
//     x: 0,
//     y: 0,
//     z: 0,
//   });
//   const [subscription, setSubscription] = useState(null);
//
//   const _subscribe = () => {
//     setSubscription(
//         Accelerometer.addListener(accelerometerData => {
//           setData(accelerometerData);
//         })
//     );
//     Accelerometer.setUpdateInterval(300);
//   };
//
//   const _unsubscribe = () => {
//     subscription && subscription.remove();
//     setSubscription(null);
//   };
//
//   useEffect(() => {
//     _subscribe();
//     return () => _unsubscribe();
//   }, []);
//
//   const { x, y, z } = data;
//
//   gyro_data_handler(data);
//   // TODO: Send {x,y,z} to another function to process the data on the device, and then send to AWS server through API call
//
//
//   return (
//       <View style={styles.container}>
//         <Text style={styles.text}>Accelerometer: (in Gs where 1 G = 9.81 m s^-2)</Text>
//         <Text style={styles.text}>
//           x: {x} y: {y} z: {z}
//         </Text>
//       </View>
//   );


  // return (
  //   <View style={styles.container}>
  //     <Text>Open up App.js to start working on your app!</Text>
  //     <StatusBar style="auto" />
  //   </View>
  // );
// }
