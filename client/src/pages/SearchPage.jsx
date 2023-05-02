import React, { useEffect, useState } from "react";
import { Box, Divider, useMediaQuery } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MemberWidget from "../widgets/MemberWidget";

import WidgetWrapper from "../components/WidgetWrapper";

const SearchPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  let { value } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const handleSearch = async () => {
      const response = await fetch(`http://localhost:5000/search/${value}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      setResults(result);
    };

    handleSearch();
  }, []);
  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="center"
      >
        <Box
          // flexBasis={isNonMobileScreens ? "70%" : undefined}
          width={isNonMobileScreens ? "50%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <h1>Middle</h1>
          <Divider sx={{ margin: "1.25rem 0 1.25rem 0" }} />
          <WidgetWrapper>
            {results.map((person) => (
              <MemberWidget
                key={person._id}
                member={person}
                user={user}
                addRemove={true}
              />
            ))}
          </WidgetWrapper>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchPage;
