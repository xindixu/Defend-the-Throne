class Coin{
    
    constructor(value,x,y){
        this.value = value;
        this.x = x;
        this.y = y;
        this.emitter = game.add.emitter(this.x,this.y,200);
        this.emitter.makeParticles('coin');
        this.emitter.gravity = 200;
    }
    
    generate(){
        this.emitter.start(false,200,2);
        game.time.events(2000,this.destoryEmitter,this);
        
    }
    
    destoryEmitter(){
        this.emitter.destory();
    }
}