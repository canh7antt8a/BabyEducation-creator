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
    },

    // use this for initialization
    onLoad: function () {
        var sun = cc.find("UI_ROOT/eva/anchor-center/sun");
        var r = cc.rotateBy(5, 360);
        var f = cc.repeatForever(r);
        sun.runAction(f);
    },
    
    start: function() {
        this.init_game_scene();
        this.start_game();
    },
    
    
    init_game_scene: function() {
        
        this.clound_ctrl = cc.find("UI_ROOT/eva/anchor-center/clound_ctrl");
        this.clound_ctrl.getChildByName("face").active = false;
        this.clound_ctrl.getChildByName("cloud_face").active = false;
        this.clound_ctrl.getChildByName("hello_icon").active = false;
        this.clound_ctrl.getChildByName("iam_here").active = false;
        // 197, 378
        this.clound_ctrl.x = 197;
        this.clound_ctrl.y = 378;
        
        this.g1 = cc.find("UI_ROOT/eva/anchor-center/g1");
        this.g1.active = false;
        this.g1.getChildByName("hello_icon").active = false;
        this.g1.getChildByName("iam_here").active = false;
        this.g1.getChildByName("qipao").active = false;
        
        this.g2 = cc.find("UI_ROOT/eva/anchor-center/g2");
        this.g2.active = false;
        this.g2.getChildByName("hello_icon").active = false;
        this.g2.getChildByName("iam_here").active = false;
        this.g2.getChildByName("qipao").active = false;
        
        this.g3 = cc.find("UI_ROOT/eva/anchor-center/g3");
        this.g3.active = false;
        this.g3.getChildByName("hello_icon").active = false;
        this.g3.getChildByName("iam_here").active = false;
        this.g3.getChildByName("qipao").active = false;
        
        this.g4 = cc.find("UI_ROOT/eva/anchor-center/g4");
        this.g4.active = false;
        this.g4.getChildByName("hello_icon").active = false;
        this.g4.getChildByName("iam_here").active = false;
        this.g4.getChildByName("qipao").active = false;
        
        this.g5 = cc.find("UI_ROOT/eva/anchor-center/g5");
        this.g5.active = false;
        this.g5.getChildByName("hello_icon").active = false;
        this.g5.getChildByName("iam_here").active = false;
        this.g5.getChildByName("qipao").active = false;
    }, 
    
    show_hello_icon: function(face, mode_value, ypos) {
        var index = Math.random();
        var face_icon;
        if (index >= 0.5) {
            index = 1;
            face_icon = face.getChildByName("hello_icon");
            face.getChildByName("iam_here").active = false;
            
            cc.audioEngine.stopMusic(false);
            var url = cc.url.raw("resources/sounds/hello.mp3");
            cc.audioEngine.playMusic(url, false);
        }
        else {
            index = 0;
            face_icon = face.getChildByName("iam_here");
            face.getChildByName("hello_icon").active = false;
            
            cc.audioEngine.stopMusic(false);
            var url = cc.url.raw("resources/sounds/iam_here.mp3");
            cc.audioEngine.playMusic(url, false);
        }
        
        face_icon.x = 0;
        face_icon.y = ypos;
        face_icon.scale = 0;
        face_icon.opacity = 255;
        face_icon.active = true;
        face_icon.runAction(cc.scaleTo(0.5, 1));
        
        var cloud_icon = face.getChildByName("qipao");
        // cloud_icon.active = true;
        face_icon.touched = false;
        face_icon.on(cc.Node.EventType.TOUCH_START, function(event){
            if(face_icon.touched === true)  {
                return;
            }
            face_icon.touched = true;
            event.stopPropagation();
            
            face_icon.stopAllActions();
            face_icon.runAction(cc.fadeOut(0.5));
            
            var w_x = 1200;
            var w_y = 900;
            var pos = face.convertToNodeSpace(cc.p(w_x, w_y));
            cloud_icon.active = true;
            cloud_icon.opacity = 0;
            cloud_icon.scale = 0;
            
            var func = cc.callFunc(function(){
                var seq = cc.sequence([cc.scaleTo(0.5, 1.1), cc.scaleTo(0.1, 1.0)]);
                this.clound_ctrl.runAction(seq);
                cloud_icon.active = false;
                cloud_icon.x = 0;
                cloud_icon.y = 0;
            }.bind(this), this);
            var seq = cc.sequence([cc.delayTime(1), cc.fadeIn(0.5), cc.moveTo(4, pos.x, pos.y), func]);
            cloud_icon.runAction(seq);
            
            var seq2 = cc.sequence([cc.delayTime(1.5), cc.scaleTo(0.5, 1)]);
            cloud_icon.runAction(seq2);
            
            this.enter_next_mode(mode_value);
        }.bind(this));
    },
    
    play_ground_rain: function(water, mode_value) {
        water.active = true;
        water.scaleY = 0;
        water.scaleX = 1;
        
        var func = cc.callFunc(function() {
            this.show_hello_icon(water, mode_value, 27);
        }.bind(this), this);
        var seq = cc.sequence([cc.scaleTo(0.5, 1, 1), func]);
        water.runAction(seq);
    },
    
    enter_next_mode: function(mode) {
        this.game_mode = mode;
        if(mode === 3) {
            this.play_ground_rain(this.g1, 4);
        }
        else if(mode === 4) {
            var f = cc.fadeOut(1);
            var seq = cc.sequence([cc.delayTime(0.5), f]);
            this.g1.getChildByName("shui").runAction(seq);
            
            // 地面上的水滴
            this.scheduleOnce(function() {
                this.play_ground_rain(this.g2, 5);
            }.bind(this), 1);
        }
        else if(mode === 5) {
            var f = cc.fadeOut(1);
            var seq = cc.sequence([cc.delayTime(0.5), f]);
            this.g2.getChildByName("shui").runAction(seq);
            
            // 地面上的水滴
            this.scheduleOnce(function() {
                this.play_ground_rain(this.g3, 6);
            }.bind(this), 1);
        }
        else if(mode === 6) {
            var f = cc.fadeOut(1);
            var seq = cc.sequence([cc.delayTime(0.5), f]);
            this.g3.getChildByName("shui").runAction(seq);
            
            // 地面上的水滴
            this.scheduleOnce(function() {
                this.play_ground_rain(this.g4, 7);
            }.bind(this), 1);
        }
        else if(mode === 7) {
            var f = cc.fadeOut(1);
            var seq = cc.sequence([cc.delayTime(0.5), f]);
            this.g4.getChildByName("shui").runAction(seq);
            
            this.scheduleOnce(function() {
                this.play_ground_rain(this.g5, 8);
            }.bind(this), 1);
        }
        else if(mode === 8) {
            var f = cc.fadeOut(1);
            var seq = cc.sequence([cc.delayTime(0.5), f]);
            this.g5.getChildByName("shui").runAction(seq);
            this.scheduleOnce(function() {
                this.clound_say_hello();
            }.bind(this), 6);
        }
    },
    
    on_replay_game: function() {
        cc.director.loadScene("game_scene");
    }, 
    
    show_checkout: function() {
        cc.find("UI_ROOT/checkout_root").active = true;
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw("resources/sounds/end.mp3");
        cc.audioEngine.playMusic(url, false);
    },
    
    
    clound_say_hello: function() {
        // 197, 378
        var m = cc.moveTo(1, -518, 378);
        var func = cc.callFunc(function(){
            this.clound_ctrl.getChildByName("face").active = true;
            this.clound_ctrl.getChildByName("cloud_face").active = true;
            
            var index = Math.random();
            var hello_icon;
            
            if (index >= 0.5) {
                index = 1;
                
                hello_icon = this.clound_ctrl.getChildByName("hello_icon");
                this.clound_ctrl.getChildByName("iam_here").active = false;
                
                cc.audioEngine.stopMusic(false);
                var url = cc.url.raw("resources/sounds/hello.mp3");
                cc.audioEngine.playMusic(url, false);
            }
            else {
                index = 0;
                hello_icon = this.clound_ctrl.getChildByName("iam_here");
                this.clound_ctrl.getChildByName("hello_icon").active = false;
                
                cc.audioEngine.stopMusic(false);
                var url = cc.url.raw("resources/sounds/iam_here.mp3");
                cc.audioEngine.playMusic(url, false);
            }
            
            // var hello_icon = this.clound_ctrl.getChildByName("hello_icon");
            hello_icon.active = true;
            hello_icon.x = 0;
            hello_icon.y = 0;
            hello_icon.scale = 0;
            hello_icon.runAction(cc.scaleTo(0.5, 1));
            hello_icon.runAction(cc.moveTo(0.5, 76, 10));
            hello_icon.touched = false;
            
            hello_icon.on(cc.Node.EventType.TOUCH_START, function(event){
                if(hello_icon.touched === true)  {
                    return;
                }
                hello_icon.touched = true;
                
                var func = cc.callFunc(function() {
                    this.clound_ctrl.runAction(cc.moveBy(5, -1000, 0));
                    this.show_checkout();
                }.bind(this), this);
                var seq = cc.sequence([cc.fadeOut(0.5), func]);
                hello_icon.runAction(seq);
            }.bind(this));
            
            
        }.bind(this), this);
        
        var seq = cc.sequence([m, func]);
        this.clound_ctrl.runAction(seq);
    },
    
    start_game: function() {
        this.game_mode = 0;
        this.enter_next_mode(3);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
