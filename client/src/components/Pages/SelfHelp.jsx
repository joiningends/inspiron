import React from "react";
import { Grid, Paper, Typography, Button, Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const videos = [
  {
    title: "Negativity & dealing with Worry",
    link: "https://www.youtube.com/embed/gUnwb6mvZCg",
    description:
      "Counseling psychologist Sonakshi Mukherji talks about some important tools and techniques you can use to deal with constant worry about your health (and other things) during tough times.",
  },
  {
    title: "Coping Skills and Self Care",
    link: "https://www.youtube.com/embed/owxKnjX35hE",
    description:
      "Counseling psychologist Anikha S J talks about the importance of self-care and tips on how to practice it every day, to cope more effectively with negativity in your inner voice. She says that this has become even more critical as we deal with isolation in these tough times.",
  },
  {
    title: "Care for Caregivers",
    link: "https://www.youtube.com/embed/AuKHwjFWZAM",
    description:
      "Psychologist and entrepreneur Priyanka M B talks about caregivers burden and how we can ease it. As professional caregivers (doctors and nurses) find themselves in the news, it is critical to talk about family members who provide care, even as they face the highly likely scenario of testing positive themselves.",
  },
  {
    title: "Supporting your child during the pandemic.",
    link: "https://www.youtube.com/embed/lXFYrkQVG2I",
    description:
      "Psychologist Sucheta Das talks about how the pandemic has affected the functioning of children and the different steps that the parents can take to facilitate coping during the pandemic.",
  },
];

const podcasts = [
  {
    title: "Body Scan",
    link: "https://www.youtube.com/embed/tMDNa78lqdo",
    description:
      "Inspired by ancient wisdom that shows that our mind and our body are inextricably connected in our consciousness, this Body Scan exercise can help you relax anytime you feel overwhelmed.",
  },
  {
    title: "Self Care",
    link: "https://www.youtube.com/embed/b29SSHCQBnU",
    description:
      "Putting our own well-being can be tough when we are caring for others. This session with our psychologist reminds you to take care of yourself.",
  },
  {
    title: "5-4-3-2-1 Technique",
    link: "https://www.youtube.com/embed/vixDi7EZcLY",
    description:
      "An effective technique to help you relax when you feel anxious or disconnected from reality. This is presented by Psychologist Shivani Sakhrani.",
  },
  {
    title: "Affirmations",
    link: "https://www.youtube.com/embed/WtTklrDzBJI",
    description:
      "Psychologist Sonakshi Mukherji helps you deal with negativity and worry through a series of powerful affirmations.",
  },
];

const readableMaterialLinks = [
  {
    name: "Body Scan",
    link: "https://www.inspirononline.com/articles/body-scan",
  },
  {
    name: "Self Care",
    link: "https://www.inspirononline.com/articles/self-care",
  },
  {
    name: "5-4-3-2-1 Technique",
    link: "https://www.inspirononline.com/articles/5-4-3-2-1-technique",
  },
  {
    name: "Affirmations",
    link: "https://www.inspirononline.com/articles/affirmations",
  },
  {
    name: "Blogs",
    link: "https://www.inspirononline.com/articles/",
  },
  {
    name: "Circles of Control Article",
    link: "https://www.inspirononline.com/articles/",
  },
  {
    name: "Recognising Anxiety Triggers (with Worksheet)",
    link: "https://www.inspirononline.com/covid/recognizing-anxiety-triggers/",
  },
  {
    name: "Dealing with Negative Automatic Thoughts",
    link: "https://www.inspirononline.com/covid/deal-with-negative-thought/",
  },
  {
    name: "Anxiety First Aid: The 4Ds Technique",
    link: "https://www.inspirononline.com/covid/anxiety-first-aid-4ds-technique/",
  },
  {
    name: "Anxiety Coping Skills",
    link: "https://www.inspirononline.com/covid/coping-skills-anxiety/",
  },
  {
    name: "Grounding Techniques for Anxiety",
    link: "https://www.inspirononline.com/covid/grounding-techniques-anxiety/",
  },
  {
    name: "Forgive Yourself First",
    link: "https://www.inspirononline.com/covid/4rs-forgiveness/",
  },
  {
    name: "Build Your Social Support System",
    link: "https://www.inspirononline.com/covid/social-support-not-alone/",
  },
  {
    name: "Start a Gratitude Journal",
    link: "https://www.inspirononline.com/covid/gratitude-journal/",
  },
];

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
    fontWeightBold: 700,
  },
});

function ReadMoreButton({ link }) {
  return (
    <Button
      variant="contained"
      color="primary"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ width: "100%" }}
    >
      Read More
    </Button>
  );
}

function Section({ heading, children }) {
  return (
    <div
      style={{
        backgroundColor: "#f0f0f0",
        padding: "20px",
        marginBottom: "40px",
      }}
    >
      <ThemeProvider theme={theme}>
        <Typography
          variant="h4"
          style={{ marginBottom: "20px", textAlign: "center" }}
        >
          {heading}
        </Typography>
      </ThemeProvider>
      {children}
    </div>
  );
}

function SelfHelp() {
  return (
    <Container maxWidth="lg" style={{ marginTop: "40px" }}>
      <div>
        <ThemeProvider theme={theme}>
          <Typography
            variant="h3"
            style={{ marginBottom: "20px", textAlign: "center" }}
          >
            Self-Help Page
          </Typography>
        </ThemeProvider>

        <Section heading="Videos">
          <Grid container spacing={3}>
            {videos.map((video, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={3}
                  style={{
                    padding: "20px",
                    marginBottom: "20px",
                    height: "90%",
                  }}
                >
                  <iframe
                    title={`Video ${index}`}
                    width="100%"
                    height="120"
                    src={video.link}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                  <ThemeProvider theme={theme} style={{ margin: "10rem" }}>
                    <Typography variant="h6" style={{ margin: "10px 10px" }}>
                      {video.title}
                    </Typography>
                    <Typography variant="body2">{video.description}</Typography>
                  </ThemeProvider>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Section>

        <Section heading="Podcasts">
          <Grid container spacing={3}>
            {podcasts.map((podcast, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={3}
                  style={{
                    padding: "20px",
                    marginBottom: "20px",
                    height: "90%",
                  }}
                >
                  <iframe
                    title={`Podcast ${index}`}
                    width="100%"
                    height="200"
                    src={podcast.link}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                  <ThemeProvider theme={theme}>
                    <Typography variant="h6" style={{ margin: "10px 0" }}>
                      {podcast.title}
                    </Typography>
                    <Typography variant="body2">
                      {podcast.description}
                    </Typography>
                  </ThemeProvider>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Section>

        <Section heading="Readable Material">
          <Grid container spacing={3}>
            {readableMaterialLinks.map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={3}
                  style={{
                    padding: "20px",
                    marginBottom: "20px",
                    height: "80%",
                    textAlign: "center",
                  }}
                >
                  <ThemeProvider theme={theme}>
                    <Typography variant="h6" style={{ marginBottom: "10px" }}>
                      {item.name}
                    </Typography>
                  </ThemeProvider>
                  <ReadMoreButton link={item.link} />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Section>
      </div>
    </Container>
  );
}

export default SelfHelp;
