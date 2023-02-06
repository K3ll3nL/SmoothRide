import React from "react";
import { Text, View, StyleSheet, Pressable, Dimensions} from 'react-native';

export default class RouteDirection extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            route: this.props.routesList[this.props.selectedNum] || ["turn right","turn left","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],
            selectedNum: this.props.selectedNum,
            text: "",
            count: 0
        }
        this.state.text = this.state.route[0].HTMLInstructions;
    }

    

    render (){
        return (
            <Pressable style={{
              height: (Dimensions.get('window').height)/4,
            }}
              onPress={() => {
                if(this.state.count < this.state.route.length - 1){
                  this.state.count++;
                  this.setState({text: this.state.route[this.state.count].HTMLInstructions})
                }
              }}>
                <View >
                    <Text style={{
                        paddingLeft: '5%',
                        paddingRight: '5%',
                        marginTop: '25%',
                        textAlign: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 36
                    }}>{this.state.text}</Text>
                </View>
            </Pressable>
        )
    }
}
