import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  ThemeProvider,
  createTheme,
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3', // Change this to your desired primary color
    },
    secondary: {
      main: '#FF5722', // Change this to your desired secondary color
    },
    background: {
      default: '#F0F0F0', // Change this to your desired background color
    },
  },
});

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostComments, setSelectedPostComments] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteQueue, setDeleteQueue] = useState(
    JSON.parse(localStorage.getItem('deleteQueue')) || []
  );

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts: ', error));
  }, []);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsDialogOpen(true);

    fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`)
      .then((response) => response.json())
      .then((data) => setSelectedPostComments(data))
      .catch((error) => console.error('Error fetching comments: ', error));
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleDeletePost = (postId) => {
    // Queue up the delete request
    const updatedQueue = [...deleteQueue, postId];
    setDeleteQueue(updatedQueue);

    // Save the updated delete queue to localStorage
    localStorage.setItem('deleteQueue', JSON.stringify(updatedQueue));

    // Update the UI (you may want to show an indicator for the queued delete)
  };

  // Handle the click of the Refresh State button
  const handleRefreshStateClick = () => {
    // Clear the local state
    setSearchTerm('');
    setDeleteQueue([]);

    // Fetch data from the API and set it to 'posts' state
    // ...

    // Clear the delete queue
    setDeleteQueue([]);

    // Remove the delete queue and search term from localStorage
    localStorage.removeItem('deleteQueue');
    localStorage.removeItem('searchTerm');
  };

  const postCards = posts
    .filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((post) => (
      <Card key={post.id} className="card">
        <CardContent className="cardContent">
          <Typography variant="h6">{post.title}</Typography>
          <Typography>{post.body}</Typography>
        </CardContent>
        <CardActions>
          <Button onClick={() => handlePostClick(post)}>View Comments</Button>
          <IconButton onClick={() => handleDeletePost(post.id)}>Delete</IconButton>
        </CardActions>
      </Card>
    ));

  return (
    <ThemeProvider theme={theme}>
      <div className="root">
        <header className="header">Post Management</header> {/* Header */}
        <TextField
          className="searchInput"
          type="text"
          label="Search Posts"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleRefreshStateClick}
        >
          Refresh State
        </Button>
        {postCards}
        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          className="dialog"
        >
          {selectedPost && (
            <>
              <DialogTitle>{selectedPost.title} Comments</DialogTitle>
              <DialogContent>
                {selectedPostComments.map((comment) => (
                  <DialogContentText key={comment.id}>
                    <strong>{comment.name}:</strong> {comment.body}
                  </DialogContentText>
                ))}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
        <footer className="footer">Done by Samraj</footer> {/* Footer */}
      </div>
    </ThemeProvider>
  );
}

export default App;
