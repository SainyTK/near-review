import React, { useState } from 'react'
import styled from 'styled-components'
import svgOrder from '../../../assets/images/order.svg';
import { Button, Rate, Modal, Row, Col, Typography, Input, Space, notification } from 'antd';
import useVisibility from '../../../hooks/useVisibility';
import orderService from '../../../services/orderService';
import ipfs from '../../../ipfs';
import { utils } from 'near-api-js';
import OrderCard from './OrderCard';

const StyledWrapper = styled.div`
    box-shadow: 0 0 6px 0 rgba(0,0,0,.15);
    padding: 20px;
    background-color: white;
    border-radius: 2px;
    position: relative;

    display: flex;

    .card-text {
        margin-right: 8px;
        flex: 1;
    }

    .svg-img {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-right: 10px;
        z-index: 1;


        img {
            width: 120px;
        }
    }

`

const WaitingOrders = (props) => {

    const modal = useVisibility();

    const { orders } = props;
    const numOrders = orders ? orders.length : 0;

    return (
        <StyledWrapper className={props.className} style={props.style}>
            <div className='card-text'>
                <h4>Waiting orders</h4>
                <p>List of openned orders</p>
                <Button type='primary' onClick={modal.show}>Show List ({numOrders})</Button>
            </div>
            <div className='svg-img'>
                <img src={svgOrder} />
            </div>
            <Modal
                visible={modal.visible}
                onCancel={modal.hide}
                footer={null}
                title="Not purchased orders"
            >
                <Row gutter={[10, 10]}>
                    {
                        orders && orders.map((o, index) => (
                            <Col key={index} span={24}>
                                <OrderCard order={o} type='seller'/>
                            </Col>
                        ))
                    }
                </Row>
            </Modal>
        </StyledWrapper>
    )
}

export default WaitingOrders
