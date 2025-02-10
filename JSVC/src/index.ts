import { httpServer } from './service/apiService';
import './service/socketService';
import './service/fileMonitor';

// Get the port
const PORT = process.env.PORT || 3000;

// Start the server
httpServer.listen( PORT, () => {
    console.log( `Server running on http://localhost:${PORT}` );
});
