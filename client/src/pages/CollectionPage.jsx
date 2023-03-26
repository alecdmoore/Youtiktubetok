import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Divider, useMediaQuery } from "@mui/material";
import UserWidget from "../widgets/UserWidget";
import CreatePostWidget from "../widgets/CreatePostWidget";
import { useState } from "react";
import PostsWidget from "../widgets/PostsWidget";
import MembersWidget from "../widgets/MembersWidget";

const CollectionPage = () => {
  let { collectionId } = useParams();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const collections = useSelector((state) => state.collections);
  const [currentCollection, setCurrentCollection] = useState(
    collections.find((col) => col._id === collectionId)
  );

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <Box>
            <CreatePostWidget
              picturePath={picturePath}
              collectionId={collectionId}
            />
          </Box>
          <Box>
            <h1>Collection Page {currentCollection.title}</h1>
            <Divider sx={{ margin: "1.25rem 0" }} />
            <PostsWidget />
          </Box>
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            {/* <AdvertWidget /> */}
            <MembersWidget currentCollection={currentCollection} />
            <Box m="2rem 0" />
            {/* <FriendListWidget userId={_id} /> */}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CollectionPage;
