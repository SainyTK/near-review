import React, { useState } from 'react'
import styled from 'styled-components';
import ProductCard from '../../components/ProductCard';
import { Link } from 'react-router-dom';
import useProductsOf from '../../states/useProductsOf';
import { Pagination, Button } from 'antd';
import ProductList from '../../components/ProductList';

const StyledWrapper = styled.div`
    padding: 20px;
    width: 100%;
    max-width: 800px;

    .top-panel {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }

    .products-container {
        margin-bottom: 16px;
    }

    .product-card {
        margin-bottom: 16px;
    }
`


const ManageProductsPage = () => {

    const productsState = useProductsOf(window.accountId);


    console.log(productsState.products);

    return (
        <StyledWrapper>
            <div className='top-panel'>
                <h3>Manage Products</h3>
                <Link to='/createProduct'>
                    <Button type='primary'>+ Create New Product</Button>
                </Link>
            </div>
            <ProductList {...productsState} editable hideOwner hideStat showInActive/>
        </StyledWrapper>
    )
}

export default ManageProductsPage
