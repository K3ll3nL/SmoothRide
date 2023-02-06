import { Dimensions, StyleSheet, Text, TouchableOpacity, View, TextInput, SafeAreaView, Button, FlatList} from 'react-native';
import React, { useState, useEffect } from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import HTMLView from 'react-native-htmlview';

export default class DestinationField extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick.bind(this);
    this.handleChange.bind(this);
  }

  handleClick = (arr1, arr2) => {
    // Simply call the setStateOfParent function from
    // prop and pass required argument
    this.props.setDestination(arr1, arr2);
  }

  handleChange = () => {
    this.props.calcDelta();
  }

  render() {
    const { selected } = this.props;
    if (this.props.selected == true) {
      return (
        <GooglePlacesAutocomplete
            placeholder='Search Destination'
            textInputProps={{ placeholderTextColor: 'white'}}
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
            // listViewDisplayed='true'    // true/false/undefined
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true

              this.handleClick(details.geometry.location.lat, details.geometry.location.lng);
              this.handleChange
            }}

            query={{
              key: 'AIzaSyARpyYOqJ5QirvqpdH71xDAEGqCEBHS9ls',
              language: 'en', // language of the results
            }}
            styles={{
              textInput: {
                fontSize: 16,
                color: 'white',
                height: 60,
                borderRadius: 50,
                paddingLeft: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                backgroundColor: '#10b5f2'
              },
              textInputContainer: {
                width: '90%',
              },
              predefinedPlacesDescription: {
                color: '#1faadb'
              },
              container: {
                flex: 0,
                marginTop: '6%',
                alignItems: 'center',
                justifyContent: 'center',
              },
            }}
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          />
        )
      }
      else{
      return (
        <GooglePlacesAutocomplete
            placeholder='Search Destination'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
            // listViewDisplayed='true'    // true/false/undefined
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true

              this.handleClick(details.geometry.location.lat, details.geometry.location.lng);
              this.handleChange
            }}

            query={{
              key: 'AIzaSyARpyYOqJ5QirvqpdH71xDAEGqCEBHS9ls',
              language: 'en', // language of the results
            }}
            styles={{
              textInput: {
                fontSize: 16,
                height: 60,
                borderRadius: 50,
                paddingLeft: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
              },
              textInputContainer: {
                width: '90%',
              },
              predefinedPlacesDescription: {
                color: '#1faadb'
              },
              container: {
                flex: 0,
                marginTop: '6%',
                alignItems: 'center',
                justifyContent: 'center',
              },
            }}
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          />
        )
      }
  }
}
