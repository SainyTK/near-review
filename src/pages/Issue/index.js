import React from 'react'
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom'
import useReview from '../../states/useReview';
import ReviewCard from '../../components/ReviewCard';
import { Typography } from 'antd';
import useProfile from '../../states/useProfile';
import useProductOf from '../../states/useProductOf';
import Comment from '../../components/Comment'
import CommentForm from '../../components/CommentForm';

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

const IssuePage = () => {

    const params = useParams();
    const { orderId } = params;

    const { review } = useReview(orderId);
    const customer = review ? review.customer : '';
    const seller = review ? review.seller : '';
    const productId = review ? review.productId : 0;
    const comments = review ? review.comments || [] : [];

    const { profile } = useProfile(customer);
    const firstname = profile ? profile.firstname : null;
    const lastname = profile ? profile.lastname : null;
    const displayName = (firstname && lastname) ? `${firstname} ${lastname}` : customer;

    const { product } = useProductOf(seller, productId);
    const productName = product ? product.name : '';

    return (
        <StyledWrapper>
            <Typography.Title level={3}>
                <span>Issues on <Link to={`/products/${seller}/${productId}`}>{productName}</Link></span>
                <spa> by <Link to={`/profile/${customer}`}>{displayName}</Link></spa>
            </Typography.Title>
            
        </StyledWrapper>
    )
}

export default IssuePage
