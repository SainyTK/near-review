import useSWR, { mutate } from 'swr';
import productService from '../services/productService';

const useProductsOf = (accountId) => {
    const key = `/products/${accountId}`
    const { data, error } = useSWR(key, async () => {
        const products = await productService.getProductsOf(accountId)
        return products.map((p, index) => ({ ...p, owner: accountId, productId: index }));
    });

    return {
        products: data,
        isLoading: !error && !data,
        isError: error,
        update: () => mutate(key)
    }
}

export default useProductsOf;