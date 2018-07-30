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
        this.lock_dst = cc.find("UI_ROOT/camera_root/map_root/exit_click");
        this.img = this.node.getChildByName("img");
        this.player = cc.find("UI_ROOT/camera_root/plane");
        this.camera = cc.find("UI_ROOT/camera_root");
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        
        var w_pos = this.lock_dst.convertToWorldSpaceAR(cc.p(0, 0));
        var w_pos2 = this.player.convertToWorldSpaceAR(cc.p(0, 0));
        var rt_w_pos = cc.p(1920, 0);
        if(w_pos.x < 1920) {
            rt_w_pos.x = w_pos.x; 
        }
        
        var dir = cc.pSub(w_pos, w_pos2);
        var r = Math.atan2(dir.y, dir.x);
        
        var w_xpos = w_pos2.x;
        var w_ypos = w_pos2.y;
        
        if(w_pos.x < 0 || w_pos.x > 1920 || w_pos.y < 0 || w_pos.y > 1080) {
            this.img.active = true;
            // if (Math.abs(dir.y) * 16 < Math.abs(dir.x)*9) {
            if (1) {
                console.log("using x");
                w_xpos = rt_w_pos.x;
                if (Math.abs(dir.x) <= 0.001) {
                    w_ypos = w_pos2.y;
                }
                else {
                    w_ypos = (dir.y * (w_xpos - w_pos2.x)) / dir.x + w_pos2.y;    
                }    
            } 
            else {
                console.log("using y");
                w_ypos = rt_w_pos.y;
                if(Math.abs(dir.y) <= 0.001) {
                    w_xpos = w_pos2.x;    
                }
                else {
                    w_xpos = (dir.x * (w_ypos - w_pos2.y)) / dir.y + w_pos2.x;    
                }
            }
        }
        else {
            this.img.active = false;
        }
        
        
        var degree = 180 * r / 3.14159;
        degree = 360 - degree - 90 - 180;
        this.img.rotation = degree;
        
     
        if (w_xpos >= 1920) {
            w_xpos = 1920;
        }
        if (w_xpos < 0) {
            w_xpos = 0;
        }
        
        if(w_ypos >= 1080) {
            w_ypos = 1080;
        }
        if (w_ypos < 0) {
            w_ypos = 0;
        }
        
        
        dir = cc.pSub(w_pos2, cc.p(w_xpos, w_ypos));
        var pos = this.node.parent.convertToNodeSpaceAR(cc.p(w_xpos + 70 * dir.x / dir.mag(), w_ypos + 70* dir.y / dir.mag()));
        // var pos = this.node.parent.convertToNodeSpaceAR(cc.p(w_xpos, w_ypos));
        if(Math.abs(this.node.x - pos.x)>50) {
            console.log(w_xpos, w_ypos, w_pos2, w_pos, this.lock_dst.getPosition(), this.node.getPosition());
        }
        this.node.x = pos.x;
        this.node.y = pos.y;

    },
});
