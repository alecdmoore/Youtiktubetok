import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { useParams } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { blue } from "@mui/material/colors";
import { useEffect, useState } from "react";
import UserImage from "./UserImage";

const MemberDialog = (props) => {
  let { collectionId } = useParams();
  const { onClose, selectedValue, open } = props;
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const collections = useSelector((state) => state.collections);
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [currentCollection, setCurrentCollection] = useState(
    collections.find((col) => col._id === collectionId)
  );

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    console.log(`${props.addRemove}`);
    console.log(value);
    // if (props.addRemove === "add") {
    //   const filteredFriends = friends.filter((item) => item._id !== value._id);
    //   setFriends(filteredFriends);
    //   setMembers([...members, value]);
    // }
    // if (props.addRemove === "remove" && value) {
    //   setFriends([...friends, value]);
    // }
    onClose(value);
  };

  const getFriends = async () => {
    const response = await fetch(
      `http://localhost:5000/api/users/${user._id}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    // const filteredFriends = data.filter(
    //   (friend) =>
    //     !currentCollection.members.find((member) => friend._id === member._id)
    // );

    setFriends(data);
    setFilteredFriends(
      data.filter(
        (friend) =>
          !currentCollection.members.find((member) => friend._id === member._id)
      )
    );
  };
  useEffect(() => {
    getFriends();
  }, []);

  useEffect(() => {
    let temp = collections.find((col) => col._id === collectionId);
    setCurrentCollection(collections.find((col) => col._id === collectionId));
    setFilteredFriends(
      friends.filter(
        (item) => !temp.members.find((member) => item._id === member._id)
      )
    );
  }, [collections]);

  return (
    <Dialog onClose={handleClose} open={open}>
      {props.addRemove === "add" && (
        <DialogTitle>Add Friend To Collection</DialogTitle>
      )}
      {props.addRemove === "remove" && (
        <DialogTitle>Remove Member from Collection</DialogTitle>
      )}
      <List sx={{ pt: 0 }}>
        {props.addRemove === "add" &&
          filteredFriends.map((friend) => (
            <ListItem disableGutters key={friend._id}>
              <ListItemButton
                onClick={() => handleListItemClick(friend)}
                key={friend._id}
              >
                <ListItemAvatar>
                  <Avatar
                    src={`http://localhost:5000/assets/${friend.picturePath}`}
                  ></Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={friend.firstName + " " + friend.lastName}
                />
              </ListItemButton>
            </ListItem>
          ))}

        {props.addRemove === "remove" &&
          currentCollection.members.map((friend) => (
            <ListItem disableGutters key={friend._id}>
              <ListItemButton
                onClick={() => handleListItemClick(friend)}
                key={friend._id}
              >
                <ListItemAvatar>
                  <Avatar
                    src={`http://localhost:5000/assets/${friend.picturePath}`}
                  ></Avatar>
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
