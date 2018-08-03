import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    SafeAreaView
} from "react-native";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/FontAwesome";
import Constant from '../../utils/Constant';
import Orientation from "react-native-orientation";

class PlayerScreen extends Component {


    constructor(props) {
        super(props);
        this.state = {
            paused: false
        }
    }

    static navigationOptions = ({ navigation }) => {


        const { trailer } = navigation.state.params


        return {
            headerRight:<Icon.Button 
            name='close' 
            color='white' 
            backgroundColor={Constant.Color.Clear}
            onPress={()=>navigation.pop()}
            />,
            headerLeft:null,
            headerStyle: {
                backgroundColor: Constant.Color.Clear,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                borderBottomWidth: 0
            }
        }
    }

    componentWillMount(){
        Orientation.lockToLandscapeRight()
    }

    // componentDidMount() {
        
    // }
    componentWillUnmount(){
        Orientation.lockToPortrait()
    }

    render() {

        const { trailer } = this.props.navigation.state.params
        const { paused } = this.state
        const width = Constant.Screen.Height 
        const height = Constant.Screen.Width
    
        return (

            //<SafeAreaView style={{position:'absolute',left:0,bottom:0,top:0,right:0,backgroundColor:'black'}}>

            <SafeAreaView style={{flex:1,backgroundColor:'black'}}>

                <Video
      
                    style={{flex:1}}
                    paused={paused}
                    ref={component => this._player = component}
                    source={{ uri: trailer.resource_url }}
                />

            </SafeAreaView>


        );
    }
}

export default PlayerScreen;