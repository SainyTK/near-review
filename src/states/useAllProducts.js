import useSWR, { mutate } from 'swr';
import productService from '../services/productService';

const useAllProducts = () => {
    const key = `/products`
    const { data, error } = useSWR(key, () => productService.getAllProducts());

    return {
        allProducts: data,
        isLoading: !error && !data,
        isError: error,
        update: () => mutate(key)
    }
}

export default useAllProducts;