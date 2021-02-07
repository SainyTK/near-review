import useSWR from "swr"
import customerService from "../services/customerService"

const useCustomers = () => {
    const { data, error } = useSWR('/customers', () => customerService.getCustomers());
    
    return {
        customers: data,
        isLoading: !data && !error,
        isError: error
    }
}

export default useCustomers;