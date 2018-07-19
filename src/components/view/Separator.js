import React, { Component } from 'react';
import { View } from "react-native";

class Separator extends Component {
    render() {

        const { height, color } = this.props

        return (
            <View style={{height:height,backgroundColor:color}}>
                
            </View>
        );
    }
}

export default Separator;