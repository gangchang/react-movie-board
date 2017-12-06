import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import $ from 'jquery';

import * as boxOfficeMovieActions from '../modules/boxOffice';
import * as modalMovieActions from '../modules/modalMovie';
import * as categoryMovieActions from '../modules/categoryMovie';
import * as viewSelectorActions from '../modules/viewSelector';

import Home from '../components/molecules/Home/Home';

class HomeContainer extends Component {
    // Open Modal
    handleOpen = async (title, code) => {
        const { modalMovieActions } = this.props;

        await modalMovieActions.searchMovieTmp(title)
        .then(function(res) {
            modalMovieActions.getSimilarMovieList(code);
        });
    }

    getCateMovieList = (category) => {
        if(category === undefined || category === '') {
           category = 'popularKoreaMoive';
        }
        const { categoryMovieActions } = this.props;
        categoryMovieActions.getCategoryMovie(category);
    }

    getBoxOfficeList = () => {
        const { boxOfficeMovieActions } = this.props;
        boxOfficeMovieActions.getBoxOffice();
    }

    showAllCategory = () => {
        const { viewSelectorActions } = this.props;
        viewSelectorActions.setView('category');
        $(window).scrollTop(0);
    }

    componentDidMount() {
        this.getBoxOfficeList();
        this.getCateMovieList();
    }

    render() {
        const { boxOfficeList, menu, cateMovieList, modal } = this.props;
        const { loadingStatus } = modal.toJS();
        const { getCateMovieList, handleOpen, showAllCategory } = this;

        return(
            <Home
                boxOfficeList={boxOfficeList}
                menu={menu}
                cateMovieList={cateMovieList}
                getCateMovieList={getCateMovieList}
                handleOpen={handleOpen}
                loadingStatus={loadingStatus}
                showAllCategory={showAllCategory}
            />
        );
    }
}

export default connect(
    (state) => ({
        boxOfficeList: state.boxOffice.boxOfficeListHome,
        cateMovieList: state.categoryMovie.cateMovies,
        menu: state.categoryMovie.menu,
        modal: state.modalMovie
    }),
    (dispatch) => ({
        categoryMovieActions: bindActionCreators(categoryMovieActions, dispatch),
        modalMovieActions: bindActionCreators(modalMovieActions, dispatch),
        boxOfficeMovieActions: bindActionCreators(boxOfficeMovieActions, dispatch),
        viewSelectorActions: bindActionCreators(viewSelectorActions, dispatch)
    })
)(HomeContainer);