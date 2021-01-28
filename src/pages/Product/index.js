import { Button, Col, Rate, Row, Select, Typography, Space } from 'antd';
import React from 'react'
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ProductInfoCard from '../../components/ProductInfoCard';
import useProductOf from '../../states/useProductOf';
import CreateOrder from './components/CreateOrder';
import OpenIssue from './components/OpenIssue';
import WriteReview from './components/WriteReview';
import useProductsOf from '../../states/useProductsOf';
import useOrders from '../../states/useOrders';
import WaitingOrders from './components/WaitingOrders';
import OpeningOrders from './components/OpeningOrders';
import useReviews from '../../states/useReviews';
import ReviewList from './components/ReviewList';


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
    const { seller, productId } = params;

    const { product } = useProductOf(seller, productId);
    const { products } = useProductsOf(window.accountId);
    const { orders, onlyBetween, onlySeller, onlyNotPurchased, onlyReviewable } = useOrders();

    const isCustomer = products && products.length === 0;
    const isOwner = product && product.owner === window.accountId;

    const sellerOrders = onlySeller(seller, orders);
    const customerOrders = isCustomer ? onlyBetween(window.accountId, seller, orders) : [];

    const notPurchasedOrders = onlyNotPurchased(sellerOrders);

    const openingOrders = onlyNotPurchased(customerOrders);
    const reviewableOrders = onlyReviewable(customerOrders);

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
                    <ReviewList />
                </Col>
                <Col sm={{ span: 24, order: 0 }} lg={{ span: 8, order: 1 }}>
                    <Row gutter={[10, 10]}>
                        <Col span={(isCustomer && openingOrders.length > 0) ? 24 : 0}>
                            <OpeningOrders orders={openingOrders} />
                        </Col>
                        <Col span={isCustomer ? 24 : 0}>
                            <WriteReview orders={reviewableOrders} />
                        </Col>
                        <Col span={24} span={isCustomer ? 24 : 0}>
                            <OpenIssue />
                        </Col>
                        <Col span={24} span={isOwner ? 24 : 0}>
                            <CreateOrder product={product} />
                        </Col>
                        <Col span={24} span={(isOwner && notPurchasedOrders.length > 0) ? 24 : 0}>
                            <WaitingOrders orders={notPurchasedOrders} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </StyledWrapper>
    )
}

export default ProductPage
