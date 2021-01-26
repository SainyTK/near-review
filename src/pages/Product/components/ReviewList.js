import Modal from 'antd/lib/modal/Modal'
import React, { useState } from 'react'
import styled from 'styled-components'
import ReviewCard from '../../../components/ReviewCard'
import useVisibility from '../../../hooks/useVisibility'
import useOrders from '../../../states/useOrders'
import OrderCard from './OrderCard';
import { useParams } from 'react-router-dom';
import useProductsOf from '../../../states/useProductsOf';
import { Row, Col } from 'antd';
import reviewService from '../../../services/reviewService'

const StyledWrapper = styled.div`
    .review-item {
        margin-bottom: 10px;
    }
`

const ReviewList = (props) => {

    const { reviews, isLoading } = props;

    const params = useParams();
    const { search } = params;
    const [seller, productId] = search ? search.split('-') : [];
    const { products } = useProductsOf(window.accountId);
    const isCustomer = products && products.length === 0;

    const { orders, onlyBetween, onlyLikable } = useOrders();
    const modal = useVisibility();
    const [loading, setLoading] = useState(false);

    const [selectedReview, setSelectedReview] = useState(-1);
    const [selectedOrder, setSelectedOrder] = useState(-1);

    const customerOrders = isCustomer ? onlyBetween(window.accountId, seller, orders) : [];
    const notGaveHelpfulOrders = onlyLikable(customerOrders);

    const handleLike = (index) => {
        if (reviews[index].customer !== window.accountId) {
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
            
            modal.hide();
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

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
                        <ReviewCard
                            review={review}
                            onLike={() => handleLike(index)}
                        />
                    </div>
                ))
            }
            <Modal
                visible={modal.visible}
                onCancel={modal.hide}
                onOk={handleGiveHelpful}
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
