import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import ipfs from '../../ipfs';
import productService from '../../services/productService';
import { notification } from 'antd';
import ProductForm from '../../components/ProductForm';
import useProductOf from '../../states/useProductOf';

const SytledWrapper = styled.div`
    padding: 20px 20%;
`

const ManageProductPage = () => {

    const history = useHistory();
    const params = useParams();
    const { productId } = params;

    const productState = useProductOf(window.accountId, productId);
    const { product } = productState;

    const handleUpdateProduct = async (data) => {
        try {

            const { reviewValue, price, allowSelfPurchase, ...pData } = data;

            const ipfsRes = await ipfs.uploadObject(pData);

            await productService.updateProduct(+productId, ipfsRes[0].hash, price.toString(), reviewValue.toString(), allowSelfPurchase);

            notification['success']({
                message: 'Success',
                description: 'Update a product successfully'
            })

        } catch (e) {
            notification['error']({
                message: 'Error',
                description: e.message
            })
        }
    }

    return (
        <SytledWrapper>
            <ProductForm
                type='update'
                onConfirm={handleUpdateProduct}
                onCancel={() => history.replace('/manageProducts')}
                {...product}
            />
        </SytledWrapper>
    )
}

export default ManageProductPage
