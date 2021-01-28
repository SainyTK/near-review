import useReviews from './useReviews';

const useReview = (orderId) => {
    const reviewsState = useReviews();

    return {
        review: reviewsState.reviewMap[+orderId],
        isLoading: reviewsState.isLoading,
        isError: reviewsState.isError,
        update: reviewsState.update
    }
}

export default useReview;