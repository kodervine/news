import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  useGetPostQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsQuery,
  useGetCurrentUserQuery,
  useDeletePostMutation,
} from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHook';
import { setComments } from '@/redux/postSlice';
import { useForm } from 'react-hook-form';
import { CommentParams } from '@/services/types';
import { ArrowLeft, CircleOff, Pencil, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';

const PostDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: currentUser } = useGetCurrentUserQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { selectedPost, comments: commentsSliceData } = useAppSelector(
    (state) => state.posts
  );

  const { data, isLoading: isPostByIdLoading } = useGetPostQuery(id ?? '');
  const { data: commentsData } = useGetCommentsQuery({
    postId: id ?? '',
    page: currentPage,
    size: pageSize,
  });

  const singlePost = data ?? selectedPost;
  const comments = commentsData?.comments ?? commentsSliceData;
  const [addComment] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [deletePost] = useDeletePostMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentParams>();

  const onSubmit = async (data: CommentParams) => {
    const toastloading = toast.loading('Adding comment, please hold on...');
    const commentDetail = {
      id: new Date().toISOString(),
      postId: id ?? '',
      content: data.comment,
      createdAt: new Date().toISOString(),
      userName: currentUser?.userName ?? '',
    };

    dispatch(setComments(commentDetail));
    try {
      await addComment({
        postId: id ?? '',
        content: data.comment,
      }).unwrap();
      toast.success('Comment added successfully', { id: toastloading });
      reset();
    } catch (error) {
      toast.error('Failed to add comment', { id: toastloading });
      // todo - remove this reset here too
      reset();
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeletePost = async () => {
    const toastloading = toast.loading('Deleting Post, please hold on...');
    try {
      await deletePost(id ?? '').unwrap();
      toast.success('Post deleted successfully', { id: toastloading });
    } catch (error) {
      toast.error('Failed to delete Post', { id: toastloading });
      console.error('Failed to delete Post:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const toastloading = toast.loading('Deleting comment, please hold on...');
    try {
      await deleteComment({ postId: id, commentId }).unwrap();
      toast.success('Comment deleted successfully', { id: toastloading });
    } catch (error) {
      toast.error('Failed to delete comment', { id: toastloading });
      console.error('Failed to delete comment:', error);
    }
  };

  if (isPostByIdLoading) {
    return <Loader />;
  }

  if (!singlePost.id) {
    return (
      <div className="flex flex-col gap-4 lg:gap-8 items-center text-center mt-7">
        <CircleOff size={30} />
        <div>
          <h3 className="font-semibold text-lg">Post not found</h3>
          <p>Post with id {id} was not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          <ArrowLeft onClick={() => navigate(-1)} className="cursor-pointer" />
          <h1 className="text-lg md:text-3xl font-bold">{singlePost.title}</h1>
        </div>
        {currentUser?.userName === singlePost.userName && (
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/posts/edit/${id}`)}
              title="Edit post"
            >
              <Pencil size={20} />
            </button>{' '}
            <button onClick={handleDeletePost} title="Delete Post">
              <Trash className="text-red-500" size={20} />
            </button>
          </div>
        )}
      </div>
      <div className="text-sm text-gray-500">
        <span>{singlePost.userName}</span>
        <span className="mx-2">•</span>
        <span>
          {singlePost.createdAt
            ? format(new Date(singlePost.createdAt), 'MMM d, yyyy')
            : ''}
        </span>
        {singlePost?.isEdited && <span className="ml-2">• Edited</span>}
      </div>

      <div className="prose max-w-none">{singlePost.content}</div>

      {/* Comments Section */}
      <div className="mt-8">
        <h4 className="text-base font-bold mb-4">Comments</h4>

        {/* Add Comment Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
          <textarea
            {...register('comment', { required: 'Comment is required' })}
            placeholder="Add a comment..."
            className="mb-2 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-s"
          />
          {errors.comment && (
            <p className="my-1 text-sm text-red-600">
              {errors.comment.message}
            </p>
          )}
          <button
            type="submit"
            className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Submit Comment
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="flex flex-col gap-4 lg:gap-8 items-center text-center">
              <CircleOff size={30} />
              <div>
                <h3 className="font-semibold text-lg">No comments yet</h3>
                <p>Comments will show up here when added</p>
              </div>
            </div>
          ) : (
            comments
              ?.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
              .map((comment) => (
                <div
                  className="flex justify-between items-start"
                  key={comment.id}
                >
                  <div>
                    <div className="font-medium">{comment.userName}</div>
                    <div className="text-sm text-gray-500">
                      {comment.createdAt
                        ? format(new Date(comment.createdAt), 'MMM d, yyyy')
                        : ''}
                    </div>
                    <div className="mt-2">{comment.content}</div>
                  </div>

                  {currentUser?.userName === comment.userName && (
                    <button onClick={() => handleDeleteComment(comment.id)}>
                      <Trash className="text-red-500" size={15} />
                    </button>
                  )}
                </div>
              ))
          )}
        </div>

        {/* Pagination section */}
        <div className="flex justify-center space-x-2 mt-6">
          {Array.from(
            { length: Math.ceil(comments?.length / pageSize) },
            (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 py-1 rounded ${
                  commentsData?.pageInfo?.pageNumber === i
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailsPage;
