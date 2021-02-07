import useIssues from './useIssues';
import useOrders from './useOrders';

const useProductIssues = (accountId, productId) => {

    const { orders, ...ordersState} = useOrders();
    const { issues, ...issuesState } = useIssues();

    const data = (issues && orders) ? issues.filter(issue => {
        const order = orders[issue.targetId];
        return order ? order.seller === accountId && +order.productId === +productId : false
    }) : [];

    return {
        productIssues: data,
        isLoading: ordersState.isLoading || issuesState.isLoading,
        isError: ordersState.isError || issuesState.isError,
        ...issuesState,
        update: () => {
            ordersState.update();
            issuesState.update();
        },
    }
}

export default useProductIssues;