class Coin{
    
    constructor(value,x,y){
        this.value = value;
        this.x = x;
        this.y = y;
    }
    
    generate(){
        this.emitter = game.add.emitter(this.x,this.y,200);
        this.emitter.makeParticles('coin');
        this.emitter.start(false,200,2);
    }
    
}