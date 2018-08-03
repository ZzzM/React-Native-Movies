import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    ActivityIndicator,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    ScrollView
} from "react-native";
import FilmCell from './FilmCell'
import Constant from '../../utils/Constant'
import Network from '../../utils/Network'
import { ButtonGroup, Header } from "react-native-elements";
import Separator from "../view/Separator";
import SplashScreen from "react-native-splash-screen";
import Orientation from "react-native-orientation";

const buttons = ['正在热映', '即将上映']
class FilmScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 0,
            total: [0, 0],
            pageIndex: [0, 0],
            refreshing: [false, false],
            loading: [true, true],
            data: [[], []]
        }
    }


    componentDidMount() {
        SplashScreen.hide()
        Orientation.addOrientationListener(this._orientationDidChange.bind(this))
        this._fetchData()
    }

    componentWillUnmount(){
        Orientation.removeOrientationListener()
    }

    _orientationDidChange (orientation){
        if (orientation === 'PORTRAIT') {
            this._scrollView.scrollTo({ x: Constant.Screen.Width * this.state.selectedIndex, y: 0, animated: true })
        }
    }

    _updateSelectedIndex(selectedIndex) {
        
        this._scrollView.scrollTo({ x: Constant.Screen.Width * selectedIndex, y: 0, animated: true })

        this.setState({
            selectedIndex: selectedIndex
        }, () => {

            const { total, selectedIndex } = this.state
            
            if (total[selectedIndex] == 0) {
                this._fetchData()
            }

        })


    }

    _onRefresh() {

        const { pageIndex, selectedIndex, refreshing } = this.state

        pageIndex[selectedIndex] = 0
        refreshing[selectedIndex] = true

        this.setState({
            pageIndex: pageIndex,
            refreshing: refreshing
        }, () => {
            this._fetchData()
        })
    }
    _onEndReached() {

        const { selectedIndex, pageIndex, total } = this.state

        pageIndex[selectedIndex] += Constant.MoviePageSize


        if (pageIndex[selectedIndex] >= total[selectedIndex]) {
            alert('无更多数据加载')
        } else {
            this.setState({
                pageIndex: pageIndex
            }, () => {
                this._fetchData()
            })
        }
    }

    _fetchData() {



        const { selectedIndex, total, pageIndex, loading, refreshing, data } = this.state
        const params = { city: '深圳', start: pageIndex[selectedIndex], count: Constant.MoviePageSize }


        selectedIndex ?
            Network.fetchComingMovies(params)
                .then(this._result.bind(this))
                .catch(this._error.bind(this)) :
            Network.fetchHotMovies(params)
                .then(this._result.bind(this))
                .catch(this._error.bind(this))

    }

    _result(result) {

        const { selectedIndex, total, loading, refreshing, data } = this.state

        total[selectedIndex] = result.total
        data[selectedIndex] = refreshing[selectedIndex] ?
            result.subjects :
            [...data[selectedIndex], ...result.subjects],

            loading[selectedIndex] = false
        refreshing[selectedIndex] = false

        this.setState({
            total: total,
            data: data,
            loading: loading,
            refreshing: refreshing

        })
    }

    _error(error) {
        const { selectedIndex, loading, refreshing } = this.state

        loading[selectedIndex] = false
        refreshing[selectedIndex] = false

        this.setState({ loading: loading, refreshing: refreshing },
            () => {
                alert(error)
            })
    }


    _filmCell({ item }) {
        return <FilmCell movie={item} didSelected={() => this.props.navigation.navigate('Detail', { movie: item })} />
    }
    render() {


        const { loading, refreshing, data, selectedIndex } = this.state


        return (
            <View style={styles.container}>
                <Header
                    marginTop={Constant.SafeTop}
                    backgroundColor='white'   
                >
                    <ButtonGroup
                        disableSelected={true}
                        onPress={this._updateSelectedIndex.bind(this)}
                        buttons={buttons}
                        containerStyle={{ flex: 1, height: 40 }}
                        selectedIndex={selectedIndex}
                        selectedButtonStyle={{ backgroundColor: Constant.Color.Theme }}
                        selectedTextStyle={{ color: 'white' }}
                        textStyle={{ color: Constant.Color.Theme }}
                    />
                </Header>
                <ScrollView
                    ref={component => this._scrollView = component}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}>
                    {
                        buttons.map((title, index) => {
                            return (
                                <View style={{ width: Constant.Screen.Width }}>
                                    {
                                        loading[index] ?
                                            <ActivityIndicator size='large' style={styles.hud} /> :
                                            <FlatList
                                                data={data[index]}
                                                renderItem={this._filmCell.bind(this)}
                                                refreshing={refreshing[index]}
                                                onRefresh={this._onRefresh.bind(this)}
                                                onEndReached={this._onEndReached.bind(this)}
                                                keyExtractor={item => item.id}
                                                ItemSeparatorComponent={()=><Separator height={0.5} color={Constant.Color.LightGray} />}
                                                onEndReachedThreshold={0}
                                            />
                                    }
                                </View>
                            )
                        })
                    }
                </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    hud: {
        flex: 0.5
    }
})

export default FilmScreen;