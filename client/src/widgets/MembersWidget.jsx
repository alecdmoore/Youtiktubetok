import { useState, useEffect } from "react";
import WidgetWrapper from "../components/WidgetWrapper";
import {
  Box,
  Divider,
  IconButton,
  useTheme,
  Typography,
  Dialog,
  DialogTitle,
} from "@mui/material";
import FlexBetween from "../components/FlexBetween";
import MemberWidget from "./MemberWidget";
import { useSelector, useDispatch } from "react-redux";
import { setCollections } from "../state/authSlice";
import { GroupAddOutlined, GroupRemoveOutlined } from "@mui/icons-material";
import MemberDialog from "../components/MemberDialog";
import baseURL from "../baseURL";

const MembersWidget = (props) => {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const collections = useSelector((state) => state.collections);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [currentCollection, setCurrentCollection] = useState(
    collections.find((col) => col._id === props.currentCollection._id)
  );

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpenRemove = () => {
    setOpenRemove(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setOpenRemove(false);
    const formData = new URLSearchParams();
    formData.append("memberId", value._id);
    formData.append("picturePath", value.picturePath);
    formData.append("firstName", value.firstName);
    formData.append("lastName", value.lastName);

    if (value) {
      const addRemoveMembers = async () => {
        // router.patch("/:id/members", verifyToken, addRemoveMember);
        const response = await fetch(
          `${baseURL}/collections/${props.currentCollection._id}/members`,
          {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );
        const data = await response.json();
        //replace the current collection with the response(data) and dispatch the state
        const index = collections.findIndex(
          (col) => col._id === props.currentCollection._id
        );
        const newCollections = [
          ...collections.slice(0, index),
          data,
          ...collections.slice(index + 1),
        ];
        dispatch(setCollections({ resultCollection: newCollections }));
        setCurrentCollection(data);
      };

      addRemoveMembers();
    }
  };

  const { palette } = useTheme();
  const primaryDark = palette.primary.dark;
  const primaryLight = palette.primary.light;
  const dark = palette.neutral.dark;

  return (
    <>
      <WidgetWrapper>
        <Box>
          <FlexBetween>
            <Typography
              variant="h3"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              Members
            </Typography>
            <IconButton
              sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
              onClick={handleClickOpen}
            >
              <GroupAddOutlined sx={{ color: primaryDark }} />
            </IconButton>
            <IconButton
              sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
              onClick={handleClickOpenRemove}
            >
              <GroupRemoveOutlined sx={{ color: primaryDark }} />
            </IconButton>
          </FlexBetween>
        </Box>

        <Divider sx={{ margin: "1.25rem 0 0 0" }} />
        {currentCollection.members.map((member) => {
          return <MemberWidget key={member._id} member={member} user={user} />;
        })}
      </WidgetWrapper>
      <MemberDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        addRemove={"add"}
      />
      <MemberDialog
        selectedValue={selectedValue}
        open={openRemove}
        onClose={handleClose}
        addRemove={"remove"}
      />
    </>
  );
};

export default MembersWidget;
