import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../components/Friend";
import WidgetWrapper from "../components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../state/authSlice";
import MemberWidget from "../widgets/MemberWidget";
import baseURL from "../baseURL";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const getFriends = async () => {
    const response = await fetch(`${baseURL}/users/${userId}/friends`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends.map((friend) => (
          // <Friend
          //   key={friend._id}
          //   friendId={friend._id}
          //   name={`${friend.firstName} ${friend.lastName}`}
          //   userPicturePath={friend.picturePath}
          // />
          <MemberWidget
            key={friend._id}
            member={{
              firstName: friend.firstName,
              lastName: friend.lastName,
              _id: friend._id,
              picturePath: friend.picturePath,
            }}
            addRemove={true}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
