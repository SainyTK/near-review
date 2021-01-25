import React from 'react'
import styled from 'styled-components'
import ReviewCard from '../../../components/ReviewCard'

const StyledWrapper = styled.div`
    .review-item {
        margin-bottom: 10px;
    }
`

const ReviewList = (props) => {

    const { reviews, isLoading } = props;

    if (!reviews || isLoading)
        return (
            <StyledWrapper>
                Loading...
            </StyledWrapper>
        )

    if (reviews.length === 0)
        return (
            <StyledWrapper>
                No reviews
            </StyledWrapper>
        )

    return (
        <StyledWrapper>
            {
                reviews.map((review, index) => (
                    <div key={index} className='review-item'>
                        <ReviewCard review={review} />
                    </div>
                ))
            }
        </StyledWrapper>
    )
}

export default ReviewList
