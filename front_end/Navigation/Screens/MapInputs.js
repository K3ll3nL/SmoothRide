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

export default class MapInputs extends React.Component {
  constructor(props){
        super (props);
        this.setDestination.bind(this);
        this.setOrigin.bind(this);
        this.calcDelta.bind(this);
        this.displayRouteScreen.bind(this);
        this.state = {
          origin: {
            latitude: 0,
            longitude: 0
          },
          destination: { latitude: 0, longitude: 0 },

          region: {
            latitude: 0,
            longitude: 0,
            deltaLatitude: 0.09,
            deltaLongitude: 0.07
          },

          travelTimes: [],
          travelDistances: [],

          directions: null,
          directionsRendered: [],
          routesList: [],

          routesQualities: [],

          destinationState: false,
          selected: false,
        };
      }

      displayRouteScreen = () => {
        this.props.displayRoutes(this.state.origin.latitude,
        this.state.origin.longitude,
        this.state.destination.latitude,
        this.state.destination.longitude,
        this.state.region.latitude,
        this.state.region.longitude,
        this.state.directionsRendered,
        this.state.routesList,
        this.state.travelTimes,
        this.state.travelDistances,
        this.state.routesQualities);
      }

      setOrigin = (arr1, arr2) => {
        this.setState({origin: {latitude: arr1, longitude: arr2}, region: {latitude: arr1, longitude: arr2, deltaLatitude: 0.01,
        deltaLongitude: 0.01}});
        this.calcDelta();
      }

      setDestination = (arr1, arr2) => {
        this.setState({destination: {latitude: arr1, longitude: arr2}, region: {latitude: arr1, longitude: arr2, deltaLatitude: 0.01,
        deltaLongitude: 0.01}});
      }

