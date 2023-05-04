import { useDispatch, useSelector } from "react-redux";
import WidgetWrapper from "../components/WidgetWrapper";
import FlexBetween from "../components/FlexBetween";
import UserImage from "../components/UserImage";
import Dropzone from "react-dropzone";
import { useState, useEffect } from "react";
import { setPosts } from "../state/authSlice";
import {
  EditOutlined,
  DeleteOutlined,
  ImageOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { BsTiktok } from "react-icons/bs";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";

const CreatePostWidget = ({ picturePath, collectionId }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [tikTok, setTikTok] = useState(false);
  const [youTube, setYouTube] = useState(false);
  const [image, setImage] = useState(null);
  const [link, setLink] = useState("");
  const [post, setPost] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const posts = useSelector((state) => state.posts);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const createPost = async () => {
    console.log(link);
    console.log(youTube);
    const formData = new FormData();
    formData.append("description", post);
    if (image) {
      formData.append("picture", image);
      formData.append("mediaPath", image.name);
    } else {
      formData.append("mediaPath", link);
    }
    tikTok
      ? formData.append("mediaType", "TikTok")
      : youTube
      ? formData.append("mediaType", "YouTube")
      : isImage
      ? formData.append("mediaType", "Picture")
      : formData.append("mediaType", "Text");

    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    const response = await fetch(
      `http://localhost:5000/api/collections/${collectionId}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );
    const data = await response.json();
    console.log(data);
    console.log(`add post ${collectionId}`);
    let newPosts = [...posts];
    console.log(posts);
    newPosts.push(data);
    console.log(newPosts);
    dispatch(setPosts({ posts: newPosts }));
    setPost("");
    setLink("");
    setTikTok(false);
    setYouTube(false);
    setImage(null);
    setIsImage(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost();
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="Enter a description..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>

      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      {(tikTok || youTube) && (
        <Box mt="1rem" p="1rem">
          <InputBase
            placeholder={`Enter ${tikTok ? "TikTok" : "YouTube"} Link...`}
            onChange={(e) => setLink(e.target.value)}
            value={link}
            sx={{
              width: "100%",
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              padding: "1rem 2rem",
            }}
          />
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween
          gap="0.25rem"
          sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          onClick={() => setIsImage(!isImage)}
        >
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        {isNonMobileScreens ? (
          <>
            <FlexBetween
              gap="0.25rem"
              sx={{ "&:hover": { cursor: "pointer", color: medium } }}
              onClick={() => {
                setYouTube(true);
                setTikTok(false);
              }}
            >
              <YouTubeIcon sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>YouTube</Typography>
            </FlexBetween>

            <FlexBetween
              gap="0.25rem"
              sx={{ "&:hover": { cursor: "pointer", color: medium } }}
              onClick={() => {
                setYouTube(false);
                setTikTok(true);
              }}
            >
              <BsTiktok sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>TikTok</Typography>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}

        <Button
          disabled={!post}
          onClick={handleSubmit}
          sx={{
            "&:hover": { cursor: "pointer" },
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default CreatePostWidget;
