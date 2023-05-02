import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  MoreVertOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  Menu,
  MenuItem,
  Modal,
  Button,
} from "@mui/material";
import FlexBetween from "../components/FlexBetween";
import Friend from "../components/Friend";
import WidgetWrapper from "../components/WidgetWrapper";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import YouTube from "../components/YouTube";
import TikTok from "../components/TikTok";
import MemberWidget from "./MemberWidget";
import { setPosts } from "../state/authSlice";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  mediaPath,
  mediaType,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { collectionId } = useParams();

  // For Menu Button
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const posts = useSelector((state) => state.posts);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    setAnchorEl(null);
  };

  const handleEdit = (e) => {
    console.log("edit");

    setAnchorEl(null);
  };

  const handleDelete = async () => {
    console.log("deleted");
    setAnchorEl(null);
    const formData = new URLSearchParams();
    formData.append("postId", postId);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    // collections/:id/posts
    // router.patch("/:id/posts", verifyToken, removePost);
    const response = await fetch(
      `http://localhost:5000/collections/${collectionId}/posts`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    const data = await response.json();
    setOpenModal(false);
    // filter the posts in redux
    const newPosts = posts.filter((post) => post._id.toString() !== postId);
    dispatch(setPosts({ posts: newPosts }));
  };

  //TODO match this to the api
  const patchLike = async () => {
    // const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
    //   method: "PATCH",
    //   mode: "no-cors",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify({ userId: loggedInUserId }),
    // });
    // const updatedPost = await response.json();
    // dispatch(setPost({ post: updatedPost }));
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        // subtitle={location}
        userPicturePath={userPicturePath}
      />

      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {/* this is where i need to implement the checks */}
      {mediaType == "Picture" && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:5000/assets/${mediaPath}`}
        />
      )}
      {mediaType == "YouTube" && <YouTube link={mediaPath} />}
      {mediaType == "TikTok" && <TikTok link={mediaPath} />}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>

            {/* <Typography>{comments.length}</Typography> */}
          </FlexBetween>
        </FlexBetween>

        <FlexBetween>
          {/* <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          > */}
          <IconButton onClick={handleClick}>
            <MoreVertOutlined />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            sx={{ width: 320, maxWidth: "100%" }}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => setOpenModal(true)}>Delete</MenuItem>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
          </Menu>
          {/* </Button> */}

          <IconButton>
            <ShareOutlined />
          </IconButton>
        </FlexBetween>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="child-modal-title">Are you sure you want to delete?</h2>

          <Button
            onClick={() => {
              setOpenModal(false);
              setAnchorEl(null);
            }}
          >
            No, Keep Post
          </Button>
          <Button sx={{ color: "red" }} onClick={handleDelete}>
            Yes, Delete Post
          </Button>
        </Box>
      </Modal>
    </WidgetWrapper>
  );
};

export default PostWidget;
