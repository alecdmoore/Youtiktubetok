import { PersonAddOutlined } from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, IconButton } from "@mui/material";
import UserImage from "../components/UserImage";
import FlexBetween from "../components/FlexBetween";
import MemberWrapper from "../components/MemberWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MemberWidget = ({ member, user }) => {
  //   const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const primaryDark = palette.primary.dark;
  const primaryLight = palette.primary.light;

  return (
    <MemberWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${member._id}`)}
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
        {!user.friends.includes(member._id) && user._id !== member._id && (
          <IconButton sx={{ backgroundColor: primaryLight, p: "0.6rem" }}>
            <PersonAddOutlined sx={{ color: primaryDark }} />
          </IconButton>
        )}
      </FlexBetween>
    </MemberWrapper>
  );
};

export default MemberWidget;
