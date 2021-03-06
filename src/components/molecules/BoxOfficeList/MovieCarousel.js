import React from 'react';
import { Carousel } from 'react-responsive-carousel';

import styled from 'styled-components';

const CarouselDiv = styled.div`
    cursor: pointer;
`;

const getCarouselList = (list, handleOpen) => {
    return list.map((info, i) => {
        return (
            <CarouselDiv key={i} onClick={() => handleOpen(info.items[0].item.title, info.items[0].item.code)}>
              <img src={info.items[0].item.poster.original} alt=''/>
            </CarouselDiv>
        );
    });
}

const BoxOfficeCarousel = ({boxOfficeList, handleOpen}) => {
    return(
      <Carousel className="boxOffice-carousel" centerMode centerSlidePercentage={33} selectedItem={1} showStatus={false} showThumbs={false} showIndicators={false} autoPlay interval={3000} infiniteLoop>
          {getCarouselList(boxOfficeList, handleOpen)}
      </Carousel>
    );
}

export default BoxOfficeCarousel;
