import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    SafeAreaView,
    ScrollView,
    Button,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ImageBackground
} from "react-native";
import Constant from '../../utils/Constant';
import Lightbox from "react-native-lightbox";
import Swiper from "react-native-swiper";
import Network from "../../utils/Network";
import Separator from "../view/Separator";
import Star from '../view/Star'

import Icon from "react-native-vector-icons/FontAwesome";




class DetailScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url: 'null',
            loading: true,
            expand: false,
            subject: {}
        }
    }

    static navigationOptions = ({ navigation }) => {


        const { color, title, reviews } = navigation.state.params


        return {

            headerTintColor: 'white',
            headerTitle: title ? title : '电影',

            headerLeft: <Text
                style={{ left: 20, fontSize: 15, color: 'white', textAlign: 'left' }}
                onPress={() => navigation.pop()}
            >返回</Text>,
            headerRight: <Text
                style={{ right: 20, fontSize: 15, color: 'white', textAlign: 'left' }}
                onPress={() => reviews()}
            >影评</Text>,
            headerStyle: {
                backgroundColor: color,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                borderBottomWidth: 0
            }
        }
    }

    componentDidMount() {
        this._fetchData()
        this.props.navigation.setParams({
            reviews: this._reviews.bind(this)
        })
    }

    _reviews() {

        const reviews = this.state.subject.popular_reviews

        if (reviews.length) {
            this.props.navigation.navigate('Review', { reviews: reviews })
        } else {
            alert('暂无影评')
        }


    }


    _fetchData() {
        const { movie } = this.props.navigation.state.params
        Network.fetchDetail(movie.id, { city: '深圳' })
            .then(result =>
                this.setState({
                    subject: result,
                    loading: false
                })
            )
            .catch(e =>
                this.setState({
                    loading: false
                }, () => {
                    alert(e)
                })

            )
    }


    _date() {
        const split = ' / '
        const { year, countries, genres, title, original_title } = this.state.subject
        let date = year + split + countries.join(split) + split + genres.join(split)

        if (title !== original_title) {
            return date + '\n原名：' + original_title
        }

        return date
    }

    _viewer(urls, index) {

        return (
            <Swiper
                showsPagination={false}
                loop={false}
                index={index}>
                {
                    urls.map(url => {
                        return (
                            <Image
                                style={{ flex: 1 }}
                                resizeMode='contain'
                                source={{ url: url }}
                            />
                        )
                    }
                    )
                }
            </Swiper >
        )
    }

    _cast() {
        const { casts, directors } = this.state.subject


        const titles = []
        const names = []

        const urls = [
            ...directors.map(director => {
                titles.push('导演')
                names.push(director.name)
                return director.avatars ?
                    director.avatars.large.replace('webp', 'png') :
                    Constant.DefaultImageUrl
            }),
            ...casts.map(cast => {
                titles.push('')
                names.push(cast.name)
                return cast.avatars ?
                    cast.avatars.large.replace('webp', 'png') :
                    Constant.DefaultImageUrl
            })]


        return urls.map((url, index) => {

            const name = names[index]
            const title = titles[index]
            const last = titles.length - 1


            return (
                <TouchableOpacity style={{ paddingLeft: index > 0 ? 10 : 20, paddingRight: last == index ? 20 : 0 }}>
                    <Lightbox swipeToDismiss={false} renderContent={this._viewer.bind(this, urls, index)}>
                        <Image
                            style={{ height: 180, width: 120 }}
                            source={{ url: url }}
                        />
                    </Lightbox>
                    <View style={{ marginTop: 5, width: 120, height: 30, justifyContent: 'space-between', }}>
                        <Text style={{ textAlign: 'center', fontSize: 12, color: Constant.Color.Font6 }} numberOfLines={1}>{name}</Text>
                        <Text style={{ textAlign: 'center', fontSize: 10, color: Constant.Color.Font9 }}>{title}</Text>
                    </View>
                </TouchableOpacity>
            )

        })

    }


    _photo() {

        const { trailers, photos } = this.state.subject
        const urls = [...trailers.map(trailer => trailer.medium), ...photos.map(photo => photo.image.replace('webp', 'png'))]
        const last = urls.length - 1


        return urls.map((url, index) => {


            const trailer = trailers[index]

            return (
                <TouchableOpacity style={{ paddingLeft: index > 0 ? 10 : 20, paddingRight: last == index ? 20 : 0 }}>

                    {
                        index < trailers.length ?
                            <ImageBackground
                                style={{ height: 120, width: 180, alignItems: 'center', justifyContent: 'center' }}
                                source={{ url: url }} >
                                <Icon.Button
                                    name='play-circle'
                                    size={50} color='white'
                                    backgroundColor={Constant.Color.Clear}
                                    onPress={this._play.bind(this, trailer)} />

                            </ImageBackground> :
                            <Lightbox swipeToDismiss={false} renderContent={this._viewer.bind(this, urls, index)}>
                                <Image
                                    style={{ height: 120, width: 180 }}
                                    source={{ url: url }}
                                />
                            </Lightbox>
                    }
                </TouchableOpacity>
            )
        })
    }


    _play(trailer) {

        this.props.navigation.navigate('Player', { trailer: trailer })
    }


    _onScroll(event) {

        const { movie } = this.props.navigation.state.params

        const offsetY = event.nativeEvent.contentOffset.y
        const change = offsetY > (350 + Constant.SafeTop)
        this.props.navigation.setParams({
            color: change ? Constant.Color.Theme : Constant.Color.Clear,
            title: change ? movie.title : '电影'
        })

    }

    _getDate(date) {

        const oneDay = 1000 * 60 * 60 * 24
        const oneYear = 365
        const oneMonth = 30

        const create = new Date(date.replace(' ', 'T') + 'Z')
        const ms = Date.now() - create.getTime()

        days = Math.round(ms / oneDay)


        if (days / 365 > 1) {
            return Math.round(days / 365) + '年前'
        }
        else if (days / 30 > 1) {
            return Math.round(days / 365) + '个月前'
        } else if (days > 1) {
            return days + '天前'
        } else {
            return '今天'
        }
    }

    render() {

        const {
            title,
            images,
            pubdates,
            durations,
            rating,
            ratings_count,
            summary,
            popular_comments,
            popular_reviews
        } = this.state.subject

        return (

            this.state.loading ?
                <ActivityIndicator size='large' style={styles.hud} /> :
                <ScrollView
                    style={{ backgroundColor: Constant.Color.Theme }}
                    onScroll={this._onScroll.bind(this)}
                >

                    <View style={styles.posterContainer}>
                        <Image
                            resizeMode='stretch'
                            style={{ height: 280, width: Constant.Screen.Width / 2 }}
                            source={{ url: images.large.replace('webp', 'png') }}
                        />
                    </View>

                    <View style={styles.movieContainer}>
                        <View style={styles.introContainer}>
                            <Text style={{ fontSize: 20, color: Constant.Color.Font3 }}>{title}</Text>
                            <Text style={{ fontSize: 11, color: Constant.Color.Font6, marginTop: 5 }}>{this._date()}</Text>
                            <Text style={{ fontSize: 11, color: Constant.Color.Font6 }}>{'上映时间：' + pubdates.join(' / ')}</Text>
                            <Text style={{ fontSize: 11, color: Constant.Color.Font6 }}>{'片长：' + durations.join(' / ')}</Text>
                        </View>
                        <View style={styles.ratingContainer}>
                            <Text style={{ fontSize: 20, color: Constant.Color.Font3 }}>{rating.average}</Text>
                            <Star score={rating.stars} size={18} />
                            <Text style={{ fontSize: 13, color: Constant.Color.Font9 }}>{rating.average !== 0 ? ratings_count + '人' : '暂无评分'}</Text>
                        </View>
                    </View>


                    <Separator height={0.5} color={Constant.Color.LightGray} />

                    <View style={styles.descriptionContainer}>

                        <Text style={{ fontSize: 13, color: Constant.Color.Font9 }}>剧情简介</Text>
                        <Text
                            style={{ fontSize: 15, color: Constant.Color.Font6, marginTop: 5 }}
                            numberOfLines={this.state.expand ? 0 : 4}
                            onPress={() => this.setState({ expand: !this.state.expand })}>{summary}
                        </Text>

                    </View>

                    <View style={{ paddingBottom: 15, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 13, color: Constant.Color.Font9, marginLeft: 20 }}>影人</Text>
                        <ScrollView
                            style={{ marginTop: 10 }}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                            {this._cast()}
                        </ScrollView>
                    </View>

                    <View style={{ paddingBottom: 30, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 13, color: Constant.Color.Font9, marginLeft: 20 }}>预告片/剧照</Text>
                        <ScrollView
                            style={{ marginTop: 10 }}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                            {this._photo()}
                        </ScrollView>
                    </View>

                    <View style={{ backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 13, color: Constant.Color.Font9, marginLeft: 20 }}>短评</Text>
                        {
                            popular_comments.map(comment => {

                                return (
                                    <View style={{ padding: 20, flexDirection: 'row', backgroundColor: 'white' }}>
                                        <Image source={{ uri: comment.author.avatar }} style={{ width: 25, height: 25, borderRadius: 25 / 2 }} />
                                        <View style={{ paddingLeft: 10 }}>
                                            <View style={{ paddingTop: 5, paddingBottom: 5, flexDirection: 'row' }}>
                                                <Text style={{ color: Constant.Color.Font3, marginRight: 5 }}>{comment.author.name}</Text>
                                                <Star score={comment.rating.value * 10 + ''} size={15} />
                                                <Text style={{ flex: 1, textAlign: 'right', fontSize: 13, color: Constant.Color.Font9 }}><Icon name='thumbs-o-up' /> {comment.useful_count}</Text>
                                            </View>
                                            <Text style={{ color: Constant.Color.Font6, width: Constant.Screen.Width - 70 }}>{comment.content}</Text>
                                            <Text style={{ top: 5, color: Constant.Color.Font9 }}>{this._getDate(comment.created_at)}</Text>
                                        </View>


                                    </View>
                                )

                            })
                        }
                    </View>

                </ScrollView>

        )
    }
}

const styles = StyleSheet.create({
    hud: {
        flex: 0.5
    },
    posterContainer: {
        paddingTop: 30 + Constant.SafeTop + 44,
        paddingBottom: 30,
        backgroundColor: Constant.Color.Theme,
        alignItems: 'center',
        justifyContent: 'center'
    },
    movieContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20
    },
    introContainer: {
        width: Constant.Screen.Width - 150,
    },
    ratingContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        width: 100,
        height: 100,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        backgroundColor: 'white',
    },
    descriptionContainer: {
        padding: 20,
        backgroundColor: 'white',
    }


})


export default DetailScreen;