import { useState } from "react";
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
import { useSelector } from "react-redux";
import { GroupAddOutlined } from "@mui/icons-material";
import MemberDialog from "../components/MemberDialog";

const MembersWidget = (props) => {
  const user = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
    console.log(value);
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
          </FlexBetween>
        </Box>

        <Divider sx={{ margin: "1.25rem 0 0 0" }} />
        {props.currentCollection.members.map((member) => {
          return <MemberWidget member={member} user={user} />;
        })}
      </WidgetWrapper>
      <MemberDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </>
  );
};

export default MembersWidget;
