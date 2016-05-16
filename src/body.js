/**
 * Created by Henry on 16/5/14.
 */
var SnakeBody = cc.Sprite.extend({
    frontBody: null,//上一个身体关节,没有则为头部
    nextDirection: 0,// 1-上,2-下,3-左,4-右
    direction: 0,// 1-上,2-下,3-左,4-右
    ctor: function (frontBody, direction) {
        this._super();
        this.frontBody = frontBody;
        this.direction = direction;
        this.nextDirection = direction;
        return true;
    },
    onEnter: function () {
        this._super();
        if (this.frontBody == null) {
            // 蛇头部关节,设置头部纹理
            switch (this.direction) {
                case 1:
                    this.setTexture(res.head_up);
                    break;
                case 2:
                    this.setTexture(res.head_down);
                    break;
                case 3:
                    this.setTexture(res.head_left);
                    break;
                case 4:
                    this.setTexture(res.head_right);
                    break;
            }
        } else {
            // 蛇身体关节
            // 设置纹理
            this.setTexture(res.body);
            // 设置关节位置
            var frontX = this.frontBody.getPositionX();
            var frontY = this.frontBody.getPositionY();
            var frontWidth = this.frontBody.width;
            var frontHeight = this.frontBody.height;
            var width = this.width;
            var height = this.height;
            switch (this.frontBody.direction) {
                // 根据父关节的当前移动方向,决定此关节的位置
                case 1:// 上
                    this.setPosition(frontX, frontY - frontHeight / 2 - height / 2 - 1);
                    break;
                case 2:// 下
                    this.setPosition(frontX, frontY + frontHeight / 2 + height / 2 + 1);
                    break;
                case 3:// 左
                    this.setPosition(frontX + frontWidth / 2 + width / 2 + 1, frontY);
                    break;
                case 4:// 右
                    this.setPosition(frontX - frontWidth / 2 - width / 2 - 1, frontY);
                    break;
            }
        }
        return true;
    },
    // 关节移动方法
    move: function (layer) {
        var star = layer.star;
        var direct;
        if (this.frontBody == null) {
            // 头部关节按照自身的下次方向行走
            direct = this.nextDirection;
        } else {
            // 身体关节按照父关节的当前方向行走,并将福关节的当前方向设置为自身的下次方向
            this.nextDirection = direct = this.frontBody.direction;
        }
        switch (direct) {
            case 1:// 上
                this.setPosition(this.getPositionX(), this.getPositionY() + Constants.speed);
                // this.runAction(cc.moveBy(Constants.frequency, cc.p(0, Constants.speed), 0))
                break;
            case 2:// 下
                this.setPosition(this.getPositionX(), this.getPositionY() - Constants.speed);
                // this.runAction(cc.moveBy(Constants.frequency, cc.p(0, -Constants.speed), 0))
                break;
            case 3:// 左
                this.setPosition(this.getPositionX() - Constants.speed, this.getPositionY());
                // this.runAction(cc.moveBy(Constants.frequency, cc.p(-Constants.speed, 0), 0))
                break;
            case 4:// 右
                this.setPosition(this.getPositionX() + Constants.speed, this.getPositionY());
                // this.runAction(cc.moveBy(Constants.frequency, cc.p(Constants.speed, 0), 0))
                break;
        }
        if (this.frontBody == null) {
            switch (this.nextDirection) {
                // 头部关节需要设置头部不同方向的纹理
                case 1:// 上
                    this.setTexture(res.head_up);
                    break;
                case 2:// 下
                    this.setTexture(res.head_down);
                    break;
                case 3:// 左
                    this.setTexture(res.head_left);
                    break;
                case 4:// 右
                    this.setTexture(res.head_right);
                    break;
            }
            // 头部关节判断是否触碰到边界
            var size = cc.winSize;
            if ((this.getPositionX() > size.width - this.width / 2)
                || (this.getPositionX() < this.width / 2)
                || (this.getPositionY() > size.height - this.height / 2)
                || (this.getPositionY() < this.height / 2)) {
                // 判断触碰边界
                cc.log("game over");
                return false;
            }
            for (var index in layer.bodys) {
                if (layer.bodys[index] != this && cc.rectIntersectsRect(this.getBoundingBox(), layer.bodys[index].getBoundingBox())) {
                    // 判断是否触碰到自己身体关节
                    return false;
                }
            }
            // 判断是否吃到星星
            if (star != null) {
                if (cc.rectIntersectsRect(this.getBoundingBox(), star.getBoundingBox())) {
                    star.runAction(
                        cc.sequence(cc.spawn(
                            cc.scaleTo(0.2, 3),
                            cc.fadeOut(0.2)
                        ), cc.callFunc(function (star) {
                            star.removeFromParent();
                        }, star))
                    );
                    // 清除星星
                    layer.star = null;
                    // 添加身体
                    layer.canNewBody = 1;
                    // 改变分数
                    layer.score.setString("" + (Number(layer.score.getString()) + Math.round(Math.random() * 3 + 1)));
                    layer.score.runAction(cc.sequence(cc.scaleTo(0.1, 2), cc.scaleTo(0.1, 0.5), cc.scaleTo(0.1, 1)));
                }
            }
        }
        return true;
    }
});