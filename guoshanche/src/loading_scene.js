
var loading_scene = cc.Scene.extend({
    init: function() {
        var self = this;
        cc.loader.load(welcom_resource,
            function (result, count, loadedCount) {
            }, function () {
                self.init_loading_scene_ui();
            });

        return true;
    },

    _play_loading_anim:function() {
        if (this.show_index == 0) {
            this.p1.setVisible(true);
        }
        else if(this.show_index == 1) {
            this.p2.setVisible(true);
        }
        else if(this.show_index == 2) {
            this.p3.setVisible(true);
        }
        else if(this.show_index == 3) {
            this.p1.setVisible(false);
            this.p2.setVisible(false);
            this.p3.setVisible(false);
        }
        this.show_index ++;
        if (this.show_index > 3) {
            this.show_index = 0;
        }
    }, 

    init_loading_scene_ui: function() {
         var layer = cc.Layer.create();
        this.addChild(layer);

        var mainscene = ccs.load(welcome_res.loading_scene_json);
        this.addChild(mainscene.node);
        this.p1 = ccui.helper.seekWidgetByName(mainscene.node, "load_p1");
        this.show_index = 0;

        this.p1.setVisible(false);
        this.p2 = ccui.helper.seekWidgetByName(mainscene.node, "load_p2");
        this.p2.setVisible(false);
        this.p3 = ccui.helper.seekWidgetByName(mainscene.node, "load_p3");
        this.p3.setVisible(false);

        this.schedule(this._play_loading_anim, 0.2);

        this.schedule(this._startLoading, 0.3);
    }, 

    _startLoading: function() {
        this.unschedule(this._startLoading);
        var self = this;
        cc.loader.load(g_resources,
            function (result, count, loadedCount) {
                /*var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100);
                _silber.setPercent(percent);
                self._label.setString("Loading... " + percent + "%");*/
            }, function () {
                // _silber.setPercent(100);
                self.schedule(self._endLoading, 1.5);
            });
    }, 

    _endLoading: function() {
        this.unschedule(this._play_loading_anim)
        this.unschedule(this._endLoading);
        cc.director.runScene(new main_scene());
    }, 

    onEnter:function () {
        this._super();
       
    },

    on_game_start: function() {
        cc.director.runScene(new game_scene());
    },

    on_resize: function() {
    },
});

