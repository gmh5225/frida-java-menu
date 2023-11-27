namespace Menu {
    export type Permission = {
        name: string,
        ask: () => void,
        check: () => boolean
    }
    /** @internal */
    export const overlay: Permission = {
        name: "android.settings.action.MANAGE_OVERLAY_PERMISSION",
        ask() {
            toast(theme.noOverlayPermissionText, 1);
            const intent = Api.Intent.$new(Api.JavaString.$new(this.name));
            intent.setFlags(Api.Intent.FLAG_ACTIVITY_NEW_TASK.value);
            intent.setData(Api.Uri.parse("package:" + app.packageName));
            app.context.startActivity(intent);
        },
        check() {
            return !!Api.Settings.canDrawOverlays(app.context);
        }
    }
}