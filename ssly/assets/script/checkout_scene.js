var GAME_DATA = require("game_data");

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
        
        var tip = cc.find("Canvas/anchor-center/tip_icon");
        if(GAME_DATA.IS_ADVANCE !== 0) {
            tip.active = true;
        }
        else {
            tip.active = false;
        }
        var best_label = cc.find("Canvas/anchor-center/best_label");
        best_label = best_label.getComponent(cc.Label);
        best_label.string = "" + GAME_DATA.GAME_BEST;
        console.log(best_label);
        
        var score_label = cc.find("Canvas/anchor-center/score_label");
        score_label = score_label.getComponent(cc.Label);
        score_label.string = "" + GAME_DATA.GAME_SCORE;
        console.log(score_label);
        
        var min_label = cc.find("Canvas/anchor-rb/min_score_label");
        min_label = min_label.getComponent(cc.Label);
        min_label.string = "" + GAME_DATA.GAME_SCORE;
        console.log(min_label);
    },
    
    on_restart: function() {
        cc.director.loadScene("game_scene");
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
