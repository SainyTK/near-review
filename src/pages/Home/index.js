import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import Button from '../../components/Button';
import useAllProducts from '../../states/useAllProducts';
import ProductList from '../../components/ProductList';
import { Space, Typography, Select } from 'antd';

const StyledWrapper = styled.div`
    padding: 20px;

    .top {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 48px;
    }

    .summary {
        margin-bottom: 24px;
    }

    .panel {
        margin-bottom: 24px;
    }


`

const sortOptions = [
    { label: 'Name', value: 'name' },
    { label: 'Rating', value: 'rating' },
    { label: 'Date', value: 'date' },
];

const filterOptions = [
    { label: 'Disabled', value: 'disabled' },
]

const HomePage = () => {

    const productState = useAllProducts();

    const [productType, setProductType] = useState('Hotels')

    return (
        <StyledWrapper>
            <div className='top'>
                <h1>{productType}</h1>
                <Typography.Paragraph type='secondary'>
                    This is a list of {productType.toLocaleLowerCase()} appears on the smart contract
                </Typography.Paragraph>
                <div className='summary'>
                    <Space>
                        <Space align='baseline'>
                            <h4>{2342}</h4>
                            <Typography.Text type='secondary'>{productType}</Typography.Text>
                        </Space>
                        <Space align='baseline'>
                            <h4>{10532}</h4>
                            <Typography.Text type='secondary'>Reviews</Typography.Text>
                        </Space>
                    </Space>
                </div>
                <div className='selectors'>
                    <Space>
                        <Button theme={productType === 'Hotels' ? 'primary' : 'secondary'} onClick={() => setProductType('Hotels')}>Hotels</Button>
                        <Button theme={productType === 'Restaurants' ? 'primary' : 'secondary'} onClick={() => setProductType('Restaurants')}>Restaurants</Button>
                        <Button theme={productType === 'Travel Agencies' ? 'primary' : 'secondary'} onClick={() => setProductType('Travel Agencies')}>Travel Agencies</Button>
                        <Button theme={productType === 'Transportations' ? 'primary' : 'secondary'} onClick={() => setProductType('Transportations')}>Transportations</Button>
                    </Space>
                </div>
            </div>
            <div className='panel'>
                <Space>
                    <Select placeholder='Sort By' options={sortOptions} />
                    <Select placeholder='Filter' options={filterOptions} />
                </Space>
            </div>
            <ProductList
                {...productState}
                products={productState.allProducts}
            />
        </StyledWrapper>
    )

}

export default HomePage
