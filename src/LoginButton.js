
import Button from '@mui/material/Button';
import { useState } from 'react';

function LoginButton(properties) {
  const [functionInitialized, setFunctionInitialized] = useState(false);
  const apiConfig = {
      apiKey: 'AIzaSyC-q4z98BSwQFWRFtmCopQZbmOcu01SnNI',
      clientId: '643125844926-j2b9rdmvu7fdrs981r9el3s67ae73ktp.apps.googleusercontent.com',
      discoveryDocs:["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
      scope: 'https://www.googleapis.com/auth/drive.readonly',
  };

  const constructor = () => {
    if (functionInitialized) { 
      return; 
    }
    console.log("Inline constructor()");
    loadGapi();
    setFunctionInitialized(true);
  };

  constructor();

  function loadGapi() {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";

    script.onload = () => {
      console.log('script load!');
      window.gapi.load('client', initGoogle);
    };

    document.body.appendChild(script);
  }
  
  const initGoogle = () => {
    console.log('Google loaded!');
    window.gapi.client.init(apiConfig)
      .then(function() {
      // 3. Initialize and make the API request.
      //console.log(window.gapi.auth2.getAuthInstance().isSignedIn.get());
      listFiles();
    });
  }

  function listFiles(id) {
    if (!id) {
      id = 'root';
    }
    const options = {
      'pageSize': 500,
      'includeItemsFromAllDrives': false,
      'spaces': 'drive',
      'fields': "nextPageToken, files(id, name, mimeType, parents)",
      'q': `'${id}' in parents`
    };
  
    window.gapi.client.drive.files.list(options)
      .then(function (response) {
        var files = response.result.files;
        if (files && files.length > 0) {
          const dirMimeType ='application/vnd.google-apps.folder';
          files.sort((a, b) => {
            const isDirA = a.mimeType === dirMimeType ? 1 : 0;
            const isDirB = b.mimeType === dirMimeType ? 1 : 0;
            return isDirB - isDirA;
          });
  
          const items = [];
          files.forEach((file) => {
            let path = '';
            let isDir = false;
            if (file.mimeType === dirMimeType) {
              path = file.id;
              isDir = true;
            } else {
              path = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;            
            }
            items.push({
              name: file.name,
              path,
              isDir
            });
          });

          //--New
          const list = {
            id: 'root',
            name: 'Parent',
            children: []
          };
          files.forEach((file) => {
            let path = '';
            let isDir = false;
            if (file.mimeType === dirMimeType) {
              path = file.id;
              isDir = true;
            } else {
              path = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;            
            }
            
            const children = isDir ? [] : null;
            list.children.push({
              id: path,
              name: file.name,
              path,
              children
            });
          });

          //console.log(items);
          properties.onDirLoad(list);
          // const event = new CustomEvent('updatePlaylist', {detail: {
          //     items, 
          //     songClickCallback: songClickCallback.bind(this), 
          //     dirClickCallback: dirClickCallback.bind(this), 
          //     breadcrumbsClickCallback: this.breadcrumbsClickCallback.bind(this)}});
          // window.dispatchEvent(event);
        }
      }.bind(this));
  }

  const signIn = () => {
    window.gapi.auth2.getAuthInstance().signIn();
  }

  return (
    <Button variant="contained" onClick={signIn}>Google Drive Login</Button>
  );
}

export default LoginButton;
