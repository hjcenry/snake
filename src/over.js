/**
 * Created by Henry on 16/5/14.
 */
var OverLayer = cc.Layer.extend({
    sprite: null,
    score: 0,
    ctor: function (score) {
        this._super();
        this.score = score;
        return true;
    },
    onEnter: function () {
        this._super();
        var size = cc.winSize;
        var over = new cc.LabelTTF("Game Over,你的分数是:" + this.score, "Arial", 38);
        over.x = size.width / 2;
        over.y = size.height / 2 + 200;
        this.addChild(over, 5);
        over.runAction(cc.sequence(cc.scaleTo(0.2, 2), cc.scaleTo(0.2, 0.5), cc.scaleTo(0.2, 1)));
        var start = new cc.MenuItemFont("再来一次", function () {
            cc.director.runScene(new cc.TransitionFade(1, new HelloWorldScene()));
        }, this);
        var menu = new cc.Menu(start);
        this.addChild(menu);
        return true;
    }
});

var OverScene = cc.Scene.extend({
    score: 0,
    ctor: function (score) {
        this._super();
        this.score = score;
        return true;
    },
    onEnter: function () {
        this._super();
        var layer = new OverLayer(this.score);
        this.addChild(layer);
    }
});

