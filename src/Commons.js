
class Commons {

  static getInstance() {
    if (!this.instance){
      this.instance = new Commons()
   }
   return this.instance;
  }

  setPlayer(player) {
    this.player = player;
  }

  getPlayer() {
    return this.player;
  }

}

export default Commons;
