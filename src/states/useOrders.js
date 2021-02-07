import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import orderService from '../services/orderService';

const useOrders = () => {
    const key = `/orders`
    const { data, error } = useSWR(key, () => orderService.getOrders());

    const onlyNotPurchased = useCallback((orders) => {
        return orders ? orders.filter(o => o.purchasedAt === 0) : [];
    }, [])

    const onlyPurchased = useCallback((orders) => {
        return orders ? orders.filter(o => o.purchasedAt > 0) : [];
    }, [])

    const onlyReviewed = useCallback((orders) => {
        return orders ? orders.filter(o => o.reviewedAt > 0) : [];
    }, [])

    const onlyReviewable = useCallback((orders) => {
        return orders ? orders.filter(o => o.purchasedAt > 0 && o.reviewedAt === 0) : [];
    }, [])

    const onlyLikable = useCallback((orders) => {
        return orders ? orders.filter(o => o.purchasedAt > 0 && o.gaveHelpfulAt === 0) : [];
    }, [])

    const onlyCustomer = useCallback((customer, orders) => {
        return orders ? orders.filter(o => customer === o.customer) : [];
    }, [])

    const onlySeller = useCallback((seller, orders) => {
        return orders ? orders.filter(o => seller === o.seller) : [];
    }, [])

    const onlyBetween = useCallback((customer, seller, orders) => {
        return orders ? orders.filter(o => o.customer === customer && o.seller === seller) : [];
    }, [])

    const onlyRewardable = useCallback((orders) => {
        return orders ? orders.filter(o => new Date().valueOf() > o.helpful_deadline && o.gaveHelpfulAt === 0) : []
    }, []);

    return {
        orders: data,
        isLoading: !error && !data,
        isError: error,
        update: () => mutate(key),
        onlyNotPurchased,
        onlyPurchased,
        onlyReviewed,
        onlyCustomer,
        onlySeller,
        onlyBetween,
        onlyReviewable,
        onlyLikable,
        onlyRewardable
    }
}

export default useOrders;