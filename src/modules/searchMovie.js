import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';

import axios from 'axios';

function searchMovieListByQuery(query, page) {
    return axios.get(`https://cors-anywhere.herokuapp.com/https://watcha.net/search/movie.json?query=${query}&per=12&page=${page}`);
}

const GET_MOVIE = 'GET_MOVIE';
const SET_QUERY = 'SET_QUERY';
const SET_PAGE = 'SET_PAGE'
/* redux-pender 의 액션 구조는 Flux standard action(https://github.com/acdlite/flux-standard-action)
   을 따르기 때문에, createAction 으로 액션을 생성 할 수 있습니다. 두번째로 들어가는 파라미터는 프로미스를 반환하는
   함수여야 합니다.
*/
export const searchMovie = createAction(GET_MOVIE, searchMovieListByQuery);
export const setQuery = createAction(SET_QUERY);
export const setPage = createAction(SET_PAGE);

const initialState = {
    // 요청이 진행중인지, 에러가 났는지의 여부는 더 이상 직접 관리 할 필요가 없어집니다. penderReducer 가 담당하기 때문이죠
    items: [],
    query: '',
    page: 1,
    loadingStatus: false,
    totalCnt: 0
}

export default handleActions({
    [SET_QUERY]: (state, action) => {
        return {
            query: action.payload,
            page: state.page,
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
        }
    },
    ...pender({
        type: GET_MOVIE, // type 이 주어지면, 이 type 에 접미사를 붙인 액션핸들러들이 담긴 객체를 생성합니다.
        /*
            요청중 / 실패 했을 때 추가적으로 해야 할 작업이 있다면 이렇게 onPending 과 onFailure 를 추가해주면됩니다.
            onPending: (state, action) => state,
            onFailure: (state, action) => state
        */
        onPending: (state, action) => {
            return {
                query: state.query,
                page: state.page,
                loadingStatus: true,
                totalCnt: state.totalCnt
            }
        },
        onSuccess: (state, action) => { // 성공했을때 해야 할 작업이 따로 없으면 이 함수 또한 생략해도 됩니다.
            return {
                items: action.payload.data.cards[0].items,
                page: state.page,
                query: state.query,
                loadingStatus: false,
                totalCnt: action.payload.data.total
            }
        },
        onFailure: (state, action) => {
            return {
                loadingStatus: false
            }
        }
        // 함수가 생략됐을때 기본 값으론 (state, action) => state 가 설정됩니다 (state 를 그대로 반환한다는 것이죠)
    })
}, initialState);
