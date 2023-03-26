import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  EditOutlined,
  DeleteOutlined,
  DoneOutlined,
  ClearOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  InputBase,
  Modal,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import FlexBetween from "../components/FlexBetween";
import WidgetWrapper from "../components/WidgetWrapper";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCollections } from "../state/authSlice";

const CollectionWidget = ({ collection }) => {
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const light = palette.neutral.light;
  const medium = palette.neutral.medium;
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [isEdit, setIsEdit] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const token = useSelector((state) => state.token);
  const collections = useSelector((state) => state.collections);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/collections/${collection._id}`);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    console.log("handleEdit");
    setIsEdit(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit");

    const formData = new URLSearchParams();
    formData.append("title", collectionName);

    const response = await fetch(
      `http://localhost:5000/collections/${collection._id}/title`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );
    const result = await response.json();
    console.log(result);
    const resultCollection = collections.map((element) => {
      if (element._id == result._id) {
        return result;
      } else {
        return element;
      }
    });
    console.log(resultCollection);
    dispatch(setCollections({ resultCollection }));

    setIsEdit(false);
    setCollectionName("");
  };

  const handleCancel = (e) => {
    e.preventDefault();
    console.log("handleCancel");
    setIsEdit(false);
    setCollectionName("");
  };

  //TODO DELETE REQUEST to delete the collection
  //TODO Delete component upon sucessful deletion
  const handleDelete = async (e) => {
    e.preventDefault();
    console.log("handleDelete");

    const response = await fetch(
      `http://localhost:5000/collections/${collection._id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const result = await response.json();
    console.log(result);
    const resultCollection = collections.filter(
      (element) => element._id !== collection._id
    );
    console.log(resultCollection);
    dispatch(setCollections({ resultCollection }));

    setOpenModal(false);
    setIsEdit(false);
  };

  return (
    <>
      <Box
        border={`1px solid ${light}`}
        borderRadius="5px"
        mt="1rem"
        p="1rem"
        sx={{ "&:hover": { backgroundColor: light } }}
        display={isNonMobileScreens ? "flex" : "block"}
      >
        <Box
          flexBasis={isNonMobileScreens ? "80%" : undefined}
          onClick={handleClick}
        >
          {isEdit ? (
            <InputBase
              placeholder={collection.title}
              onChange={(e) => setCollectionName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              value={collectionName}
              autoFocus={true}
              sx={{
                width: "100%",
                backgroundColor: palette.neutral.light,
                borderRadius: "2rem",
                padding: "1rem 2rem",
              }}
            />
          ) : (
            <Typography color={main} sx={{ mt: "1rem" }}>
              {collection.title}
            </Typography>
          )}

          {/* </Link> */}
        </Box>

        {isEdit ? (
          <IconButton onClick={handleSubmit} sx={{ width: "15%" }}>
            <DoneOutlined />
          </IconButton>
        ) : (
          <IconButton onClick={handleEdit} sx={{ width: "15%" }}>
            <EditOutlined />
          </IconButton>
        )}

        {isEdit ? (
          <IconButton onClick={handleCancel} sx={{ width: "15%" }}>
            <ClearOutlined />
          </IconButton>
        ) : (
          <IconButton onClick={() => setOpenModal(true)} sx={{ width: "15%" }}>
            <DeleteOutlined />
          </IconButton>
        )}
      </Box>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="child-modal-title">
            Are you sure you want to delete {collection.title}?
          </h2>

          <Button onClick={() => setOpenModal(false)}>
            No, Keep Collection
          </Button>
          <Button sx={{ color: "red" }} onClick={handleDelete}>
            Yes, Delete Collection
          </Button>
        </Box>
      </Modal>
    </>
  );
};

//ClearOutlinedIcon
export default CollectionWidget;
