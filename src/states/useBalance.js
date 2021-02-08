import useSWR from "swr"
import { utils } from 'near-api-js';

const useBalance = (accountId) => {
    const { data, error, mutate } = useSWR(`/balance/${accountId}`, async () => {
        const state = await window.walletConnection.account().state()
        return utils.format.formatNearAmount(state.amount, 5);
    });

    return {
        balance: data,
        isLoading: !data && !error,
        update: mutate
    }
}

export default useBalance;