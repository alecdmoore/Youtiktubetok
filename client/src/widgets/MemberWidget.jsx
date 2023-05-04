import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, IconButton } from "@mui/material";
import UserImage from "../components/UserImage";
import FlexBetween from "../components/FlexBetween";
import MemberWrapper from "../components/MemberWrapper";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../state/authSlice";
import baseURL from "../baseURL";

const MemberWidget = ({ member, addRemove }) => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const primaryDark = palette.primary.dark;
  const primaryLight = palette.primary.light;

  const isFriend = () => {
    for (let i = 0; i < user.friends.length; i++) {
      if (user.friends[i]._id == member._id) return true;
    }

    return false;
  };

  const handleAdd = async (e) => {
    e.stopPropagation();

    //router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
    const response = await fetch(`${baseURL}/users/${user._id}/${member._id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();

    dispatch(setFriends({ friends: result }));
  };

  return (
    <MemberWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => {
          navigate(`/profile/${member._id}`);
          navigate(0);
        }}
      >
        <FlexBetween gap="1rem">
          <UserImage image={member.picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {member.firstName} {member.lastName}
            </Typography>
          </Box>
        </FlexBetween>
        {addRemove && !isFriend() && user._id !== member._id && (
          <IconButton
            sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
            onClick={handleAdd}
          >
            <PersonAddOutlined sx={{ color: primaryDark }} />
          </IconButton>
        )}
        {addRemove && isFriend() && user._id !== member._id && (
          <IconButton
            sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
            onClick={handleAdd}
          >
            <PersonRemoveOutlined sx={{ color: "red" }} />
          </IconButton>
        )}
      </FlexBetween>
    </MemberWrapper>
  );
};

export default MemberWidget;
