import useSWR, { mutate } from 'swr';
import userService from '../services/userService';

const useProfile = (accountId) => {
    const key = `/profile/${accountId}`
    const { data, error } = useSWR(key, async () => {
        try {
            if (accountId === null || accountId === undefined)
                return { accountId };
            const profile = await userService.getProfile(accountId);
            return { ...profile, accountId };
        } catch (e) {
            return { accountId };
        }
    });

    return {
        profile: data,
        isLoading: !error && !data,
        isError: error,
        update: () => mutate(key)
    }
}

export default useProfile;