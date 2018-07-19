import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet
}
    from "react-native";
import Constant from '../../utils/Constant';
import Rank from '../view/Rank';



class FilmCell extends Component {


    _didSelected() {
        if (this.props.didSelected) {
            this.props.didSelected()
        }
    }

    render() {

        const movie = this.props.movie

        return (
            <TouchableOpacity style={styles.container} onPress={this._didSelected.bind(this)}>
                <View style={{ flex: 1 }}>
                    <Image
                        resizeMode='stretch'
                        style={styles.image}
                        source={{ url: movie.images.large.replace('webp', 'png') }} />
                </View>

                <View style={styles.description}>
                    <Text style={styles.title}>{movie.title}</Text>
                    <Rank movie={movie} ></Rank>

                    <View style={styles.castContainer}>

                        <Text style={styles.castTitle}>{'主演：'}
                            <Text style={styles.cast}>{movie.casts.map(cast => cast.name).join('/')}</Text>
                        </Text>


                        <Text style={styles.castTitle}>{'导演：'}
                            <Text style={styles.cast}>{movie.directors.map(director => director.name).join('/')}</Text>
                        </Text>



                    </View>

                </View>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 15
    },
    image: {
        width: 100,
        height: 120
    },
    description: {
        flex: 2,
        justifyContent: 'space-between',
    },
    title: {
        color: Constant.Color.Font3,
        fontSize: 18
    },
    castContainer: {

    },
    castTitle: {
        marginTop: 5,
        color: Constant.Color.Font9,
        fontSize: 15
    },
    cast: {
        color: Constant.Color.Font6,
        fontSize: 15,
    }

})

export default FilmCell;