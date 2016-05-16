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
        over.setPosition(size.width / 2, size.height / 2);
        this.addChild(over);
        over.runAction(cc.sequence(cc.scaleTo(0.2, 2), cc.scaleTo(0.2, 0.5), cc.scaleTo(0.2, 1)));
        var start = new cc.MenuItemFont("再来一次", function () {
            cc.director.runScene(new cc.TransitionFade(1, new HelloWorldScene()));
        }, this);
        start.setPosition(over.getPositionX(), over.getPositionY() - over.height / 2 - 50);
        var menu = new cc.Menu(start);
        this.addChild(menu);
        menu.setPosition(0, 0);
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

