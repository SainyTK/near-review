import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import ipfs from '../../ipfs';
import productService from '../../services/productService';
import { notification } from 'antd';
import ProductForm from '../../components/ProductForm';

const SytledWrapper = styled.div`
    padding: 20px 20%;
`

const CreateProductPage = () => {

    const history = useHistory();

    const handleCreateProduct = async (data) => {
        try {

            const { reviewValue, price, allowSelfPurchase, ...productData } = data;

            const ipfsRes = await ipfs.uploadObject(productData);

            await productService.createProduct(ipfsRes[0].hash, price.toString(), reviewValue.toString(), allowSelfPurchase);

            history.replace('/manageProducts');

            notification['success']({
                message: 'Success',
                description: 'Upload a product successfully'
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
                type='create'
                onConfirm={handleCreateProduct}
                onCancel={() => history.replace('/manageProducts')}
            />
        </SytledWrapper>
    )
}

export default CreateProductPage