      componentDidMount() {
        Location.installWebGeolocationPolyfill()
        navigator.geolocation.getCurrentPosition(position => {
          this.setState({
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              deltaLatitude: 0.09,
              deltaLongitude: 0.07
            }
          })
          console.log("Region: " + region)
        });
      }

      calcDelta() {
        let maxLat, maxLong, minLat, minLong;
        if(this.state.origin.latitude > this.state.destination.latitude)
        {
          maxLat = this.state.origin.latitude;
          minLat = this.state.destination.latitude;
        }
        else
        {
          maxLat = this.state.destination.latitude;
          minLat = this.state.origin.latitude;
        }

        if(this.state.origin.longitude > this.state.destination.longitude)
        {
          maxLong = this.state.origin.longitude;
          minLong = this.state.destination.longitude;
        }
        else
        {
          maxLong = this.state.destination.longitude;
          minLong = this.state.origin.longitude;
        }

        const midLat = (minLat + maxLat) / 2;
        const midLng = (minLong + maxLong) / 2;

          const difLat = Math.abs(maxLat - minLat);
          const difLong = Math.abs(maxLong - minLong);
          this.setState({
            deltaLatitude: difLat,
            deltaLongitude: difLong,

            region: {
              latitude: midLat + 0.005,
              longitude: midLng,
              deltaLatitude: difLat + 0.05,
              deltaLongitude: difLong + 0.05
            }
          });
      }

      calculateRoute(){

        if(this.state.origin.latitue != 0 && this.state.destination.longitude != 0)
        {
          const that = this;
          fetch(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.origin.latitude},${this.state.origin.longitude}&destination=${this.state.destination.latitude},${this.state.destination.longitude}&mode=driver&sensor=true&alternatives=true&key=${"AIzaSyARpyYOqJ5QirvqpdH71xDAEGqCEBHS9ls"}`
          )
          .then(function(response){
            return response.text()
          })
          .then(function(responseText){that.setState({directions: responseText})});
        }
      }

      editDirections(){
        let routes = JSON.parse(this.state.directions);
        let numRoutes = routes["routes"].length;
        let tempQualities = []
        let routesArray = []
        for(let x = 0; x < numRoutes; ++x)
        {
          let tempTravelTimes = this.state.travelTimes;
          let tempTravelDistances = this.state.travelDistances;
          let tempDirectionsRendererd = this.state.directionsRendered;
          tempDirectionsRendererd.push(true);
          tempTravelTimes.push(routes["routes"][x]["legs"][0]["duration"]["text"]);
          tempTravelDistances.push(routes["routes"][x]["legs"][0]["distance"]["text"]);

          // console.log(JSON.stringify(routes["routes"][x]["legs"][0]["duration"]["text"]))
          // console.log(JSON.stringify(routes["routes"][x]["legs"][0]["distance"]["text"]))
          this.setState({
            directionsRendered: tempDirectionsRendererd,
            travelDistances: tempTravelDistances,
            travelTimes: tempTravelTimes
          })
          let singleRoute = [];
          singleRoute.push(routes["routes"][x]);
          const that = this;
          fetch(
            `https://mut7xqutbc.execute-api.us-east-2.amazonaws.com/Test/getroutequality`,
            {
              method: "POST",
              body: JSON.stringify( {"route": singleRoute} ),
            }
          )
          .then(response => response.json())
          .then(data => {
              // console.log("Rode Quality: " + data["body"]["route_quality"])
              tempQualities.push(data["body"]["route_quality"]);
              that.setState({
                  routesQualities: tempQualities,
                });
          })
          .catch(err => console.error(err));

          let directionsArray = []
          let routeLegs = routes["routes"][x]["legs"];
          let routeSteps = routeLegs[0]["steps"];
          for(let i = 0; i < routeSteps.length; ++i)
          {
            let currStep = {
              startLocation: {
                lat: "",
                long: ""
              },
              endLocation: {
                lat: "",
                long: ""
              },
              HTMLInstructions: '',
              manuever: ''
            };

            // console.log("Start location lat: " + JSON.stringify(routeSteps[i]["start_location"]["lat"]))
            // console.log("Start location lng: " + JSON.stringify(routeSteps[i]["start_location"]["lng"]))
            // console.log("End location lat: " + JSON.stringify(routeSteps[i]["end_location"]["lat"]))
            // console.log("End location lng: " + JSON.stringify(routeSteps[i]["end_location"]["lng"]))
            // console.log("HTML INSTRUCTIONS: " + JSON.stringify(routeSteps[i]["html_instructions"]))
            // console.log("manuever: " + JSON.stringify(routeSteps[i]["maneuver"]))

            if(i != 0)
            {
              currStep.startLocation.lat = routeSteps[i]["start_location"]["lat"];
              currStep.startLocation.long = routeSteps[i]["start_location"]["lng"];
              currStep.endLocation.lat = routeSteps[i]["end_location"]["lat"];
              currStep.endLocation.long = routeSteps[i]["end_location"]["lng"];
              currStep.HTMLInstructions = routeSteps[i]["html_instructions"].replace(/<[^>]*>?/gm, '');
              if(routeSteps[i]["maneuver"] != undefined)
              {
                currStep.manuever = routeSteps[i]["maneuver"];
              }
              directionsArray.push(currStep);
            }
          }
          routesArray.push(directionsArray)
        }

        // for(let x = 0; x < routesArray.length; ++x)
        // {
        //   console.log("New Route:")
        //   console.log("*******************")
        //   for(let i = 0; i < routesArray[x].length; ++i)
        //   {
        //     console.log(routesArray[x][i])
        //     console.log("================")
        //   }
        //   console.log("*******************")
        // }

        this.setState({
          routesList: routesArray
        });
      }

      _showStart() {
        if(this.state.destinationState == false) {
        this.setState({
          destinationState: true,
          selected: true
        });}
        if(this.state.destinationState == true) {
        this.setState({
          destinationState: false,
          selected: false
        });}
      }

      _showRoutes() {
        if(this.state.routeDisplay == false) {
        this.setState({
          routeDisplay: true
        });}
      }

  render() {
    return (
      <View
      styles={{
        margin: 0,
        flex: 1
      }}>
             <MapView
               provider={PROVIDER_GOOGLE}
               apikey={"AIzaSyARpyYOqJ5QirvqpdH71xDAEGqCEBHS9ls"}
               style={{
                 position: 'absolute',
                 width: '100%',
                 height: Dimensions.get('window').height,
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
        <Text style={{
          marginBottom: '5%'
        }}></Text>
        { this.state.destinationState == true &&
            <StartField setOrigin = {this.setOrigin}/>
        }
        <DestinationField selected = {this.state.selected} setDestination = {this.setDestination}/>
        { this.state.destinationState == true &&
          <IconButton
            icon="arrow-left"
            mode="contained"
            color="white"
            size={35}
            style={{
              backgroundColor: '#10b5f2',
              marginLeft: 'auto',
              marginRight: '5%',
              marginTop: '5%'
            }}
            onPress={() => {
              this._showStart()
            }}/>
        }
        { this.state.destinationState == true &&
          <IconButton
            icon="directions"
            mode="contained"
            color="white"
            size={35}
            style={{
              backgroundColor: '#10b5f2',
              marginLeft: 'auto',
              marginRight: '5%',
              marginTop: '2%'
            }}
            onPress={() =>
              {
                let that = this;
                that.calculateRoute();
                setTimeout(function(){
                  that.editDirections();
                  setTimeout(function(){
                    that.displayRouteScreen();
                  },1000);
                },1000);
              }
            }/>
        }
        { this.state.destinationState == false &&
          <IconButton
            icon="arrow-right"
            mode="contained"
            color="white"
            size={35}
            style={{
              backgroundColor: '#10b5f2',
              marginLeft: 'auto',
              marginRight: '5%',
              marginTop: '2%'
            }}
            onPress={() => {
              this._showStart()
            }}/>
        }
      </View>
    )
  }
}
