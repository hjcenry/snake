/**
 * Created by Henry on 16/5/14.
 */
var GameLayer = cc.Layer.extend({
    bodys: [],// snake body
    tail: null,// snake tail
    star: null,// star
    canNewBody: 0,// 0-无,1-有
    score: null,
    ctor: function () {
        this._super();
        this.bodys = [];
        this.canNewBody = 0;
        this.star = null;
        this.tail = null;
        this.score = null;
        return true;
    },
    onEnter: function () {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.touchbegan,
            onTouchMoved: this.touchmoved,
            onTouchEnded: this.touchended
        }, this);
        // 初始化一条蛇
        var head = new SnakeBody(null, 4);
        head.setPosition(300, 300);
        this.addChild(head);
        this.bodys.push(head);
        head.setTag(1);
        this.tail = head;
        for (var i = 0; i < 5; i++) {
            var node = new SnakeBody(this.tail, this.tail.direction);
            this.addChild(node);
            this.bodys.push(node);
            this.tail = node;
        }
        this.schedule(this.snakeMove, Constants.frequency);
        this.schedule(this.updateStar);
        // 分数控件
        var scoreName = new cc.LabelTTF("分数:", "", 30);
        scoreName.setPosition(scoreName.width / 2 + 10, cc.winSize.height - scoreName.height - 10);
        this.addChild(scoreName);
        this.score = new cc.LabelTTF("0", "", 30);
        this.score.setPosition(scoreName.getPositionX() + scoreName.width / 2 + 20, scoreName.getPositionY());
        this.addChild(this.score);
        return true;
    },
    updateStar: function () {
        if (this.star == null) {
            this.star = new cc.Sprite(res.bean);
            var randomX = Math.random() * (cc.winSize.width - this.star.width) + this.star.width;
            var randomY = Math.random() * (cc.winSize.height - this.star.width) + this.star.height;
            for (var index in this.bodys) {
                if (this.bodys[index].getPositionX() == randomX && this.bodys[index].getPositionY() == randomY) {
                    return;
                }
            }
            this.star.setPosition(randomX, randomY);
            this.addChild(this.star);
        }
    },
    // 点击转向
    touchbegan: function (touch, event) {
        var x = touch.getLocation().x;
        var y = touch.getLocation().y;
        var head = event.getCurrentTarget().getChildByTag(1);
        var headX = head.getPositionX();
        var headY = head.getPositionY();
        switch (head.direction) {
            case 1:// 上
            case 2:// 下
                if (x <= headX - Constants.errDistance) {// 转左
                    head.nextDirection = 3;
                } else if (x >= headX + Constants.errDistance) {// 转右
                    head.nextDirection = 4;
                }
                break;
            case 3:// 左
            case 4:// 右
                if (y <= headY - Constants.errDistance) {// 转下
                    head.nextDirection = 2;
                } else if (y >= headY + Constants.errDistance) {// 转上
                    head.nextDirection = 1;
                }
                break;
        }
        return true;
    },
    touchmoved: function () {
        return true;
    },
    touchended: function () {
        return true;
    },
    snakeMove: function () {
        for (var index in this.bodys) {
            if (!this.bodys[index].move(this)) {
                // 执行移动方法,移动失败,游戏结束
                this.unschedule(this.snakeMove);
                var overScene = new OverScene(Number(this.score.getString()));
                cc.director.runScene(new cc.TransitionFade(1, overScene));
            }
        }
        for (var index in this.bodys) {
            this.bodys[index].direction = this.bodys[index].nextDirection;
        }
        if (this.canNewBody == 1) {
            var node = new SnakeBody(this.tail, this.tail.direction);
            this.addChild(node);
            this.bodys.push(node);
            this.tail = node;
            this.canNewBody = 0;
        }
    }
});

var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});