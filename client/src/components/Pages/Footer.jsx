import React from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Link,
  IconButton,
} from "@material-ui/core";

import whiteFacebook from "./whiteFacebook.png";
import whiteInstagram from "./whiteInstagram.png";
import whiteLinkedIn from "./whiteLinkedin.png";
import whiteTwitter from "./whiteTwitterX.png";
import whiteYoutube from "./whiteYoutube.png";

export default function Footer() {
  const boldHeadingStyle = {
    color: "white",
    fontWeight: "bold",
  };

  return (
    <Paper
      square
      elevation={0}
      style={{
        backgroundColor: "#5179BD",
        color: "white",
        padding: "2rem",
        marginTop: "3rem",
      }}
    >
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom style={boldHeadingStyle}>
              Get connected with us on social networks:
            </Typography>
            <IconButton
              component={Link}
              href="https://www.facebook.com/inspirononline"
              color="inherit"
            >
              <img
                src={whiteFacebook}
                alt="Facebook"
                style={{ width: "24px", height: "24px" }}
              />
            </IconButton>
            <IconButton component={Link} href="#" color="inherit">
              <img
                src={whiteTwitter}
                alt="Twitter"
                style={{ width: "24px", height: "24px" }}
              />
            </IconButton>
            <IconButton
              component={Link}
              href="https://www.instagram.com/inspirononline/"
              color="inherit"
            >
              <img
                src={whiteInstagram}
                alt="Instagram"
                style={{ width: "24px", height: "24px" }}
              />
            </IconButton>
            <IconButton
              component={Link}
              href="https://www.linkedin.com/company/inspiron-psychological-well-being-center"
              color="inherit"
            >
              <img
                src={whiteLinkedIn}
                alt="LinkedIn"
                style={{ width: "24px", height: "24px" }}
              />
            </IconButton>
            <IconButton
              component={Link}
              href="https://www.youtube.com/channel/UCWlahlWLgmHSy_lrJkqShVg"
              color="inherit"
            >
              <img
                src={whiteYoutube}
                alt="YouTube"
                style={{ width: "24px", height: "24px" }}
              />
            </IconButton>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom style={boldHeadingStyle}>
              Useful links
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ color: "white" }}
            >
              <Link href="/" color="inherit">
                Home
              </Link>
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ color: "white" }}
            >
              <Link href="/assessment" color="inherit">
                Assessment
              </Link>
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ color: "white" }}
            >
              <Link href="/FindTherapist" color="inherit">
                Find Therapist
              </Link>
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ color: "white" }}
            >
              <Link href="/Profile" color="inherit">
                Profile
              </Link>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom style={boldHeadingStyle}>
              Links
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ color: "white" }}
            >
              <Link
                href="https://www.inspirononline.com/privacy-policy/"
                color="inherit"
              >
                Privacy Policy
              </Link>
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ color: "white" }}
            >
              <Link
                href="https://www.inspirononline.com/terms/"
                color="inherit"
              >
                Terms and Conditions
              </Link>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom style={boldHeadingStyle}>
              Contact
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ color: "white" }}
            >
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ color: "white", marginBottom: "0.5rem" }}
              >
                <Link href="#" color="inherit">
                  Indiranagar #72, 4th Main Road, Domlur, 2nd Stage,
                  Indiranagar, Bangalore, Karnataka, India 560 071 +91
                  9845676442
                </Link>
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ color: "white" }}
              >
                <Link href="#" color="inherit"> +91 9845140442
                </Link>
              </Typography>
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              style={{ marginTop: "2rem", color: "white" }}
            >
              © 2023 Copyright Inspiron:
              <Link
                color="inherit"
                variant="body2"
                style={{ fontWeight: "bold", color: "white" }}
                href="https://www.joiningends.in/"
              >
                Designed and Developed by JoiningEnds
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}
