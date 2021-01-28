import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import reviewService from '../services/reviewService';
import useOrders from './useOrders';

const useReviews = (orderId) => {
    const key = `/reviews/${orderId}`
    const { data, error } = useSWR(key, reviewService.getReviews);
    const ordersState = useOrders();

    const reviewMap = useMemo(() => {
        return !data ? {} : data.reduce((prev, cur) => {
            const order = ordersState.orders ? ordersState.orders[cur.orderId] : {};
            return { ...prev, [cur.orderId]: { ...cur, ...order } }
        }, {});
    }, [data, ordersState.orders])

    return {
        reviews: Object.values(reviewMap),
        reviewMap,
        isLoading: !error && !data,
        isError: error,
        update: () => mutate(key)
    }
}

export default useReviews;