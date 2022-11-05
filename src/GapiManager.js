class GapiManager {
  constructor() {
    this.apiConfig = {
      apiKey: "AIzaSyC-q4z98BSwQFWRFtmCopQZbmOcu01SnNI",
      clientId: "643125844926-j2b9rdmvu7fdrs981r9el3s67ae73ktp.apps.googleusercontent.com",
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
      scope: "https://www.googleapis.com/auth/drive.readonly",
    };
    window.addEventListener("listLoadDir", this.onListLoadDir.bind(this));
    this.loadGapi();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new GapiManager();
    }
    return this.instance;
  }

  onListLoadDir(event) {
    this.listFiles(event.detail.id);
  }

  loadGapi() {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      window.gapi.load("client", this.initGoogle.bind(this));
    };

    document.body.appendChild(script);
  }

  initGoogle() {
    console.log("Google loaded!");
    window.gapi.client.init(this.apiConfig).then(
      function () {
        this.listFiles();
      }.bind(this)
    );
  }

  signIn() {
    window.gapi.auth2.getAuthInstance().signIn();
  }

  getAuthHeaders() {
    let myToken = window.gapi.auth.getToken();
    return [
      {
        key: "Authorization",
        value: "Bearer " + myToken.access_token,
      },
    ];
  }

  getFileUrl(id) {
    return `https://www.googleapis.com/drive/v3/files/${id}?alt=media`;
  }

  listFiles(dirId) {
    const id = dirId || "root";

    const options = {
      pageSize: 500,
      includeItemsFromAllDrives: false,
      spaces: "drive",
      fields: "nextPageToken, files(id, name, mimeType, parents)",
      q: `'${id}' in parents`,
    };

    window.gapi.client.drive.files.list(options).then(function (response) {
      const files = response.result.files;
      if (files && files.length > 0) {
        const dirMimeType = "application/vnd.google-apps.folder";
        files.sort((a, b) => {
          const isDirA = a.mimeType === dirMimeType ? 1 : 0;
          const isDirB = b.mimeType === dirMimeType ? 1 : 0;
          return isDirB - isDirA;
        });

        const items = [];
        files.forEach((file) => {
          let isDir = file.mimeType === dirMimeType;
          items.push({
            id: file.id,
            name: file.name,
            isDir,
          });
        });

        const event = new CustomEvent("googleFileListLoad", {
          detail: { items },
        });
        window.dispatchEvent(event);
      }
    });
  }
}

export default GapiManager;
