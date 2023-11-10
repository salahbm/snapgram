import { Models } from "appwrite";
import React from "react";

interface PropTypes {
  post: Models.Document;
  userId: string;
}
const PostStats = ({ post, userId }: PropTypes) => {
  return <div>PostStats</div>;
};

export default PostStats;
