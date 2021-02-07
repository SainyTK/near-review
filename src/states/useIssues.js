import { useMemo, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import issueService from '../services/issueService';

const useIssues = () => {
    const key = `/issues`
    const { data, error } = useSWR(key, () => issueService.getIssues());

    const issueMap = useMemo(() => {
        return data ? data.reduce((prev, cur) => {
            if (new Date().valueOf() < cur.deadline)
                return { ...prev, [cur.targetId]: cur }
            return prev;
        }, {}) : {};
    }, [data])

    const onlyOpen = useCallback((issues) => {
        console.log(new Date().valueOf(), issues.map(i => i.deadline))
        return issues ? issues.filter(issue => new Date().valueOf() < issue.deadline) : [];
    }, []);

    return {
        issues: data,
        issueMap,
        isLoading: !error && !data,
        isError: error,
        update: () => mutate(key),
        onlyOpen
    }
}

export default useIssues;