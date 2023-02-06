import React from "react";
import { Text, View, StyleSheet, Pressable} from 'react-native';

export default class RouteCard extends React.Component{
    constructor(props){
        super(props);
        this.sendId.bind(this);
        this.state ={
            id: (this.props.id+1) || -1,
            duration: this.props.duration || "-1 mins",
            quality: this.convertQuality(this.props.quality)  || "ERROR: This has no quality",
            distance: this.props.distance || "-1mi",
        }
    }

    sendId = () => {
        this.props.setRoute((this.state.id-1));
    }

    convertQuality (num) {
        if(num >= 0 && num <= 3){
            return "Excellent quality roads"
        }
        else if(num >=4 && num <=7){
            return "Good quality roads"
        }
        else if(num >=8 && num <=12){
            return "Poor quality roads"
        }
        else if(num >=13 && num <=20){
            return "Very poor quality roads!"
        }else{
            return "ERROR: UNREACHABLE QUALITY"
        }
    }

    render () {
        return (
            <View style={{
                width:'96%',
                marginLeft: '2%',
                marginTop: '2%',
                flex:1,
                flexDirection: "row",
                borderBottomWidth: 1.5,
                borderColor: "#DBDBDB"
            }}>
                <View style={{                  //route chip
                    flex: 2,
                    width: '75%',
                    margin: '2%',
                }}>
                    <View style={{margin: '3%',flexDirection:'row'}}>
                        <Text style={{fontWeight:'bold',color:"#10b5f2"}}>{this.state.duration}</Text>
                        <Text> ({this.state.distance})</Text>
                    </View>
                    <View style={{margin: '3%'}}>
                        <Text>{this.state.quality}</Text>
                    </View>
                </View>
                <View style={{
                    flex: 1,
                    width: '25%'
                }}>
                    <Pressable
                    onPress={() => {
                      this.sendId();
                    }}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '50%',
                        width: '90%',
                        borderRadius: 40,
                        backgroundColor: "#10b5f2",
                        marginVertical: '15%',
                    }}>
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 15,
                            letterSpacing: 2
                        }}>START</Text>
                    </Pressable>
                </View>
            </View>
        )
    }

}
