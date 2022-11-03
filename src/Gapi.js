
class Gapi {

  constructor() {
    console.log("Gapi constructor()");
    this.apiConfig = {
      apiKey: 'AIzaSyC-q4z98BSwQFWRFtmCopQZbmOcu01SnNI',
      clientId: '643125844926-j2b9rdmvu7fdrs981r9el3s67ae73ktp.apps.googleusercontent.com',
      discoveryDocs:["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
      scope: 'https://www.googleapis.com/auth/drive.readonly',
    };
    window.addEventListener('listLoadDir', this.onListLoadDir.bind(this));
    this.loadGapi();
  }

  onListLoadDir(event) {
    console.log(event.detail);
    this.listFiles(event.detail.id);
  }


  static getInstance() {
    if (!this.instance){
      this.instance = new Gapi()
   }
   return this.instance;
  }

  loadGapi() {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";

    script.onload = () => {
      console.log('script load!');
      window.gapi.load('client', this.initGoogle.bind(this));
    };

    document.body.appendChild(script);
  }
  
  initGoogle() {
    console.log('Google loaded!');
    window.gapi.client.init(this.apiConfig)
      .then(function() {
      // 3. Initialize and make the API request.
      //console.log(window.gapi.auth2.getAuthInstance().isSignedIn.get());
      this.listFiles();
      
    }.bind(this));
  }

  signIn() {
    window.gapi.auth2.getAuthInstance().signIn();
  }

  getAuthHeaders() {
    let myToken = window.gapi.auth.getToken();
    return [{
      key: 'Authorization',
      value: 'Bearer ' + myToken.access_token
    }]
  }

  listFiles(id) {
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
              id: file.id,
              name: file.name,
              path,
              isDir
            });
          });

          //console.log(items);
          //callback(items);
          const event = new CustomEvent('googleFileListLoad', {detail: {items}});
          window.dispatchEvent(event);
          // const event = new CustomEvent('updatePlaylist', {detail: {
          //     items, 
          //     songClickCallback: songClickCallback.bind(this), 
          //     dirClickCallback: dirClickCallback.bind(this), 
          //     breadcrumbsClickCallback: this.breadcrumbsClickCallback.bind(this)}});
          // window.dispatchEvent(event);
        }
      });//.bind(this));
  }
}

export default Gapi;
