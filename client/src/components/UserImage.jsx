import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={
          process.env.NODE_ENV === "production"
            ? `/uploads/${image}`
            : `http://localhost:5001/assets/${image}`
        }
      />
    </Box>
  );
};

export default UserImage;
