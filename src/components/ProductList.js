import React, { useState } from 'react'
import styled from 'styled-components';
import { Button, Pagination, Space } from 'antd';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { EditFilled } from '@ant-design/icons';

const StyledWrapper = styled.div`

    .products-container {
        margin-bottom: 16px;
    }

    .product-card {
        margin-bottom: 16px;
    }

`;

const PAGE_SIZE = 5;

const ProductList = ({ products, isLoading, isError, showInActive, editable, hideOwner, hideStat }) => {

    const [page, setPage] = useState(1);

    const renderProducts = () => {
        if (isLoading)
            return "Loading products..."
        else if (isError)
            return "There is an error"
        else if (products.length <= 0)
            return "No products"
        else
            return products
                .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
                .sort((a, b) => b.isActive - a.isActive)
                .filter(item => showInActive || item.isActive)
                .map((product, index) => (
                    <div className='product-card' key={index}>
                        <Space size='large'>
                            <Link className='no-style' to={`/products/${product.owner}-${product.productId}`}>
                                <ProductCard
                                    product={product}
                                    index={index + 1}
                                    hideOwner={hideOwner}
                                    hideStat={hideStat}
                                />
                            </Link>
                            {
                                editable && (
                                    <Link to={`/manageProducts/${product.productId}`}>
                                        <Button icon={<EditFilled />} type='primary' />
                                    </Link>
                                )
                            }
                        </Space>
                    </div>

                ))
    }

    return (
        <StyledWrapper>
            <div className='products-container'>
                {renderProducts()}
            </div>
            <div>
                <Pagination
                    current={page}
                    total={products ? products.length : 0}
                    pageSize={PAGE_SIZE}
                    onChange={(p) => setPage(p)}
                />
            </div>
        </StyledWrapper>
    )
}

export default ProductList
