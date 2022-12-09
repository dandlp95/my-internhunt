export const getApiRoot = () => {
    if(window.location.hostname.includes("heroku")) return "https://internhunt-backend.herokuapp.com"
    else return "http://localhost:8080"
}

/* DELETE THIS */

// "scripts": {
//     "start": "node --max_old_space_size=2560 node_modules/.bin/react-scripts start",
//     "build": "node --max_old_space_size=2560 node_modules/.bin/react-scripts build",
//     "test": "react-scripts test",
//     "eject": "react-scripts eject"
//   },