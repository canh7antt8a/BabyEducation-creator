cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        area: 280,
        base_time: 0.05,
        random_time: 0.1,
        
        rain_rotate: 260,
        v_speed: 100,
        life_cycle: 3,
        
        prefab_rain_point: cc.Prefab,
        play_onload: false,
    },

    // use this for initialization
    onLoad: function () {
        this.life_active = false;
        
        var clound = this.node.getChildByName("clound");
        
        clound.on(cc.Node.EventType.TOUCH_START, function(event){
            event.stopPropagation();
        }.bind(this));
        clound.on(cc.Node.EventType.TOUCH_MOVE, function(event){
            var pos = this.node.parent.convertToNodeSpaceAR(event.getLocation());
            this.node.x = pos.x;
            this.node.y = pos.y;
        }.bind(this));
        
        clound.on(cc.Node.EventType.TOUCH_END, function(event){
            
        }.bind(this));
        clound.on(cc.Node.EventType.TOUCH_CANCEL, function(event){
            
        }.bind(this));
    },
    
    start: function() {
        if(this.play_onload) {
            this.play();
        }
    },
    
    play: function() {
        this.life_active = true;
        this.now_index = 0;
        this.start_xpos = -this.area * 0.5;
        this.rain_play();
        
        /*cc.audioEngine.stopMusic(false);
        var url = cc.url.raw("resources/sounds/rain.mp3");
        cc.audioEngine.playMusic(url, true);*/
        
    },
    
    stop_rain: function() {
        this.life_active = false;
        // cc.audioEngine.stopMusic(false);
    },
    
    rain_play: function() {
        if(this.life_active === false) {
            return;
        }
        
        var xpos = (Math.random() - 0.5) * this.area;
        /*
        var num_per_line = 5;
        var delta = this.area / (num_per_line - 1);
        
        this.now_index = Math.random() * 5;
        this.now_index = Math.floor(this.now_index);
        if(this.now_index >= 5) {
            this.now_index = 0;
        }
        var xpos = this.start_xpos + this.now_index * delta;
        
        this.now_index ++;
        if(this.now_index >= 5) {
            this.now_index = 0;
        }*/
        
        var ypos = -67;
        
        var rain = cc.instantiate(this.prefab_rain_point);
        rain.parent = this.node;
        rain.x = xpos;
        rain.y = ypos;
        
        var vx = this.v_speed * Math.cos(this.rain_rotate * 3.14 / 180);
        var vy = this.v_speed * Math.sin(this.rain_rotate * 3.14 / 180);
        
        var sx = vx * this.life_cycle;
        var sy = vy * this.life_cycle;
        
        var m = cc.moveBy(this.life_cycle, sx, sy);
        var fout = cc.fadeOut(0.5);
        var func = cc.callFunc(function(){
            rain.removeFromParent();
        }.bind(this), this);
        var seq = cc.sequence([m, func]);
        var seq2 = cc.sequence([cc.delayTime(this.life_cycle * 0.75), fout]);
        rain.runAction(seq);
        rain.runAction(seq2);
        
        this.scheduleOnce(this.rain_play.bind(this), (this.base_time + Math.random() * this.random_time));
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
