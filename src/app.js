var HelloWorldLayer = cc.Layer.extend({
    sprite: null,
    ctor: function () {
        this._super();
        var size = cc.winSize;
        var helloLabel = new cc.LabelTTF("贪吃蛇", "Arial", 38);
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2 + 200;
        this.addChild(helloLabel, 5);
        var start = new cc.MenuItemFont("开始游戏", function () {
            cc.director.runScene(new cc.TransitionFade(1, new GameScene()));
        }, this);
        var menu = new cc.Menu(start);
        this.addChild(menu);

        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

