import { Box } from '@mui/material';
import FileSystemComponent from "./components/FileSystemComponent.tsx";

const App = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
     justifyContent="center"
      sx={{ bgcolor: '#00256A', height: '100vh', width: '100vw' }}>
      <FileSystemComponent />
    </Box>
  );
};

export default App;
