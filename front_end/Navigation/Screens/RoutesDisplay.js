import { Button, Dimensions, StyleSheet, Text, TouchableOpacity, View, TextInput, SafeAreaView, FlatList} from 'react-native';
import React, { useState, useEffect } from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import HTMLView from 'react-native-htmlview';

import Icon from 'react-native-vector-icons/FontAwesome';
import { IconButton, Colors } from 'react-native-paper';

import StartField from './StartField';
import DestinationField from './DestinationField';
import RouteCard from './RouteCard';
import RouteDirection from './RouteDirection';

export default class RoutesDisplay extends React.Component {
  constructor(props){
        super (props);
        this.returnScreen.bind(this);
        this.setRoute.bind(this);
        this.state = {
          origin: {
            latitude: this.props.parentOrgLat,
            longitude: this.props.parentOrgLng
          },
          destination: { latitude: this.props.parentDesLat, longitude: this.props.parentDesLng },

          region: {
            latitude: this.props.parentDesLat,
            longitude: this.props.parentDesLng,
            deltaLatitude: 0.01,
            deltaLongitude: 0.01
          },

          travelTimes: this.props.parentTrTime,
          travelDistances: this.props.parentTrDis,

          directions: null,
          directionsRendered: this.props.parentDirRend,
          routesList: this.props.parentRtsList,

          routesQualities: this.props.parentRtQlt,

          destinationState: false,
          selected: false,
          selectedNum: -1,
        };
      }

      setRoute = (num) => {
        this.setState({
          selectedNum: num
        })
      }

      returnScreen = () => {
        this.props.returnRoutes()
      }


      render() {
    return (
      <View
      styles={{
        margin: 0,
        flex: 1
      }}>
      <IconButton
        icon={((this.state.selectedNum == -1)?'arrow-left':'close-octagon')}
        mode="contained"
        color="white"
        size={((this.state.selectedNum == -1)?35:55)}
        style={{
          backgroundColor: ((this.state.selectedNum == -1)?'#10b5f2':'#f7484b'),
          marginLeft: ((this.state.selectedNum == -1)?'5%':'auto'),
          marginRight: ((this.state.selectedNum == -1)?'auto':'5%'),
          marginTop: ((this.state.selectedNum == -1)?'15%':((Dimensions.get('window').height)/1.31)),
        }}
        onPress={() => {
          this.returnScreen()
        }}/>

        <MapView
               provider={PROVIDER_GOOGLE}
               apikey={"AIzaSyARpyYOqJ5QirvqpdH71xDAEGqCEBHS9ls"}
               style={{
                 position: 'absolute',
                 width: '100%',
                 height: (Dimensions.get('window').height)/((this.state.selectedNum == -1)?1.5:1),
                 zIndex: -1,
               }}
               region={{
                 latitude: this.state.region.latitude,
                 longitude: this.state.region.longitude,
                 latitudeDelta: this.state.region.deltaLatitude,
                 longitudeDelta: this.state.region.deltaLongitude
               }}
               showsUserLocation={true}
               followUserLocation={true}
             >
        <MapViewDirections
          origin={this.state.origin}
          destination={this.state.destination}
          apikey={"AIzaSyARpyYOqJ5QirvqpdH71xDAEGqCEBHS9ls"}
          strokeWidth={5}
          strokeColor='#10b5f2'
          timePrecision="now"
          onReady={result => {
            this.setState({
              travelTime: result.duration,
              travelDistance: result.distance,
            })
          }}
        >
        </MapViewDirections>
        <MapView.Marker coordinate={this.state.origin}/>
        <MapView.Marker coordinate={this.state.destination}/>
      </MapView>
      { this.state.selectedNum != -1 &&
        <View style={{
        position: 'absolute',
        width: '100%',
        backgroundColor: "#10b5f2",
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
      }}>
        <RouteDirection routesList={this.state.routesList} selectedNum={this.state.selectedNum}/>
      </View>}
      { this.state.selectedNum  == -1 &&
        <View
      style={{
        position: 'fixed',
        top: (Dimensions.get('window').height)/2.5,
        width: '100%',
        backgroundColor: 'white',
        height: (Dimensions.get('window').height)/2.5,
        paddingBottom:'12%',
        borderTopLeftRadius:40,
        borderTopRightRadius:40,
      }}>
      {
        this.state.routesList.map((route, i) => (
          <RouteCard key={i} id={i} duration={this.state.travelTimes[i]} distance={this.state.travelDistances[i]} quality={this.state.routesQualities[i]} setRoute={this.setRoute}/>
        ))
      }
      </View>}
      </View>
    )
  }
}
