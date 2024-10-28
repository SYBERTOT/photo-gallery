import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Box,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const PhotoGrid = () => {
  const [imageData, setImageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoreAvailable, setIsMoreAvailable] = useState(true);
  const loadMoreRef = useRef();
  const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
  const fetchImages = async (page) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("https://api.unsplash.com/photos", {
        params: { page, per_page: 12, client_id: accessKey },
      });
      setImageData((prev) => [...prev, ...data]);
      setIsMoreAvailable(data.length > 0);
    } catch (error) {
      console.error("Failed to load images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(currentPage);
  }, [currentPage]);

  // Intersection Observer to trigger loading more images
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && isMoreAvailable) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [isMoreAvailable]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Unsplash Photo Gallery
      </Typography>
      <Grid container spacing={3}>
        {imageData.map((image) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
            <Card>
              <Link to={`/photos/${image.id}`} style={{ textDecoration: "none" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={image.urls.thumb}
                  alt={image.alt_description}
                />
                <CardContent>
                  <Typography variant="subtitle1" align="center">
                    {image.user.name}
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
      {isLoading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}
      {!isMoreAvailable && (
        <Typography align="center" color="textSecondary" my={4}>
          No more photos to load.
        </Typography>
      )}
      <div ref={loadMoreRef} style={{ height: "1px" }}></div>
      <Button
        onClick={scrollToTop}
        variant="contained"
        color="primary"
        startIcon={<ArrowUpwardIcon />}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
          borderRadius: "50%",
          padding: "10px",
          minWidth: "unset",
          boxShadow: 2,
        }}
      />
    </Container>
  );
};

export default PhotoGrid;