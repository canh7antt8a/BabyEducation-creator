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
        cloud_prefab: cc.Prefab,
        CLOUD_G: 10
    },

    // use this for initialization
    onLoad: function () {
        this.node.removeAllChildren();
        this.clound_set = [];
        this.play();
    },
    
    emite_clound: function() {
        var cloud = cc.instantiate(this.cloud_prefab);
        cloud.parent = this.node;
        this.clound_set.push(cloud);
        
        var callfunc = cc.callFunc(function(){
            var index = this.clound_set.indexOf(cloud);
            if (index > -1) {
                this.clound_set.splice(index, 1);
            }
            cloud.removeFromParent();
        }.bind(this), this);
        
        var seq = cc.sequence([cc.moveTo(5, -19, 420), callfunc]);
        cloud.runAction(seq);
        cloud.scale = 0;
        cloud.runAction(cc.scaleTo(0.5, 1));
        
        this.scheduleOnce(this.emite_clound.bind(this), Math.random() + 1);
    },
    
    add_win: function() {
        for(var i = 0; i < this.clound_set.length; i ++) {
            var com = this.clound_set[i].getComponent("smoke_move");
            com.add_win();
        }
    }, 
    
    play: function(){
        this.scheduleOnce(this.emite_clound.bind(this), 1);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
