import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import MapInputs from './MapInputs';
import RoutesDisplay from './RoutesDisplay';

export default class MapsScreen extends React.Component {

  constructor(props) {
    super (props);
    this.displayRoutes.bind(this);
    this.returnRoutes.bind(this);
    this.state ={
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

      routesDisplay: false,

      directions: null,
      directionsRendered: [],
      routesList: [],

      routesQualities: []
    }
  }

  displayRoutes = () => {
    this.setState({
      routesDisplay: true
    })
  }

  returnRoutes = () => {
    this.setState({
      routesDisplay: false
    })
  }

  displayRoutes = (olt, olg, dlt, dlg, rlt, rlg, drn, lst, ttm, trd, rql) => {
    console.log("Route List Size: " + lst.length)
    console.log("Road Quality Array Size: " + rql.length);
    console.log("Roads Quality ratings: " + rql[0] + ", " + rql[1] + ", " + rql[2]);
    this.setState({
      routesDisplay: true,
      origin: {
        latitude: olt,
        longitude: olg
      },
      destination: {
        latitude: dlt,
        longitude: dlg
      },
      region: {
        latitude: rlt,
        longitude: rlg
      },
      directionsRendered: drn,
      routesList: lst,
      travelTimes: ttm,
      travelDistances: trd,
      routesQualities: rql
    })
  }

  render() {
    return (
      <View>
      { this.state.routesDisplay == false &&
        <MapInputs
          displayRoutes = {this.displayRoutes}
          passMapVals = {this.passMapVals}
        />
      }
      { this.state.routesDisplay == true &&
        <RoutesDisplay
          parentOrgLat= { this.state.origin.latitude }
          parentOrgLng= { this.state.origin.longitude }
          parentDesLat= { this.state.destination.latitude }
          parentDesLng= { this.state.destination.longitude }
          parentRegLat= { this.state.region.longitude }
          parentRegLng= { this.state.region.longitude }
          parentDirRend= { this.state.directionsRendered }
          parentRtsList= { this.state.routesList }

          parentTrTime= { this.state.travelTimes }
          parentTrDis= { this.state.travelDistances }

          parentRtQlt= { this.state.routesQualities}

          returnRoutes = {this.returnRoutes}
         />
      }
      </View>
    )
  }
}
