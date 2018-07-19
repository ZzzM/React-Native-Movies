
import { Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get('window');


const iPhoneX = (
    Platform.OS === 'ios' &&
    (
        (height === 812 && width === 375) ||
        (height === 375 && width === 812)
    )
)



export default {

    DefaultImageUrl:'https://img3.doubanio.com/f/movie/63acc16ca6309ef191f0378faf793d1096a3e606/pics/movie/celebrity-default-large.png',


    QueryTimeout:1000,

    MoviePageSize:5,
    DramaPageSize:6,
    ReviewsPageSize:10,
    CommentsPageSize:10,
    SearchPageSize:10,

    SafeTop:(iPhoneX?44:20),
    SafeBottom:(iPhoneX?34:0),
    

    Screen: {
        Width: width,
        Height: height
    },

    Color: {
        Theme: '#2d3436',
        Rank: '#e74c3c',
        Star: '#f1c40f',
        Font3: '#333',
        Font6: '#666',
        Font9: '#999',
        LightGray: '#ecf0f1',

        Clear: 'transparent',
    }




}