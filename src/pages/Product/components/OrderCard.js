import { Button, Col, Row } from 'antd';
import React, { useState } from 'react'
import styled from 'styled-components';
import orderService from '../../../services/orderService';
import { formatDate } from '../../../common/format';

const StyledWrapper = styled.div`
    box-shadow: 0 0 6px 0 rgba(0,0,0,.15);
    border-radius: 8px;
    padding: 10px;

    ${props => props.selected && `
        box-shadow: 0 0 6px 0 rgba(0,0,200,.75);
    `}
`

const OrderCard = ({ order, selected, ...props }) => {

    const type = props.type || 'display';

    const orderId = order ? order.orderId : null;
    const customer = order ? order.customer : null;
    const price = order ? order.price : null;
    const reviewValue = order ? order.reviewValue : null;
    const note = order ? order.note : null;
    const purchasedAt = order ? order.purchasedAt : null;

    const [loading, setLoading] = useState(false);

    const handlePurchase = async () => {
        setLoading(true);
        try {
            const res = await orderService.purchase(order);
            console.log(res);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    const handleClick = () => {
        if (type === 'write-review' || type === 'give-helpful') {
            props.onClick && props.onClick();
        }
    }

    return (
        <StyledWrapper
            onClick={handleClick}
            style={{ cursor: ['write-review', 'give-helpful'].includes(type)  ? 'pointer' : 'none' }}
            selected={selected}
        >
            <Row gutter={[10, 10]}>
                <Col span={6}><b>Order ID</b></Col>
                <Col span={18}>{orderId}</Col>
                {
                    type === 'display' && (
                        <>
                            <Col span={6}><b>Customer</b></Col>
                            <Col span={18}>{customer}</Col>
                        </>
                    )
                }
                <Col span={6}><b>Price</b></Col>
                <Col span={18}>{price} |NEAR|</Col>
                <Col span={6}><b>Review Value</b></Col>
                <Col span={18}>{reviewValue} |NEAR|</Col>
                {
                    ['write-review', 'give-helpful'].includes(type) && (
                        <>
                            <Col span={6}><b>Purchased at</b></Col>
                            <Col span={18}>{formatDate(purchasedAt)}</Col>
                        </>
                    )
                }
                <Col span={6}><b>Note</b></Col>
                <Col span={18}>{note}</Col>
            </Row>
            {
                type === 'purchase' && (
                    <div>
                        <Button loading={loading} type='primary' onClick={handlePurchase}>Purchase</Button>
                    </div>
                )
            }
        </StyledWrapper>
    )
}

export default OrderCard
