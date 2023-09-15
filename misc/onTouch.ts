namespace Menu {
    export class OnTouch {
        expandedView: Layout;
        iconView: Object;
        initialPosition: [number, number];
        params: Java.Wrapper;
        touchPosition: [number, number];
        windowManager: Java.Wrapper;

        constructor(target: Object) {
            const menu = Menu.instance;
            this.expandedView = menu.expandedView;
            this.iconView = menu.iconView;
            this.params = menu.menuParams;
            this.initialPosition = [0, 0];
            this.touchPosition = [0, 0];
            this.windowManager = menu.windowManager;

            target.onTouchListener = (v, e) => this.callback(v, e);
        }

        callback(view: Java.Wrapper, event: Java.Wrapper) {
            switch(event.getAction()) {
                case Api.ACTION_DOWN:
                    this.initialPosition = [Math.floor(this.params.x.value), Math.floor(this.params.y.value)];
                    this.touchPosition = [Math.floor(event.getRawX()), Math.floor(event.getRawY())];
                    return true;
                case Api.ACTION_UP:
                    this.expandedView.alpha = 1.;
                    this.iconView.alpha = 1.;
                    let [rawX, rawY] = [Math.floor(event.getRawX() - this.touchPosition[0]), Math.floor(event.getRawX() - this.touchPosition[1])];
                    if (this.iconView.visibility == Api.VISIBLE) {
                        if (app.orientation == Api.ORIENTATION_LANDSCAPE) {
                            this.iconView.visibility = Api.GONE;
                            this.expandedView.visibility = Api.VISIBLE;
                        }
                        else if (rawX < 10 && rawY < 10) {
                            this.iconView.visibility = Api.GONE;
                            this.expandedView.visibility = Api.VISIBLE;
                        }
                    }
                    return true;
                case Api.ACTION_MOVE:
                    this.expandedView.alpha = 0.5;
                    this.iconView.alpha = 0.5;
                    this.params.x.value = this.initialPosition[0] + Math.floor(event.getRawX() - this.touchPosition[0])
                    this.params.y.value = this.initialPosition[1] + Math.floor(event.getRawY() - this.touchPosition[1])
                    Java.scheduleOnMainThread(() => {
                        this.windowManager.updateViewLayout(Menu.instance.rootFrame.instance, this.params);
                    })
                    return true;
                default:
                    return false;
            }
        }
    }
}