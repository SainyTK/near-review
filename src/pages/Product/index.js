import { Button, Col, Rate, Row, Select, Typography, Space } from 'antd';
import React from 'react'
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ProductInfoCard from '../../components/ProductInfoCard';
import useProductOf from '../../states/useProductOf';
import CreateOrder from './components/CreateOrder';
import OpenIssue from './components/OpenIssue';
import WriteReview from './components/WriteReview';


const StyledWrapper = styled.div`
    padding: 20px;

    .info-container {
        margin-bottom: 16px;
    }

    .panel, .rating-container {
        margin-bottom: 10px;
    }

    .write-review {
        margin-bottom: 16px;
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

const ProductPage = () => {

    const params = useParams();

    const { search } = params;
    const [accountId, productId] = search ? search.split('-') : [];

    const { product } = useProductOf(accountId, productId);

    console.log(accountId, productId)

    console.log(product);

    return (
        <StyledWrapper>
            <div className='info-container'>
                <ProductInfoCard {...product} />
            </div>
            <div className='panel'>
                <Space>
                    <Select placeholder='Sort By' options={sortOptions} />
                    <Select placeholder='Filter' options={filterOptions} />
                </Space>
            </div>
            <Row gutter={[10, 10]}>
                <Col sm={{ span: 24, order: 1 }} lg={{ span: 16, order: 0 }}>

                </Col>
                <Col sm={{ span: 24, order: 0 }} lg={{ span: 8, order: 1 }}>
                    <Row gutter={[10, 10]}>
                        <Col span={24}>
                            <WriteReview />
                        </Col>
                        <Col span={24}>
                            <OpenIssue />
                        </Col>
                        <Col span={24}>
                            <CreateOrder />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </StyledWrapper>
    )
}

export default ProductPage
