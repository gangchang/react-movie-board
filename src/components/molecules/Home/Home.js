import React from 'react';
import { Header, Card, Image, Feed, Grid, Menu, Dimmer, Loader } from 'semantic-ui-react';
import { Carousel } from 'react-responsive-carousel';

import * as utils from '../../../lib/utils';
import './Home.css';

const PrintRankList = ({ boxOfficeList, handleOpen }) => {
    const top20BoxOfficeList = boxOfficeList.slice(0,20);
    const movieList = top20BoxOfficeList.map((movie, i) => {
        const { code, title } = movie.items[0].item;

        return (
          <Feed.Event as='a' key={i} onClick={() => handleOpen(title, code)}>
            <Feed.Label content={i+1} />
            <Feed.Content>
              <Feed.Summary title={title}>
                {title}
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        );
    });

    return (
        <div>
          <Card>
            <Card.Content>
              <h4>
                영화 순위
              </h4>
            </Card.Content>
            <Card.Content>
              <Feed className='boxoffice-feed'>
                  {movieList}
              </Feed>
            </Card.Content>
          </Card>
        </div>
    );
}

const MovieCard = ({ movieList, handleOpen }) => {
    const movieInfo = movieList.map((movie, i) => {
        const { code, title, poster, watcha_rating } = movie.items[0].item;
        const rating = utils.getRating(watcha_rating);

        return(
          <Card link={true} key={i} onClick={ () => handleOpen(title, code) }>
            <Image src={`${poster.xlarge}`} wrapped size='large' label={{ color: 'black', content: `${rating}`, icon: 'thumbs outline up', ribbon: true }}/>
          </Card>
        );
    });

    return(
        <div>
          <Card.Group itemsPerRow={5} className='home-card'>
              {movieInfo}
          </Card.Group>
        </div>
    );
};

const PrintMoiveList = ({ movieList, handleOpen }) => {
    const movieList_1 = movieList.slice(0,10);
    const movieList_2 = movieList.slice(10,20);

    return (
        <Carousel className='home-carousel' emulateTouch showThumbs={false} showStatus={false} showIndicators={false}>
            <MovieCard
                movieList={movieList_1}
                handleOpen={handleOpen}
            />
            <MovieCard
                movieList={movieList_2}
                handleOpen={handleOpen}
            />
        </Carousel>
    );
};

const PrintCategoryMovieMenu = ({ menu, getCateMovieList, handleOpen, showAllCategory }) => {
    return(
      <Menu pointing vertical className='category-menu'>
        <Menu.Item name='국내 누적관객수 TOP 영화'    active={menu === 'popularKoreaMoive'}     onClick={() => getCateMovieList('popularKoreaMoive')}/>
        <Menu.Item name='전세계 흥행 TOP 영화'        active={menu === 'popularWordMoive'}      onClick={() => getCateMovieList('popularWordMoive')}/>
        <Menu.Item name='역대 100만 관객돌파 영화'    active={menu === 'millionMoive'}          onClick={() => getCateMovieList('millionMoive')}/>
        <Menu.Item name='평균평점 높은 영화'          active={menu === 'highRatingMovie'}       onClick={() => getCateMovieList('highRatingMovie')}/>
        <Menu.Item name='전문가 고평점 영화'          active={menu === 'expertRecommendMovie'}  onClick={() => getCateMovieList('expertRecommendMovie')}/>
        <Menu.Item name='느와르 영화'                active={menu === 'noirMoive'}             onClick={() => getCateMovieList('noirMoive')}/>
        <Menu.Item name='스포츠 영화'                active={menu === 'sportsMoive'}           onClick={() => getCateMovieList('sportsMoive')}/>
        <Menu.Item name='애니메이션 영화'            active={menu === 'animationMoive'}        onClick={() => getCateMovieList('animationMoive')}/>
        <Menu.Item name='슈퍼 히어로 영화'           active={menu === 'superHeroMovie'}        onClick={() => getCateMovieList('superHeroMovie')}/>
        <Menu.Item name='코미디 영화'               active={menu === 'comedyMoive'}            onClick={() => getCateMovieList('comedyMoive')}/>
        <Menu.Item name='스릴러 영화'               active={menu === 'thrillerMovie'}          onClick={() => getCateMovieList('thrillerMovie')}/>
        <Menu.Item name='범죄 영화'                active={menu === 'criminalMoive'}           onClick={() => getCateMovieList('criminalMoive')}/>
        <Menu.Item className='all-category' name='카테고리 모두보기'          onClick={() => showAllCategory()}/>
      </Menu>
    );
}

const Home = ({ boxOfficeList, cateMovieList, menu, getCateMovieList, handleOpen, loadingStatus, showAllCategory }) => {
  return(
      <div>
        <Dimmer
          active={loadingStatus}
          content={<Loader indeterminate size="massive">Loading MovieInfo</Loader>}
          page={true}
        />
        <Grid>
          <Grid.Row columns={2} verticalAlign='middle'>
            <Grid.Column width={3}>
              <Header>오늘의 박스 오피스</Header>
              <PrintRankList
                  boxOfficeList={boxOfficeList}
                  handleOpen={handleOpen}
              />
            </Grid.Column>

            <Grid.Column width={12}>
              <PrintMoiveList
                  movieList={boxOfficeList}
                  handleOpen={handleOpen}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={2}>
            <Grid.Column width={3}>
              <Header className='category-header'>카테고리 영화 찾기</Header>
              <PrintCategoryMovieMenu
                  menu={menu}
                  getCateMovieList={getCateMovieList}
                  showAllCategory={showAllCategory}
              />
            </Grid.Column>

            <Grid.Column width={12}>
                <PrintMoiveList
                    movieList={cateMovieList}
                    handleOpen={handleOpen}
                />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
  );

}

export default Home;
