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
        this.tital = this.node.getChildByName("tital").getComponent(cc.Label);
        this.content = this.node.getChildByName("content").getComponent(cc.Label);
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        this.game_scene = cc.find("UI_ROOT").getComponent("game_scene");
    },
    
    
    show_card: function(tital, content, icon, sound_name) {
        sound_name = "resources/sounds/" + sound_name;
        var url_data = cc.url.raw(sound_name);
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(url_data);
        
        this.node.active = true;
        this.tital.string = tital;
        this.content.string = content;
        this.icon.spriteFrame = icon.clone();
        var size = this.icon.node.getContentSize();
        // console.log(size);
        this.icon.node.scale = 240 / size.width;
    },
    
    hide_card: function() {
        this.node.active = false;
        this.game_scene.hide_card();
    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
