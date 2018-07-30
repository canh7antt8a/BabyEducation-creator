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
        
    },
    
    start: function() {
        this.init_game_scene();
        
        // this.start_game();
    },
    
    show_cloud_say_hello: function() {
        var face = this.rainer.getChildByName("cloud_face");
        face.active = true;
        
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
        face_icon.y = 0;
        face_icon.scale = 0;
        face_icon.opacity = 255;
        face_icon.runAction(cc.scaleTo(0.5, 1));
        face_icon.runAction(cc.moveTo(0.5, 229, 22));
        face_icon.touched = false;
        face_icon.on(cc.Node.EventType.TOUCH_START, function(event){
            if(face_icon.touched === true)  {
                return;
            }
            face_icon.touched = true;
            event.stopPropagation();
            face_icon.stopAllActions();
            face_icon.runAction(cc.fadeOut(0.5));
            face.active = false;
            this.enter_next_mode(1);
        }.bind(this));
    }, 
    
    hide_cloud_say_hello: function() {
        var face = this.rainer.getChildByName("cloud_face");
        face.active = false;
    }, 
    
    init_game_scene: function() {
        this.rainer = cc.find("UI_ROOT/snow/anchor-center/rainner");
        this.first_down_rain = cc.find("UI_ROOT/snow/anchor-center/down_shui1");
        this.first_down_rain.active = false;
        this.first_down_rain.getChildByName("hello_icon").active = false;
        this.first_down_rain.getChildByName("iam_here").active = false;
        
        this.sec_down_rain = cc.find("UI_ROOT/snow/anchor-center/down_shui2");
        this.sec_down_rain.active = false;
        this.sec_down_rain.getChildByName("hello_icon").active = false;
        this.sec_down_rain.getChildByName("iam_here").active = false;
        
        this.g1 = cc.find("UI_ROOT/snow/anchor-center/g1");
        this.g1.active = false;
        this.g1.getChildByName("hello_icon").active = false;
        this.g1.getChildByName("iam_here").active = false;
        
        this.g2 = cc.find("UI_ROOT/snow/anchor-center/g2");
        this.g2.active = false;
        this.g2.getChildByName("hello_icon").active = false;
        this.g2.getChildByName("iam_here").active = false;
        
        this.g3 = cc.find("UI_ROOT/snow/anchor-center/g3");
        this.g3.active = false;
        this.g3.getChildByName("hello_icon").active = false;
        this.g3.getChildByName("iam_here").active = false;
        
        this.g4 = cc.find("UI_ROOT/snow/anchor-center/g4");
        this.g4.active = false;
        this.g4.getChildByName("hello_icon").active = false;
        this.g4.getChildByName("iam_here").active = false;
        
        this.rainer.x = -1468;
        this.rainer.y = 380;    
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
        face_icon.touched = false; 
        face_icon.on(cc.Node.EventType.TOUCH_START, function(event){
            if(face_icon.touched === true)  {
                return;
            }
            face_icon.touched = true;    
            event.stopPropagation();
            face_icon.stopAllActions();
            face_icon.runAction(cc.fadeOut(0.5));
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
        if(mode === 1) { // 第一只雨滴跳出来
            this.first_down_rain.active = true;
            this.first_down_rain.scale = 0;
            this.first_down_rain.x = -395;
            this.first_down_rain.y = 369;
            this.first_down_rain.runAction(cc.scaleTo(1, 1));
            
            var func = cc.callFunc(function() {
                this.show_hello_icon(this.first_down_rain, 2, 0);
            }.bind(this), this);
            var seq = cc.sequence([cc.moveTo(1, -511, 76), func]);
            this.first_down_rain.runAction(seq);
        }
        else if(mode === 2) {
            var m = cc.moveTo(1, -624, -247);
            var f = cc.fadeOut(1);
            
            var seq = cc.sequence([cc.delayTime(0.5), m, f]);
            this.first_down_rain.runAction(seq);
            this.first_down_rain.runAction(cc.scaleTo(0.5, 0.5));
            
            this.scheduleOnce(function(){
                
                this.sec_down_rain.active = true;
                this.sec_down_rain.scale = 0;
                this.sec_down_rain.x = -43;
                this.sec_down_rain.y = 370;
                this.sec_down_rain.runAction(cc.scaleTo(1, 1));
                
                var func = cc.callFunc(function() {
                    this.show_hello_icon(this.sec_down_rain, 3, 0);
                }.bind(this), this);
                var seq = cc.sequence([cc.moveTo(1, -43, 76), func]);
                this.sec_down_rain.runAction(seq);
            }.bind(this), 1);
        }
        else if(mode === 3) {
            var m = cc.moveTo(1, -43, -247);
            var f = cc.fadeOut(1);
            
            var seq = cc.sequence([cc.delayTime(0.5), m, f]);
            this.sec_down_rain.runAction(seq);
            this.sec_down_rain.runAction(cc.scaleTo(0.5, 0.5));
            
            // 地面上的水滴
            this.scheduleOnce(function() {
                this.play_ground_rain(this.g1, 4);
            }.bind(this), 1);
        }
        else if(mode === 4) {
            var f = cc.fadeOut(1);
            var seq = cc.sequence([cc.delayTime(0.5), f]);
            this.g1.runAction(seq);
            
            // 地面上的水滴
            this.scheduleOnce(function() {
                this.play_ground_rain(this.g2, 5);
            }.bind(this), 1);
        }
        else if(mode === 5) {
            var f = cc.fadeOut(1);
            var seq = cc.sequence([cc.delayTime(0.5), f]);
            this.g2.runAction(seq);
            
            // 地面上的水滴
            this.scheduleOnce(function() {
                this.play_ground_rain(this.g3, 6);
            }.bind(this), 1);
        }
        else if(mode === 6) {
            var f = cc.fadeOut(1);
            var seq = cc.sequence([cc.delayTime(0.5), f]);
            this.g3.runAction(seq);
            
            // 地面上的水滴
            this.scheduleOnce(function() {
                this.play_ground_rain(this.g4, 7);
            }.bind(this), 1);
        }
        else if(mode === 7) {
            var f = cc.fadeOut(1);
            var seq = cc.sequence([cc.delayTime(0.5), f]);
            this.g4.runAction(seq);
            
            this.scheduleOnce(function() {
                 // 切换到下一个场景
                var scene = cc.find("UI_ROOT/eva");
                scene.active = true;
                var com = scene.getComponent("eva_scene");
                com.init_game_scene();
                com.start_game();
                this.node.active = false;
                // end
            }.bind(this), 1);
        }
    },
    
    start_game: function() {
        // -220, 380
        var m = cc.moveTo(1, -220, 380);
        var func = cc.callFunc(function(){
            var rainer_com = this.rainer.getComponent("rain_action");
            rainer_com.play();
            this.show_cloud_say_hello();
        }.bind(this), this);
        
        var seq = cc.sequence([m, func]);
        this.rainer.runAction(seq);
        this.game_mode = 0;
        this.hide_cloud_say_hello();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
