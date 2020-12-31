import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SelectImage from './SelectImage';
import ipfs from '../ipfs';
import { Button, Input, Row, Col, Space, Divider, Select, Tooltip, Switch } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const StyledWrapper = styled.div`
    padding: 20px;
    background-color: white;
    box-shadow: 0 0 3px 0 rgba(0,0,0,.15);

    .input {
        width: 100%;
        max-width: 300px;
    }

    .select-image {
        margin-right: 16px;
    }

    .bottom-action {
        display: flex;
        justify-content: flex-end;
    }
`;

const categories = ['hotel', 'restaurant', 'attraction'];

const ProductForm = ({ type, ...props }) => {

    const title = type === 'create' ? 'Create Product' : 'Update Product';

    const [product, setProduct] = useState({
        name: props.name || '',
        category: props.category || '',
        location: props.location || '',
        imageUrl: props.imageUrl || '',
        price: props.price || 0,
        reviewValue: props.reviewValue || 0,
        allowSelfPurchase: (props.allowSelfPurchase !== undefined && props.allowSelfPurchase !== null) ? props.allowSelfPurchase : false,
        isActive: (props.isActive !== undefined && props.isActive !== null) ? props.isActive : true
    });

    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        product.name = props.name || product.name;
        product.category = props.category || product.category;
        product.location = props.location || product.location;
        product.imageUrl = props.imageUrl || product.imageUrl;
        product.price = props.price || product.price;
        product.reviewValue = props.reviewValue || product.reviewValue;
        product.allowSelfPurchase = (props.allowSelfPurchase !== undefined && props.allowSelfPurchase !== null) ? props.allowSelfPurchase : product.allowSelfPurchase;
        product.isActive = (props.isActive !== undefined && props.isActive !== null) ? props.isActive : product.isActive;
        setProduct({ ...product });
    }, [props.name, props.category, props.location, props.imageUrl, props.price, props.reviewValue, props.allowSelfPurchase, props.isActive]);

    const handleChangeImage = (file) => {
        if (file) {
            setProduct({ ...product, imageUrl: URL.createObjectURL(file) });
            setImageFile(file);
        }
    }

    const handleConfirm = async () => {
        if (props.onConfirm) {
            setLoading(true);
            if (imageFile) {
                const res = await ipfs.uploadImage(imageFile);
                product.imageUrl = ipfs.hashToUrl(res);
            }
            try {
                await props.onConfirm(product)
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        }
    }

    const handleCancel = () => {
        if (props.onCancel)
            props.onCancel();
    }

    const hasChanged = () => {
        const stateArr = Object.entries(product);
        for (let i = 0; i < stateArr.length; i++) {
            const [key, value] = stateArr[i];
            if (props[key] !== value)
                return true;
        }
        return false;
    }

    const filledAll = () => {
        const { name, category, location, imageUrl } = product;
        if (!name || name === '') return false;
        if (!category || category === '') return false;
        if (!location || location === '') return false;
        if (!imageUrl || imageUrl === '') return false;
        return true;
    }

    return (
        <StyledWrapper>
            <h2>{title}</h2>
            <Divider />

            <Row className='row'>
                <Col span={8}>
                    <b>Image</b>
                </Col>
                <Col span={16}>
                    <Space align='center'>
                        <SelectImage className='select-image' value={product.imageUrl} onChange={handleChangeImage} />
                        <label htmlFor='choose-file'>
                            <div className='btn-div'>Choose file</div>
                        </label>
                        <input id='choose-file' type='file' hidden accept='image/*' onChange={e => handleChangeImage(e.target.files[0])} />
                    </Space>
                </Col>
            </Row>
            <Divider />

            <Row>
                <Col span={8}>
                    <b>General Info</b>
                </Col>
                <Col span={16}>
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ marginBottom: 8 }}><b>Name</b></div>
                        <Input value={product.name} className='input' onChange={e => setProduct({ ...product, name: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ marginBottom: 8 }}><b>Category</b></div>
                        <Select
                            className='input'
                            value={product.category}
                            onChange={value => setProduct({ ...product, category: value })}
                            options={categories.map((c) => ({ label: c, value: c }))}
                        />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ marginBottom: 8 }}><b>Location</b></div>
                        <Input.TextArea value={product.location} rows={5} className='input' onChange={e => setProduct({ ...product, location: e.target.value })} />
                    </div>
                </Col>
            </Row>
            <Divider />

            <Row>
                <Col span={8}>
                    <b>Contract Info</b>
                </Col>
                <Col span={16}>
                    <div style={{ marginBottom: 16 }}>
                        <div>
                            <Space style={{ marginBottom: 8 }} align='baseline'>
                                <b>Price</b>
                                <Tooltip title='The base price per unit (set to zero if the product do not have the unit price)'>
                                    <QuestionCircleOutlined />
                                </Tooltip>
                            </Space>
                        </div>
                        <Space>
                            <Input
                                value={product.price}
                                className='input'
                                type='number'
                                onChange={e => setProduct({ ...product, price: +e.target.value })}
                            />
                            <span>NEAR</span>
                        </Space>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <div>
                            <Space style={{ marginBottom: 8 }} align='baseline'>
                                <b>Review Value</b>
                                <Tooltip title='Amount of money you are willing to pay for user community'>
                                    <QuestionCircleOutlined />
                                </Tooltip>
                            </Space>
                        </div>
                        <Space>
                            <Input
                                value={product.reviewValue}
                                className='input'
                                type='number'
                                onChange={e => setProduct({ ...product, reviewValue: +e.target.value })}
                            />
                            <span>NEAR</span>
                        </Space>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <div>
                            <Space style={{ marginBottom: 8 }} align='baseline'>
                                <b>Allow Self Purchase</b>
                                <Tooltip title='Allow a customer to purchase a product directly (without waiting an order creation from you)'>
                                    <QuestionCircleOutlined />
                                </Tooltip>
                            </Space>
                        </div>
                        <Space>
                            <Switch
                                checked={product.allowSelfPurchase}
                                onChange={value => setProduct({ ...product, allowSelfPurchase: value })}
                            />
                        </Space>
                    </div>
                </Col>
            </Row>
            <Divider />


            {
                type === 'update' && (
                    <div>
                        <Row>
                            <Col span={8}>
                                <b>Activated</b>
                            </Col>
                            <Col span={16}>
                                <Switch
                                    checked={product.isActive}
                                    onChange={value => setProduct({ ...product, isActive: value })}
                                />
                            </Col>
                        </Row>


                        <Divider />
                    </div>
                )
            }

            <div className='bottom-action'>
                <Space>
                    <Button type='dashed' onClick={handleCancel}>Cancel</Button>
                    <Button type='primary' onClick={handleConfirm} loading={loading} disabled={!hasChanged() || !filledAll()}>
                        {type === 'create' ? 'Create' : 'Update'}
                    </Button>
                </Space>
            </div>

        </StyledWrapper>
    )
}

export default ProductForm;
