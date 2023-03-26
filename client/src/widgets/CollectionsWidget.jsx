import { useDispatch, useSelector } from "react-redux";
import WidgetWrapper from "../components/WidgetWrapper";
import FlexBetween from "../components/FlexBetween";
import CollectionWidget from "./CollectionWidget";
import { setCollections } from "../state/authSlice";
import {
  Typography,
  useTheme,
  Divider,
  Box,
  useMediaQuery,
} from "@mui/material";
import { useEffect } from "react";

const CollectionsWidget = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const collections = useSelector((state) => state.collections);
  const { palette } = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getCollections = async () => {
    const response = await fetch("http://localhost:5000/collections", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const resultCollection = await response.json();

    dispatch(setCollections({ resultCollection }));
  };

  useEffect(() => {
    getCollections();
  }, []);

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography
          variant="h2"
          color={palette.neutral.dark}
          fontWeight="500"
          align="center"
        >
          My Collections
        </Typography>
      </FlexBetween>

      <Divider sx={{ margin: "1.25rem 0" }} />

      <Box>
        {collections.map((e) => (
          <CollectionWidget key={e._id} collection={e} />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default CollectionsWidget;
