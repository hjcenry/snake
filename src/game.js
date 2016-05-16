/**
 * Created by Henry on 16/5/14.
 */
var GameLayer = cc.Layer.extend({
    bodys: [],// snake body
    tail: null,// snake tail
    star: null,// star
    canNewBody: 0,// 0-无,1-有
    score: null,// 分数Label
    ctor: function () {
        // 初始化全局参数
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
        // 添加屏幕触摸事件
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.touchbegan,
            onTouchMoved: this.touchmoved,
            onTouchEnded: this.touchended
        }, this);
        // 初始化一条蛇
        // 初始化头部
        var head = new SnakeBody(null, 4);
        head.setPosition(300, 300);
        this.addChild(head);
        this.bodys.push(head);
        head.setTag(1);
        this.tail = head;
        // 循环添加5个身体
        for (var i = 0; i < 5; i++) {
            var node = new SnakeBody(this.tail, this.tail.direction);
            this.addChild(node);
            this.bodys.push(node);
            this.tail = node;
        }
        // 蛇移动的定时任务
        this.schedule(this.snakeMove, Constants.frequency);
        // 更新屏幕吃的金豆的定时任务
        this.schedule(this.updateStar);
        // 分数
        var scoreName = new cc.LabelTTF("分数:", "", 30);
        scoreName.setPosition(scoreName.width / 2 + 10, cc.winSize.height - scoreName.height - 10);
        this.addChild(scoreName);
        // 分数Label
        this.score = new cc.LabelTTF("0", "", 30);
        this.score.setPosition(scoreName.getPositionX() + scoreName.width / 2 + 20, scoreName.getPositionY());
        this.addChild(this.score);
        return true;
    },
    // 更新星星
    updateStar: function () {
        if (this.star == null) {
            this.star = new cc.Sprite(res.bean);
            var randomX = Math.random() * (cc.winSize.width - this.star.width) + this.star.width;
            var randomY = Math.random() * (cc.winSize.height - this.star.width) + this.star.height;
            this.star.setPosition(randomX, randomY);
            this.addChild(this.star);
            // 产生的星星只要在屏幕外,或与蛇的身体部分重叠,则本次任务不产生
            if ((randomX > cc.winSize.width - this.star.width / 2)
                || (randomX < this.star.width / 2)
                || (randomY > cc.winSize.height - this.star.height / 2)
                || (randomY < this.star.height / 2)) {
                cc.log("update star:out of screen");
                this.removeChild(this.star);
                this.star = null;
                return;
            }
            for (var index in this.bodys) {
                if (cc.rectIntersectsRect(this.bodys[index].getBoundingBox(), this.star.getBoundingBox())) {
                    cc.log("update star:intersect with self");
                    this.removeChild(this.star);
                    this.star = null;
                    return;
                }
            }
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
    // 蛇关节移动方法
    snakeMove: function () {
        for (var index in this.bodys) {
            // 循环执行移动方法,并返回移动结果,false即视为游戏结束
            if (!this.bodys[index].move(this)) {
                // 执行移动方法,移动失败,游戏结束
                this.unschedule(this.snakeMove);
                this.unschedule(this.updateStar);
                var overScene = new OverScene(Number(this.score.getString()), false);
                cc.director.runScene(new cc.TransitionFade(1, overScene));
            }
        }
        for (var index in this.bodys) {
            // 本轮所有关节移动结束,所有节点的当前方向赋值为下一次的方向
            this.bodys[index].direction = this.bodys[index].nextDirection;
        }
        if (this.canNewBody == 1) {
            // 如果新增关节为1,增加关节
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