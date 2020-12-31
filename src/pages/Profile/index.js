import { Row, Col } from 'antd';
import React from 'react'
import styled from 'styled-components';
import ProfileCard from '../../components/ProfileCard';
import ProductList from '../../components/ProductList';
import useProductsOf from '../../states/useProductsOf';
import useProfile from '../../states/useProfile';
import ProfileInfoCard from '../../components/ProfileInfoCard';

const StyledWrapper = styled.div`
    padding: 20px;

    .profile-wrapper {
        margin-bottom: 16px;
    }

`

const ProfilePage = () => {

    const { profile } = useProfile(window.accountId);
    const productsState = useProductsOf(window.accountId);

    const { products } = productsState;

    const isSeller = !products || (products && products.length > 0);

    const renderSellerInfo = () => {
        return (
            <Row gutter={[20, 20]}>
                <Col sm={24} lg={16}>
                    <h3>Products</h3>
                </Col>
                <Col xs={0} sm={0} lg={8}>
                </Col>
                <Col sm={24} lg={16}>
                    <ProductList {...productsState} hideOwner />
                </Col>
                <Col xs={0} sm={0} lg={8}>
                    <ProfileInfoCard {...profile} />
                </Col>
            </Row>
        )
    }

    const renderCustomerInfo = () => {
        return (
            <Row gutter={[20, 20]}>
                <Col sm={24} lg={16}>

                </Col>
                <Col xs={0} sm={0} lg={8}>
                    <ProfileInfoCard {...profile} />
                </Col>
            </Row>
        )
    }

    return (
        <StyledWrapper>
            <div className='profile-wrapper'>
                <ProfileCard {...profile} />
            </div>
            {
                isSeller ? renderSellerInfo() : renderCustomerInfo()
            }
        </StyledWrapper>
    )
}

export default ProfilePage
