
class PlayerManager {

  constructor() {
    if (typeof window.ChiptuneJsPlayer !== 'undefined') {
      this.player = new window.ChiptuneJsPlayer(new window.ChiptuneJsConfig(-1));
    } else {
      console.error('Could not initialize Chiptune Player');
    }
  }
  
  static getInstance() {
    if (!this.instance){
      this.instance = new PlayerManager()
   }
   return this.instance;
  }
  
}

export default PlayerManager;
