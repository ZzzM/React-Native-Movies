import React, { Component } from 'react';
import {
    View
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'

import Constant from '../../utils/Constant';


class Star extends Component {





    render() {

        const { score, size } = this.props

        const stars = []

        const full = score[0]
        const half = score[1] / 5
        const empty = 5 - full - half


        for (let i = 0; i < full; i++) {
            stars.push(<Icon  name='star' size={size} color={Constant.Color.Star} />)
        }

        for (let j = 0; j < half; j++) {
            stars.push(<Icon  name='star-half-full' size={size} color={Constant.Color.Star} />)
        }

        for (let k = 0; k < empty; k++) {
            stars.push(<Icon name='star-o' size={size} color={Constant.Color.Star} />)
        }

        return <View style={{flexDirection:'row'}}>{stars}</View>

    }
}

export default Star;