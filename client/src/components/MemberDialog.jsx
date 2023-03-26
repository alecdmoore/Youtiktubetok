import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { blue } from "@mui/material/colors";
import { useEffect, useState } from "react";
import UserImage from "./UserImage";

const emails = ["username@gmail.com", "user02@gmail.com"];

const MemberDialog = (props) => {
  const { onClose, selectedValue, open } = props;
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [friends, setFriends] = useState([]);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const getFriends = async () => {
    const response = await fetch(
      `http://localhost:5000/users/${user._id}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setFriends(data);
    console.log(data);
  };
  useEffect(() => {
    getFriends();
  }, []);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add Friend To Collection</DialogTitle>
      <List sx={{ pt: 0 }}>
        {friends.map((friend) => (
          <ListItem disableGutters>
            <ListItemButton
              onClick={() => handleListItemClick(friend)}
              key={friend._id}
            >
              <ListItemAvatar>
                <Avatar>
                  <UserImage picturePath={friend.picturePath} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={friend.firstName + " " + friend.lastName}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

export default MemberDialog;
