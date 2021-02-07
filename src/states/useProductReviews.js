import useReviews from './useReviews';

const useProductReviews = (seller, productId) => {
    const { reviews, ...reviewState } = useReviews();

    const data = reviews ? reviews.filter((review) => {
        return review.seller === seller && +review.productId === +productId
    }) : null;

    return {
        reviews: data,
        ...reviewState
    }
}

export default useProductReviews;