var loading_scene = cc.Scene.extend({
	
	init: function() {
        var self = this;
        cc.loader.load(welcom_resource,
            function (result, count, loadedCount) {
            }, 

            function () {
                self.init_loading_scene();
			}
		);

        return true;
    },

	init_loading_scene: function() {
		var layer = cc.LayerColor.create(cc.color(16, 128, 154, 255));
		this.addChild(layer);

		var ccs_json = ccs.load(welcome_res.loading_scene_json);
        layer.addChild(ccs_json.node);
        helper.adjust_anchor(ccs_json.node);

        var action = ccs_json.action.clone();
        action.gotoFrameAndPlay(0, 40, true);
        ccs_json.node.runAction(action);

        this.schedule(this._start_loading, 0.3);
	},

	_start_loading: function() {
        this.unschedule(this._start_loading);
        
        cc.loader.load(g_resources,
            function (result, count, loadedCount) {
                /*var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100);
                _silber.setPercent(percent);
                self._label.setString("Loading... " + percent + "%");*/
            }.bind(this), 

            function () {
                this.schedule(this._end_loading, 1.5);
            }.bind(this)
        );
    }, 

    _end_loading: function() {
        this.unschedule(this._end_loading);
        var scene = new game_scene();
        cc.director.runScene(scene);
    }, 
});
