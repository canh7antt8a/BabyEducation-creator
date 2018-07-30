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
        this.sound_set = [
            "resources/sounds/kousao.mp3",
            "resources/sounds/zuqiu.mp3",
            "resources/sounds/shuben.mp3",
            "resources/sounds/qiang.mp3",
            "resources/sounds/yaokong.mp3",
            "resources/sounds/zhichuang.mp3",
            "resources/sounds/plane.mp3",
            "resources/sounds/luoshi.mp3"
        ];
    },
    
    call_latter: function(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },
    
    play_sound: function(name) {
        cc.audioEngine.stopMusic(true);
        var url = cc.url.raw(name);
        cc.audioEngine.playMusic(url, false);
    }, 
    
    play_click_anim: function(node, index, time) {
        var ske_com = node.getComponent(sp.Skeleton);
        ske_com.clearTracks();
        var name = this.sound_set[index - 1];
        this.play_sound(name);
        
        ske_com.setAnimation(0, "animation", false);
        this.call_latter(function() {
            node.opacity = 255;
            ske_com.clearTracks();
            ske_com.setAnimation(0, "idle", true);
        }.bind(this), time);
    }, 
    
    on_click_node_index: function(click_node, index, time) {
        var parent = click_node.getParent();
        this.play_click_anim(parent, index, time);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
