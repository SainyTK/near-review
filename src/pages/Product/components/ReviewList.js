import React, { useState } from 'react'
import styled from 'styled-components'
import ReviewCard from '../../../components/ReviewCard'
import useVisibility from '../../../hooks/useVisibility'
import useOrders from '../../../states/useOrders'
import { useParams } from 'react-router-dom';
import useProductsOf from '../../../states/useProductsOf';
import useProductReviews from '../../../states/useProductReviews'
import ModalGiveHelpful from './ModalGiveHelpful'
import ModalOpenIssue from './ModalOpenIssue'

const StyledWrapper = styled.div`
    .review-item {
        margin-bottom: 10px;
    }
`

const ReviewList = () => {

    const { seller, productId } = useParams();

    const { reviews, ...reviewsState } = useProductReviews(seller, productId);

    const giveHelpfulModal = useVisibility();
    const openIssueModal = useVisibility();

    const [selectedReview, setSelectedReview] = useState(-1);

    const openHelpfulGivingModal = (index) => {
        const { likes } = reviews[index];
        if (window.accountId && reviews[index].customer !== window.accountId && !likes.includes[window.accountId]) {
            giveHelpfulModal.show();
            setSelectedReview(index);
        }
    }

    const showIssueModal = (index) => {
        setSelectedReview(index);
        if (window.accountId)
            openIssueModal.show();
    }

    if (reviewsState.isLoading)
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
                        <ReviewCard
                            review={review}
                            onLike={() => openHelpfulGivingModal(index)}
                            onDelete={() => reviewsState.update()}
                            onOpenIssue={() => showIssueModal(index)}
                        />
                    </div>
                ))
            }
            <ModalGiveHelpful visibility={giveHelpfulModal} selectedReview={selectedReview} />
            <ModalOpenIssue visibility={openIssueModal} selectedReview={selectedReview} />
        </StyledWrapper>
    )
}

export default ReviewList
