import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";


import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Box,
  Modal,
  IconButton,
  Avatar,
  Tooltip,
  Paper,

} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";

const UserDashboard = () => {
  const { token } = useContext(AppContext);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchIssuedBooks = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:5000/api/user/issued-books",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIssuedBooks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchIssuedBooks();
  }, [token]);

  const handleOpen = (pdf_path) => {
    if (pdf_path) {
      const url = `http://127.0.0.1:5000/public/${pdf_path}`;
      setPdfUrl(url);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setPdfUrl("");
    setOpen(false);
  };

  const handleDownload = () => {
    if (!pdfUrl) {
      console.error("No PDF URL provided");
      return;
    }
  
    const link = document.createElement("a");
    link.href = pdfUrl;
  
    // Set the file name for the download
    link.download = pdfUrl.split("/").pop() || "document.pdf";
  
    // Append to the document and trigger the download
    document.body.appendChild(link);
    link.click();
  
    // Clean up the DOM
    document.body.removeChild(link);
  };
  

  return (
    <Container sx={{ py: 5 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
      >
        Your Issued Books
      </Typography>

      {issuedBooks.length === 0 ? (
        <Typography variant="h6" color="textSecondary" textAlign="center">
          No books issued to view
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {issuedBooks.map((book, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 4,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      alt="Book Cover"
                      src={`http://127.0.0.1:5000/public/${book.cover_path}`}
                      variant="square"
                      sx={{
                        width: 80,
                        height: 100,
                        marginRight: 2,
                        borderRadius: 2,
                      }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {book.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Author: {book.authors.join(", ")}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Category: {book.section}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between" }}>
                  <Tooltip title="View PDF">
                    <span>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={() => handleOpen(book.pdf_path)}
                        disabled={!book.pdf_path}
                        sx={{
                          textTransform: "none",
                        }}
                      >
                        View
                      </Button>
                    </span>
                  </Tooltip>
                  {/* <Tooltip title="Download PDF">
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload()}
                      disabled={!book.pdf_path}
                      sx={{
                        textTransform: "none",
                      }}
                    >
                      Download
                    </Button>
                  </Tooltip> */}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="pdf-modal"
        aria-describedby="pdf-viewer"
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            overflow: "hidden",
            maxHeight: "90%",
            borderRadius: 2,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">PDF Viewer</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              height: "70vh",
              border: "1px solid #ccc",
              overflow: "hidden",
              borderRadius: 2,
            }}
          >
            <iframe
              src={pdfUrl}
              title="PDF Viewer"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            ></iframe>
          </Box>
          {/* <Box textAlign="right" mt={2}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              disabled={!pdfUrl}
            >
              Download PDF
            </Button>
          </Box> */}
        </Paper>
      </Modal>
    </Container>
  );
};

export default UserDashboard;
