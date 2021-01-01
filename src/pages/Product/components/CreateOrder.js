import React, { useState } from 'react'
import styled from 'styled-components'
import svgOrder from '../../../assets/images/order.svg';
import { Button, Rate, Modal, Row, Col, Typography, Input, Space, notification } from 'antd';
import useVisibility from '../../../hooks/useVisibility';
import orderService from '../../../services/orderService';
import ipfs from '../../../ipfs';
import { utils } from 'near-api-js';

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

const CreateOrder = (props) => {

    const modal = useVisibility();

    const [customerId, setCustomerId] = useState('');
    const [price, setPrice] = useState(0);
    const [note, setNote] = useState('');

    const [loading, setLoading] = useState(false);

    const handleCreateOrder = async () => {
        setLoading(true);
        try {
            if (props.product) {
                let ipfsHash = '';
                if (note.length > 0) {
                    const res = await ipfs.uploadObject({ note });
                    ipfsHash = res[0].hash;
                }
                const result = await orderService.createOrder(Number(props.product.productId), customerId, utils.format.parseNearAmount(price), ipfsHash);
                console.log('order id: ', result);
                modal.hide();
                notification['success']({
                    message: 'Success',
                    description: `Create order id: ${result} successfully`
                });
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    return (
        <StyledWrapper className={props.className} style={props.style}>
            <div className='card-text'>
                <h4>Create an order</h4>
                <p>Define a product price and create an order for your customer</p>
                <Button type='primary' onClick={modal.show}>Create</Button>
            </div>
            <div className='svg-img'>
                <img src={svgOrder} />
            </div>
            <Modal
                visible={modal.visible}
                onCancel={modal.hide}
                onOk={handleCreateOrder}
                confirmLoading={loading}
                title="Create an order"
            >
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <Typography.Text>Customer Account</Typography.Text>
                    </Col>
                    <Col span={24}>
                        <Input type='text' value={customerId} onChange={e => setCustomerId(e.target.value)} />
                    </Col>
                    <Col span={24}>
                        <Typography.Text>Price</Typography.Text>
                    </Col>
                    <Col span={24}>
                        <Space>
                            <Input type='number' value={price} onChange={e => setPrice(e.target.value)} />
                            <Typography.Text>Ⓝ</Typography.Text>
                        </Space>
                    </Col>
                    <Col span={24}>
                        <Typography.Text>Notes</Typography.Text>
                    </Col>
                    <Col span={24}>
                        <Input.TextArea rows={5} value={note} onChange={e => setNote(e.target.value)} />
                    </Col>
                </Row>
            </Modal>
        </StyledWrapper>
    )
}

export default CreateOrder
