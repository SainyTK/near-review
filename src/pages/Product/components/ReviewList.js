import Modal from 'antd/lib/modal/Modal'
import React, { useState } from 'react'
import styled from 'styled-components'
import ReviewCard from '../../../components/ReviewCard'
import useVisibility from '../../../hooks/useVisibility'
import useOrders from '../../../states/useOrders'
import OrderCard from './OrderCard';
import { useParams } from 'react-router-dom';
import useProductsOf from '../../../states/useProductsOf';
import { Row, Col, notification } from 'antd';
import reviewService from '../../../services/reviewService'
import useReviews from '../../../states/useReviews'
import useProductReviews from '../../../states/useProductReviews'

const StyledWrapper = styled.div`
    .review-item {
        margin-bottom: 10px;
    }
`

const ReviewList = (props) => {

    const { seller, productId } = useParams();
    const { products } = useProductsOf(window.accountId);
    const isCustomer = products && products.length === 0;

    const { orders, onlyBetween, onlyLikable, onlySeller } = useOrders();
    const { reviews, ...reviewsState} = useProductReviews(seller, productId);
    // const reviews = onlySeller(seller, reviewsState.reviews);

    console.log('reviews', reviews);

    const modal = useVisibility();
    const [loading, setLoading] = useState(false);

    const [selectedReview, setSelectedReview] = useState(-1);
    const [selectedOrder, setSelectedOrder] = useState(-1);

    const customerOrders = isCustomer ? onlyBetween(window.accountId, seller, orders) : [];
    const notGaveHelpfulOrders = onlyLikable(customerOrders);

    const handleLike = (index) => {
        const { likes } = reviews[index];
        if (window.accountId && reviews[index].customer !== window.accountId && !likes.includes[window.accountId]) {
            modal.show();
            setSelectedReview(index);
        }
    }

    const handleGiveHelpful = async () => {
        setLoading(true);
        try {
            const order = notGaveHelpfulOrders[selectedOrder];
            const target = reviews[selectedReview];

            await reviewService.giveHelpful(order.orderId, target.orderId);

            notification['success']({
                message: 'Success',
                description: 'Give a helpful score success'
            })

            reviewsState.update();

            modal.hide();
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
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
                            onLike={() => handleLike(index)}
                            onDelete={() => reviewsState.update()}
                        />
                    </div>
                ))
            }
            <Modal
                visible={modal.visible}
                onCancel={modal.hide}
                onOk={handleGiveHelpful}
                okButtonProps={{ disabled: selectedOrder < 0 }}
                confirmLoading={loading}
                title="Give helpful score"
            >
                <Row gutter={[24, 24]}>
                    {
                        notGaveHelpfulOrders && notGaveHelpfulOrders.map((o, index) => (
                            <Col key={index} span={24}>
                                <OrderCard
                                    type='give-helpful'
                                    order={o}
                                    selected={index === selectedOrder}
                                    onClick={() => setSelectedOrder(index)}
                                />
                            </Col>
                        ))
                    }
                </Row>
            </Modal>
        </StyledWrapper>
    )
}

export default ReviewList
