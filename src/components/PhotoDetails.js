import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { Container, Card, CardMedia, CardContent, Typography, Button, CircularProgress } from "@mui/material";

const PhotoDetails = () => {
  // Get the photo ID from the URL parameters
  const { id } = useParams();
  // State to store the photo details
  const [photo, setPhoto] = useState(null);
  // State to manage loading state
  const [loading, setLoading] = useState(true);
  // Access key for Unsplash API
  const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
  // Hook to navigate back to the previous page
  const navigate = useNavigate();

  // Function to fetch photo details from Unsplash API
  const fetchPhotoDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.unsplash.com/photos/${id}`, {
        params: { client_id: accessKey },
      });
      setPhoto(response.data);
    } catch (error) {
      console.error("Error fetching photo details:", error);
    } finally {
      setLoading(false);
    }
  }, [id, accessKey]);

  // Fetch photo details when the component mounts or the ID changes
  useEffect(() => {
    fetchPhotoDetails();
  }, [fetchPhotoDetails]);

  // Component to display photo information
  const PhotoInfo = ({ photo }) => (
    <Card>
      <CardMedia component="img" image={photo.urls.full} alt={photo.alt_description || "Photo"} />
      <CardContent>
        <Typography variant="h5">{photo.title || "No title available"}</Typography>
        <Typography variant="subtitle1">
          <strong>By:</strong> {photo.user.name}
        </Typography>
        <Typography variant="body1">
          <strong>Description:</strong> {photo.description || "No description available"}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container>
      {/* Button to navigate back to the previous page */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(-1)}
        style={{ display: "block", margin: "20px auto" }}
      >
        Go Back
      </Button>
      <Typography variant="h4" align="center" gutterBottom>
        Detail of Photo
      </Typography>
      {/* Show loading spinner while fetching data */}
      {loading ? (
        <CircularProgress style={{ display: "block", margin: "20px auto" }} />
      ) : photo ? (
        <PhotoInfo photo={photo} />
      ) : (
        <Typography color="error" align="center">
          Failed to load photo details.
        </Typography>
      )}
    </Container>
  );
};

export default PhotoDetails;
