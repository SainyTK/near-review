import React, { useState } from 'react'
import useOrders from '../../../states/useOrders'
import OrderCard from './OrderCard';
import { useParams } from 'react-router-dom';
import useProductsOf from '../../../states/useProductsOf';
import { Row, Col, notification, Modal, Typography, DatePicker, Select, Input, Space } from 'antd';
import reviewService from '../../../services/reviewService'
import useProductReviews from '../../../states/useProductReviews'
import styled from 'styled-components'
import moment from 'moment'
import issueService from '../../../services/issueService';
import ipfs from '../../../ipfs';

const StyledWrapper = styled.div`
    .form-item {
        margin-bottom: 8px;
    }

    .select {
        min-width: 200px;
    }

    .max-vote {
        min-width: 100px;
    }
`

const ModalOpenIssue = ({ visibility, selectedReview }) => {

    const { seller, productId } = useParams();

    const { products } = useProductsOf(window.accountId);
    const isCustomer = products && products.length === 0;

    const { orders, onlyBetween, onlyPurchased, onlyRewardable } = useOrders();
    const { reviews, ...reviewsState } = useProductReviews(seller, productId);

    const customerOrders = isCustomer ? onlyBetween(window.accountId, seller, orders) : [];
    const purchasedOrder = onlyPurchased(customerOrders);
    const rewardableOrders = onlyRewardable(orders);

    const [selectedOrder, setSelectedOrder] = useState(0);
    const [voteTimeout, setVoteTimeout] = useState(moment().set('minute', moment().minute() + 20))
    const [maxVote, setMaxVote] = useState(1);
    const [amount, setAmount] = useState(0);
    const [additionalReward, setAdditioanlReward] = useState(-1);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleOpenIssue = async () => {
        setLoading(true);
        try {
            const order = purchasedOrder[selectedOrder];
            const target = reviews[selectedReview];

            const res = await ipfs.uploadObject({ message });

            await issueService.openIssue(order.orderId, target.orderId, voteTimeout.valueOf(), maxVote, res[0].hash, additionalReward, amount)

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
            onOk={handleOpenIssue}
            okButtonProps={{ disabled: selectedOrder < 0 }}
            confirmLoading={loading}
            title="Open an issue"
        >
            <StyledWrapper>
                <div className='form-item'>
                    <p><b>Order</b></p>
                    <Select
                        className='select'
                        options={purchasedOrder ? purchasedOrder.map((order, index) => ({ label: `id: ${order.orderId}`, value: index })) : []}
                        onChange={val => setSelectedOrder(val)}
                        value={selectedOrder}
                    />
                </div>
                <div className='form-item'>
                    <p><b>Issue Timeout</b></p>
                    <DatePicker
                        showTime
                        value={voteTimeout}
                        onChange={v => setVoteTimeout(v)}
                        format='DD MMM YYYY, hh:mm:ss'
                    />
                </div>
                <div className='form-item'>
                    <p><b>Max Vote</b></p>
                    <Space>
                        <Input
                            className='max-vote'
                            value={maxVote}
                            onChange={e => setMaxVote(e.target.value)}
                        />
                        <div>Ⓝ</div>
                    </Space>
                </div>
                <div className='form-item'>
                    <p><b>Additional reward from an unused order (optional)</b></p>
                    <Select
                        className='select'
                        options={rewardableOrders ? [{ label: 'None', value: -1 }, ...rewardableOrders.map((order, index) => ({ label: `id: ${order.orderId}`, value: index }))] : []}
                        onChange={val => setAdditioanlReward(val)}
                        value={additionalReward}
                    />
                </div>
                <div className='form-item'>
                    <p><b>Message</b></p>
                    <Input.TextArea
                        rows={3}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    />
                </div>
                <div className='form-item'>
                    <p><b>Vote Amount</b></p>
                    <Space>
                        <Input
                            className='vote-amount'
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />
                        <div>Ⓝ</div>
                    </Space>
                </div>
            </StyledWrapper>
        </Modal>
    )
}

export default ModalOpenIssue
