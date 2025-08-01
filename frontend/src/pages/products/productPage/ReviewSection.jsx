import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaEdit, FaTrash, FaUser, FaTimes } from "react-icons/fa";

export default function ReviewSection({
  reviews = [],
  user,
  onReviewSubmit,
  onReviewDelete
}) {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  const userReview = user ? reviews.find((r) => r.user === user._id) : null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isReviewFormOpen) {
        if (e.key === "Escape") {
          setIsReviewFormOpen(false);
        } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
          handleSubmit(e);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isReviewFormOpen, rating, comment]);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (user) {
      if (a.user === user._id && b.user !== user._id) return -1;
      if (a.user !== user._id && b.user === user._id) return 1;
    }
    const aDate = new Date(a.updatedAt || a.createdAt);
    const bDate = new Date(b.updatedAt || b.createdAt);
    return bDate - aDate;
  });

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!rating) return;
      setIsSubmitting(true);
      try {
        await onReviewSubmit({ rating, comment });
        setIsReviewFormOpen(false);
        setRating(0);
        setComment("");
      } catch (error) {
        console.error("Review submission failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [rating, comment, onReviewSubmit]
  );

  const handleDelete = useCallback(
    async (reviewId) => {
      setIsDeleting(reviewId);
      try {
        await onReviewDelete(reviewId);
      } catch (error) {
        console.error("Delete failed:", error);
      } finally {
        setIsDeleting(null);
      }
    },
    [onReviewDelete]
  );

  const openReviewForm = () => {
    setIsReviewFormOpen(true);
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment);
    }
  };

  const closeReviewForm = () => {
    setIsReviewFormOpen(false);
    setRating(0);
    setComment("");
  };

  return (
    <div className="container mx-auto px-4 py-8 border-t border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Customer Reviews</h2>
        {user && (
          <button
            onClick={openReviewForm}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg"
          >
            {userReview ? "Edit Your Review" : "Write a Review"}
          </button>
        )}
      </div>

      {/* Review Form Modal */}
      <AnimatePresence>
        {isReviewFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            onClick={closeReviewForm}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  {userReview ? "Edit Review" : "Write a Review"}
                </h3>
                <button
                  onClick={closeReviewForm}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-2 text-gray-300">Your Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={`rating-${star}`}
                        onClick={() => setRating(star)}
                        className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-500 hover:text-yellow-300"}`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="comment" className="block mb-2 text-gray-300">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-gray-700 text-white p-3 rounded-lg"
                    rows="4"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeReviewForm}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!rating || isSubmitting}
                    className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg text-white disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review, index) => {
            const isUserReview = user && review.user === user._id;
            const isBeingDeleted = isDeleting === review._id;
            const safeKey = `review-${review._id || review.user || index}`;

            return (
              <motion.div
                key={safeKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isBeingDeleted ? 0.5 : 1, y: 0 }}
                className={`bg-gray-800 rounded-xl p-4 ${isBeingDeleted ? "opacity-50" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <FaUser className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <div>
                        <h4 className={`font-medium ${isUserReview ? "text-cyan-400" : "text-white"}`}>
                          {review.name || "Anonymous"}
                          {isUserReview && (
                            <span className="ml-2 text-xs bg-cyan-900 text-cyan-300 px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </h4>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={`star-${i}-${review._id || review.user || "none"}`}
                              className={`${i < review.rating ? "text-yellow-400" : "text-gray-500"} mr-1`}
                              size={14}
                            />
                          ))}
                          <span className="text-xs text-gray-400 ml-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {isUserReview && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setRating(review.rating);
                              setComment(review.comment);
                              setIsReviewFormOpen(true);
                            }}
                            disabled={isBeingDeleted}
                            className="text-gray-400 hover:text-cyan-400"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
                            disabled={isBeingDeleted}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-gray-300 whitespace-pre-wrap">{review.comment}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
