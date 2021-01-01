import { Button } from 'antd';
import React, { useState } from 'react'
import styled from 'styled-components';
import orderService from '../../../services/orderService';

const StyledWrapper = styled.div`
    box-shadow: 0 0 6px 0 rgba(0,0,0,.15);
    border-radius: 8px;
    padding: 10px;
`

const OrderCard = ({ order, ...props }) => {

    const type = props.type || 'seller';

    const orderId = order ? order.orderId : null;
    const customer = order ? order.customer : null;
    const price = order ? order.price : null;
    const reviewValue = order ? order.reviewValue : null;
    const note = order ? order.note : null;

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

    return (
        <StyledWrapper>
            <table>
                <tbody>
                    <tr>
                        <td><b>Order ID</b></td>
                        <td>{orderId}</td>
                    </tr>
                    {
                        type === 'seller' && (
                            <tr>
                                <td><b>Customer</b></td>
                                <td>{customer}</td>
                            </tr>
                        )
                    }
                    <tr>
                        <td><b>Price</b></td>
                        <td>{price} |NEAR|</td>
                    </tr>
                    <tr>
                        <td><b>Review Value</b></td>
                        <td>{reviewValue} |NEAR|</td>
                    </tr>
                </tbody>
            </table>
            <div><b>Note</b></div>
            <p>{note}</p>
            {
                type === 'customer' && (
                    <div>
                        <Button loading={loading} type='primary' onClick={handlePurchase}>Purchase</Button>
                    </div>
                )
            }
        </StyledWrapper>
    )
}

export default OrderCard
