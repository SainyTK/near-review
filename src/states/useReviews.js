import useSWR, { mutate } from 'swr';
import reviewService from '../services/reviewService';

const useReviews = () => {
    const key = `/reviews`
    const { data, error } = useSWR(key, reviewService.getReviews);

    const reviewMap = !data ? {} : data.reduce((prev, cur) => ({ ...prev, [cur.orderId]: cur }), {});

    const orderReviews = (orders) => {
        return orders ? orders.filter(o => reviewMap[o.orderId]).map(o => ({...reviewMap[o.orderId], ...o})) : []
    }

    return {
        reviews: data,
        reviewMap,
        orderReviews,
        isLoading: !error && !data,
        isError: error,
        update: () => mutate(key)
    }
}

export default useReviews;