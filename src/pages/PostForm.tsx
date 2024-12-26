import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useCreatePostMutation,
  useUpdatePostMutation,
  useGetPostQuery,
  useGetCurrentUserQuery,
} from '@/services/api';
import { useAppDispatch } from '@/hooks/useReduxHook';
import { setPosts } from '@/redux/postSlice';
import { useForm } from 'react-hook-form';
import { PostParams } from '@/services/types';
import toast from 'react-hot-toast';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isEditing = Boolean(id);
  const { data: currentUser } = useGetCurrentUserQuery();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostParams>();

  const { data: existingPost } = useGetPostQuery(id ?? '', {
    skip: !isEditing,
  });

  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();

  useEffect(() => {
    if (isEditing && existingPost) {
      setValue('title', existingPost.title),
        setValue('content', existingPost.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, existingPost]);

  const onSubmit = async (data: PostParams) => {
    const toastloading = toast.loading('Creating post, please hold on...');
    const post = {
      id: new Date().toISOString(),
      title: data.title,
      content: data.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEdited: false,
      commentCount: 0,
      userName: currentUser?.userName ?? '',
    };

    try {
      dispatch(setPosts(post));
      if (isEditing) {
        await updatePost({
          id: id ?? '',
          ...data,
        }).unwrap();
      } else {
        await createPost(data).unwrap();
      }
      toast.success('Post saved successfully', { id: toastloading });
      navigate('/posts');
    } catch (error) {
      // todo  - remove this later
      navigate('/posts');
      toast.error('Failed to save post', { id: toastloading });
      console.error('Failed to save post:', error);
    }
  };

  return (
    <div className="max-w-4xl px-4 py-8">
      <h2 className="font-bold text-base md:text-2xl mb-2">
        {isEditing ? 'Edit Post' : 'Create New Post'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <div>
            <input
              {...register('title', { required: 'Title is required' })}
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            {...register('content', { required: 'Content is required' })}
            className="min-h-[200px] appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/posts')}
            className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isEditing ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>{' '}
    </div>
  );
};

export default PostForm;
