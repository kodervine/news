import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Comment, Post } from '@/services/types';

interface PostsState {
  posts: Post[];
  selectedPost: Post;
  comments: Comment[];
}

const initialState: PostsState = {
  posts: [],
  selectedPost: {} as Post,
  comments: [],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post>) => {
      state.posts.push(action.payload);
    },
    setSelectedPost: (state, action: PayloadAction<Post>) => {
      state.selectedPost = action.payload;
    },
    setComments: (state, action: PayloadAction<Comment>) => {
      state.comments.push(action.payload);
    },
  },
});

export const { setSelectedPost, setPosts, setComments } = postsSlice.actions;

export default postsSlice.reducer;
