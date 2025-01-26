import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

/**
 * Custom hook that handles the follow functionality for a user.
 * It uses the `useMutation` hook from react-query to perform the follow operation
 * and updates the UI accordingly upon success or error.
 *
 * @returns {Object} - An object containing:
 *   - {Function} followMutate: Function to initiate the follow mutation.
 *   - {boolean} isPending: Boolean indicating if the mutation is in progress.
 */
const useFollow = () => {
  const queryClient = useQueryClient();
  const {
    mutate: followMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`/api/users/follow/${userId}`, {
          method: "POST",
          header: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return;
      } catch (error) {
        throw new Error(error);
      }
    },

    onSuccess: () => {
      // invalidate the query to update the UI with the new data
      Promise.all([
        // re-render right panel suggested users
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        //re-render auth user for user profile page
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
      ]);
    },

    onError: () => {
      toast.error(error.message);
    },
  });

  return { followMutate, isPending };
};

export default useFollow;
