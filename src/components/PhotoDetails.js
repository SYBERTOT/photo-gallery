import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { Container, Card, CardMedia, CardContent, Typography, Button, CircularProgress } from "@mui/material";

const PhotoDetails = () => {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchPhotoDetails();
  }, [fetchPhotoDetails]);

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
