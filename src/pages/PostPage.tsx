import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHook';
import {
  useDeletePostMutation,
  useGetCurrentUserQuery,
  useGetPostsQuery,
} from '@/services/api';
import { setSelectedPost } from '@/redux/postSlice';
import { CircleOff, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';
import { useState } from 'react';
import PaginationControls from '@/components/Pagination';

export default function PostPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const { posts } = useAppSelector((state) => state.posts);

  const { data: currentUser } = useGetCurrentUserQuery();
  const { data, isLoading } = useGetPostsQuery({
    page: currentPage,
    size: pageSize,
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const postsData = data?.posts ?? posts;
  const [deletePost] = useDeletePostMutation();

  const handleDeletePost = async (id: string) => {
    const toastloading = toast.loading('Deleting Post, please hold on...');
    try {
      await deletePost(id).unwrap();
      toast.success('Post deleted successfully', { id: toastloading });
    } catch (error) {
      toast.error('Failed to delete Post', { id: toastloading });
      console.error('Failed to delete Post:', error);
    }
  };

  return (
    <div className="lg:max-w-[80%] px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row gap-2 justify-between sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
        <button
          onClick={() => navigate('/posts/new')}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create New Post
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : postsData.length === 0 ? (
        <div className="flex flex-col gap-4 lg:gap-8 items-center text-center">
          <CircleOff size={50} />
          <div>
            <h3 className="font-semibold text-lg">No posts yet</h3>
            <p>Click the create button to add a new post</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {postsData.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow overflow-hidden rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                dispatch(setSelectedPost(post));
                navigate(`/posts/${post.id}`);
              }}
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h2>
                  {post.userName === currentUser?.userName && (
                    <button
                      title="Delete Post"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeletePost(post.id);
                      }}
                    >
                      <Trash className="text-red-500" size={20} />
                    </button>
                  )}
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.content}
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <span>{post.userName}</span>
                    <span>•</span>
                    <span>
                      {post.createdAt
                        ? format(new Date(post.createdAt), 'MMM d, yyyy')
                        : ''}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>{post.commentCount} comments</span>
                    {post.isEdited && <span>• Edited</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-center space-x-2 mt-8">
            {!isLoading && data?.pageInfo && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={data?.pageInfo.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
