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
        return issues ? issues.filter(issue => new Date().valueOf() < issue.deadline) : [];
    }, []);

    const onlyClosed = useCallback((issues) => {
        return issues ? issues.filter(issue => new Date().valueOf() > issue.deadline) : [];
    }, []);

    const checkWin = useCallback((issue, accountId) => {
        const closed = new Date().valueOf() > issue.deadline;
        const voteYes = issue.voteYesMap[accountId] ? issue.voteYesMap[accountId].value : 0
        const voteNo = issue.voteNoMap[accountId] ? issue.voteNoMap[accountId].value : 0
        let won = false;
        if (issue.totalYes > issue.totalNo) {
            won = voteYes >= 0
        } else if (issue.totalYes < issue.totalNo) {
            won = voteNo >= 0
        } else {
            won = voteYes >= 0 || voteNo >= 0
        }
        return closed && won
    })

    const onlyWin = useCallback((issues, accountId) => {
        return issues ? issues.filter(issue => checkWin(issue, accountId)) : []
    })

    return {
        issues: data,
        issueMap,
        isLoading: !error && !data,
        isError: error,
        update: () => mutate(key),
        onlyOpen,
        onlyClosed,
        onlyWin,
        checkWin
    }
}

export default useIssues;