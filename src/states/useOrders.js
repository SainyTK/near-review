import useSWR, { mutate } from 'swr';
import orderService from '../services/orderService';

const useOrders = () => {
    const key = `/orders`
    const { data, error } = useSWR(key, () => orderService.getOrders());

    const onlyNotPurchased = (orders) => {
        return orders ? orders.filter(o => o.purchasedAt === 0) : [];
    }

    const onlyPurchased = (orders) => {
        return orders ? orders.filter(o => o.purchasedAt > 0) : [];
    }

    const onlyReviewed = (orders) => {
        return orders ? orders.filter(o => o.reviewedAt > 0) : [];
    }

    const onlyReviewable = (orders) => {
        return orders ? orders.filter(o => o.purchasedAt > 0 && o.reviewedAt === 0) : [];
    }

    const onlyCustomer = (customer, orders) => {
        return orders ? orders.filter(o => customer === o.customer) : [];
    }

    const onlySeller = (seller, orders) => {
        return orders ? orders.filter(o => seller === o.seller) : [];
    }

    const onlyBetween = (customer, seller, orders) => {
        return orders ? orders.filter(o => o.customer === customer && o.seller === seller) : [];
    }

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
        onlyReviewable
    }
}

export default useOrders;