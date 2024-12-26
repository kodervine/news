export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
}

export interface AuthResponse {
  token: string;
}

export interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface PostParams {
  title: string;
  content: string;
}

export interface CommentParams {
  comment: string;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  userName: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  commentCount: number;
  userName: string;
}

export interface PageInfo {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PostsResponse {
  posts: Post[];
  pageInfo: PageInfo;
}

export interface CommentsResponse {
  comments: Comment[];
  pageInfo: PageInfo;
}
