class Coin{
    
    constructor(value,x,y){
        this.value = value;
        this.x = x;
        this.y = y;
        this.sprite = game.add.sprite('coin',x,y);
        this.sprite.alpha = 100;
        this.sprite.anchor.set(0.5, 0.5);
    }
    
    generate(){
        this.sprite.alpha = 0;
        
    }
    
    destoryEmitter(){
        this.emitter.destory();
    }
}