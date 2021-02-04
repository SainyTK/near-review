import React from 'react'
import styled from 'styled-components';
import { useParams, useHistory, Link } from 'react-router-dom'
import useReview from '../../states/useReview';
import ReviewCard from '../../components/ReviewCard';
import { Typography } from 'antd';
import useProfile from '../../states/useProfile';
import useProductOf from '../../states/useProductOf';

const StyledWrapper = styled.div`
    padding: 20px 10%;

    .review-item {
        margin-bottom: 12px;
    }

    .div {
        text-align: center;
        width: 100%;
    }

`

const ReviewPage = () => {

    const params = useParams();
    const history = useHistory();
    const { orderId } = params;

    const { review } = useReview(orderId);
    const customer = review ? review.customer : '';
    const seller = review ? review.seller : '';
    const productId = review ? review.productId : 0;
    const versions = review ? review.versions : [];

    const { profile } = useProfile(customer);
    const username = profile ? `${profile.firstname} ${profile.lastname}` : ''

    const { product } = useProductOf(seller, productId);
    const productName = product ? product.name : '';

    return (
        <StyledWrapper>
            <Typography.Title level={3}>
                <span>Review of <Link to={`/profile/${customer}`}>{username}</Link> </span>
                <span> on <Link to={`/products/${seller}/${productId}`}>{productName}</Link></span>
            </Typography.Title>
            {
                versions.map((v, i) => (
                    <div key={i} className='review-item'>
                        <ReviewCard review={review} version={i} />
                        {i < versions.length - 1 && <Typography.Title type='secondary' className='div' level={2}> . . .</Typography.Title>}
                    </div>
                ))
            }
        </StyledWrapper>
    )
}

export default ReviewPage
