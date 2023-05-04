import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import WidgetWrapper from "../components/WidgetWrapper";
import FlexBetween from "../components/FlexBetween";
import UserImage from "../components/UserImage";
import { InputBase, useTheme, Button } from "@mui/material";
import { setCollections } from "../state/authSlice";
import baseURL from "../baseURL";

const CreateCollectionWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);

  const handleSubmit = async () => {
    const formData = new URLSearchParams();
    formData.append("title", title);

    const response = await fetch(`${baseURL}/collections`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const result = await response.json();
    console.log(result);

    const responseCollection = await fetch(`${baseURL}/collections`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const resultCollection = await responseCollection.json();
    console.log(resultCollection);
    //TODO create redux reducers
    dispatch(setCollections({ resultCollection }));
    setTitle("");
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What do you want to name the new collection?"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
        <Button
          disabled={!title}
          onClick={handleSubmit}
          sx={{
            "&:hover": { cursor: "pointer" },
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          Create
        </Button>
      </FlexBetween>
      {/* <FlexBetween>
        <Button>Create</Button>
      </FlexBetween> */}
    </WidgetWrapper>
  );
};

export default CreateCollectionWidget;
