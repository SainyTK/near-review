import useSWR, { mutate } from 'swr';
import productService from '../services/productService';

const useProductOf = (accountId, productId) => {
    const key = `/products/${accountId}/${productId}`

    const { data, error } = useSWR(key, async () => {
        try {
            const product = await productService.getProductOf(accountId, productId);
            return { ...product, owner: accountId, productId }
        } catch (e) {
            console.error(e);
            return { owner: accountId, productId }
        }

    });

    return {
        product: data,
        isLoading: !error && !data,
        isError: error,
        update: () => mutate(key)
    }
}

export default useProductOf;