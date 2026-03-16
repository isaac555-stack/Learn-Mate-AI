import {
  Box,
  Typography,
  Stack,
  Link as MuiLink,
  Container,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => (
  <Box
    component="footer"
    sx={{
      py: 4,
      px: 2,
      mt: "auto",
      backgroundColor: (theme) => theme.palette.grey[100],
    }}
  >
    <Container maxWidth="lg">
      <Typography variant="body2" color="text.secondary" align="center">
        {"© "} {new Date().getFullYear()} PrepFlow AI — Built for Nigerian
        Students.
      </Typography>
      <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 1 }}>
        <MuiLink
          component={RouterLink}
          to="/legal"
          variant="body2"
          color="inherit"
          underline="hover"
        >
          Privacy Policy
        </MuiLink>
        <MuiLink
          component={RouterLink}
          to="/legal"
          variant="body2"
          color="inherit"
          underline="hover"
        >
          Terms of Service
        </MuiLink>
      </Stack>
    </Container>
  </Box>
);

export default Footer;
