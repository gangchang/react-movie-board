import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import axios from 'axios';

import * as utils from '../lib/utils';

function searchMovieListByQuery(query, page) {
    query = encodeURIComponent(query);
    return axios.get(`https://cors-anywhere.herokuapp.com/https://watcha.net/search/movie.json?query=${query}&per=10&page=${page}`);
}

const GET_MOVIE = 'GET_MOVIE';
const SET_QUERY = 'SET_QUERY';
const SET_PAGE = 'SET_PAGE'

export const searchMovie = createAction(GET_MOVIE, searchMovieListByQuery);
export const setQuery = createAction(SET_QUERY);
export const setPage = createAction(SET_PAGE);

const initialState = {
    items: [],
    query: '',
    page: 1,
    loadingStatus: false,
    totalCnt: 0,
    loadMore: false
}

export default handleActions({
    [SET_QUERY]: (state, action) => {
        return {
            query: action.payload,
            page: 1,
            loadingStatus: true,
            totalCnt: state.totalCnt
        }
    },
    [SET_PAGE]: (state, action) => {
        return {
            query: state.query,
            page: action.payload,
            loadingStatus: true,
            totalCnt: state.totalCnt,
            items: state.items
        }
    },
    ...pender({
        type: GET_MOVIE, // type 이 주어지면, 이 type 에 접미사를 붙인 액션핸들러들이 담긴 객체를 생성합니다.
        /*
            요청중 / 실패 했을 때 추가적으로 해야 할 작업이 있다면 이렇게 onPending 과 onFailure 를 추가해주면됩니다.
            onPending: (state, action) => state,
            onFailure: (state, action) => state
        */
        onSuccess: (state, action) => { // 성공했을때 해야 할 작업이 따로 없으면 이 함수 또한 생략해도 됩니다.
            let movieList = [];
            const loadMore = action.payload.data.load_more;

            if(!utils.isEmpty(state.items)) {
                movieList = state.items.concat(action.payload.data.cards[0].items);
            } else {
                movieList = action.payload.data.cards[0].items;
            }

            return {
                items: movieList,
                page: state.page,
                query: state.query,
                loadingStatus: false,
                totalCnt: action.payload.data.total,
                loadMore: loadMore
            }
        },
        onFailure: (state, action) => {
            return {
                loadingStatus: false
            }
        }
        // 함수가 생략됐을때 기본 값으론 (state, action) => state 가 설정됩니다. 
    })
}, initialState);
