import React, { useState, useEffect } from "react";
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

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Fetch current year on component mount
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

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
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={whiteFacebook}
                alt="Facebook"
                style={{ width: "24px", height: "24px" }}
              />
            </IconButton>
            <IconButton
              component={Link}
              href="#"
              color="inherit"
              target="_blank"
              rel="noopener noreferrer"
            >
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
              target="_blank"
              rel="noopener noreferrer"
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
              target="_blank"
              rel="noopener noreferrer"
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
              target="_blank"
              rel="noopener noreferrer"
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
              <Link
                href="/"
                color="inherit"
                target="_blank"
                rel="noopener noreferrer"
              >
                Home
              </Link>
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ color: "white" }}
            >
              <Link
                href="/assessment"
                color="inherit"
                target="_blank"
                rel="noopener noreferrer"
              >
                Assessment
              </Link>
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ color: "white" }}
            >
              <Link
                href="/FindTherapist"
                color="inherit"
                target="_blank"
                rel="noopener noreferrer"
              >
                Find Therapist
              </Link>
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ color: "white" }}
            >
              <Link
                href="/Profile"
                color="inherit"
                target="_blank"
                rel="noopener noreferrer"
              >
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
                target="_blank"
                rel="noopener noreferrer"
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
                target="_blank"
                rel="noopener noreferrer"
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
                <Link
                  href="https://www.google.com/maps?s=web&sca_esv=596768218&lqi=ChJpbnNwaXJvbiBiYW5nYWxvcmVI9O720KGugIAIWiIQABABGAAYASISaW5zcGlyb24gYmFuZ2Fsb3JlKgQIAhAAkgEVbWVudGFsX2hlYWx0aF9zZXJ2aWNlmgEkQ2hkRFNVaE5NRzluUzBWSlEwRm5TVU5oYkdSeVduaFJSUkFCqgE7EAEyHxABIhu2snHa3evo4X_02BDP7pYi24vLMPNqQvFId40yFhACIhJpbnNwaXJvbiBiYW5nYWxvcmU&vet=12ahUKEwjjtKq1_s-DAxVC4jgGHZLgBd0Q1YkKegQIOhAB..i&cs=1&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KY_-Y1epFq47MSRV-2xImldR&daddr=72,+4th+Main+Rd,+BDA+Colony,+Domlur+Village,+Domlur,+Bengaluru,+Karnataka+560071"
                  color="inherit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Indiranagar #72, 4th Main Road, Domlur, 2nd Stage,
                  Indiranagar, Bangalore, Karnataka, India 560 071
                </Link>
                <Link
                  href="https://wa.me/+919845676442"
                  color="inherit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <br />
                  +91 9845676442
                </Link>
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ color: "white" }}
              >
                <Link
                  href="https://www.google.com/maps/dir//36,+14th+Main+Rd,+IAS+Colony,+Sector+4,+HSR+Layout,+Bengaluru,+Karnataka+560102/@12.9133903,77.5561339,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3bae15db464281a9:0xed5ee3892b69d264!2m2!1d77.6385358!2d12.9134032?entry=ttu"
                  color="inherit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  HSR Center #36, 14th Main Road, IAS Colony, Sector 4, HSR
                  Layout, Bengaluru, Karnataka 560102
                </Link>
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ color: "white" }}
              >
                <Link
                  href="https://wa.me/+919845140442"
                  color="inherit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +91 9845140442
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
              © {currentYear} Copyright Inspiron:
              <Link
                color="inherit"
                variant="body2"
                style={{ fontWeight: "bold", color: "white" }}
                href="https://www.joiningends.in/"
                target="_blank"
                rel="noopener noreferrer"
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
