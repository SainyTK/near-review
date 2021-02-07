import React, { useState } from 'react'
import useOrders from '../../../states/useOrders'
import OrderCard from './OrderCard';
import { useParams } from 'react-router-dom';
import useProductsOf from '../../../states/useProductsOf';
import { Row, Col, notification, Modal } from 'antd';
import reviewService from '../../../services/reviewService'
import useProductReviews from '../../../states/useProductReviews'

const ModalGiveHelpful = ({ visibility, selectedReview }) => {

    const { seller, productId } = useParams();

    const { products } = useProductsOf(window.accountId);
    const isCustomer = products && products.length === 0;

    const { orders, onlyBetween, onlyLikable } = useOrders();
    const { reviews, ...reviewsState } = useProductReviews(seller, productId);

    const customerOrders = isCustomer ? onlyBetween(window.accountId, seller, orders) : [];
    const notGaveHelpfulOrders = onlyLikable(customerOrders);

    const [selectedOrder, setSelectedOrder] = useState(-1);
    const [loading, setLoading] = useState(false);

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

            visibility.hide();
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    return (
        <Modal
            visible={visibility.visible}
            onCancel={visibility.hide}
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
    )
}

export default ModalGiveHelpful
