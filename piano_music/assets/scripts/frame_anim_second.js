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
        
        frame_sprite: {
            default: [],
            type: cc.SpriteFrame,
        },
        frame_duration: 0,
        loop: false,
        play_on_load: false,
        play_on_load_with_random_time: false,
        random_time_scale: false
    },
    
    call_latter: function(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },
    
    // use this for initialization
    onLoad: function () {
        this.frames_sp=this.frame_sprite;
        this.frame_count = this.frame_sprite.length;
        
        /*
        for(var i = 0; i < this.frame_count; i ++) {
            var url = cc.url.raw(this.name_prefix + (this.name_begin_index + i) + ".png");
            var sp = new cc.SpriteFrame(url);
            this.frames_sp.push(sp);
        }*/
        
        
        this.sp_comp = this.node.getComponent(cc.Sprite);
        if(!this.sp_comp) {
            this.sp_comp = this.node.addComponent(cc.Sprite);    
        }
        this.sp_comp.spriteFrame = this.frames_sp[0].clone();
        
        this.now_index = 0;
        this.pass_time = 0;
        this.anim_ended = true;
        if(this.play_on_load) {
            if(this.play_on_load_with_random_time) {
                var time = 0.01 + Math.random();
                this.call_latter(function() {
                    this.anim_ended = false;
                }.bind(this), time);
            }
            else {
                this.anim_ended = false;
            }
            
        }
        
        if(this.random_time_scale) {
            var t_s = 1.0 + 0.5 * Math.random();
            this.frame_duration *= t_s;
        }
        this.anim_end_func = null;
    },
    
    start: function() {
        this.pass_time = 0;    
    },
    
    play: function(func) {
        this.pass_time = 0;
        this.anim_ended = false;
        this.anim_end_func = func;
        this.loop = false;
    },
    
    play_loop: function() {
        this.loop = true;
        this.pass_time = 0;
        this.anim_ended = false;
    },
    
    stop_anim: function() {
        this.anim_ended = true;    
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.anim_ended) {
            return;
        }
        this.pass_time += dt;
        var index = Math.floor(this.pass_time / this.frame_duration);
        
        if(this.loop) {
            if(this.now_index != index) {
                if(index >= this.frame_count) {
                    this.pass_time = 0;
                    this.sp_comp.spriteFrame = this.frames_sp[0].clone();
                    this.now_index = 0;
                }
                else {
                    this.sp_comp.spriteFrame = this.frames_sp[index].clone();
                    this.now_index = index;
                }
            }
        }
        else {
            if(this.now_index != index) {
                if(index >= this.frame_count) {
                    this.anim_ended = true;
                    if(this.anim_end_func) {
                        this.anim_end_func();
                    }
                }
                else {
                    this.now_index = index;
                    this.sp_comp.spriteFrame = this.frames_sp[index].clone();
                }
            }
        }
    },
});
