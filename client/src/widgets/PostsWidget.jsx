import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../state/authSlice";
import { useParams } from "react-router-dom";
import PostWidget from "./PostWidget";
import baseURL from "../baseURL";

//make this into a collections widget. it will display all the collections available to the user

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const { collectionId } = useParams();

  const getPosts = async () => {
    const response = await fetch(
      `${baseURL}/collections/${collectionId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();

    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(`${baseURL}/posts/${userId}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    // if (isProfile) {
    //   getUserPosts();
    // } else {
    getPosts();
    // }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          mediaPath,
          mediaType,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            mediaPath={mediaPath}
            mediaType={mediaType}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
