import type {
	ElMessageBoxOptions,
	MessageBoxData,
	MessageHandler,
	MessageOptions,
	NotificationHandle,
	NotificationOptions,
} from "element-plus";

type DefaultType = "title" | "message" | "type";

interface MessageType {
	success: (message: string, options?: Omit<MessageOptions, DefaultType>) => MessageHandler;
	error: (message: string, options?: Omit<MessageOptions, DefaultType>) => MessageHandler;
	info: (message: string, options?: Omit<MessageOptions, DefaultType>) => MessageHandler;
	warning: (message: string, options?: Omit<MessageOptions, DefaultType>) => MessageHandler;
}

interface NotificationType {
	success: (message: string, title?: string, options?: Omit<NotificationOptions, DefaultType>) => NotificationHandle;
	error: (message: string, title?: string, options?: Omit<NotificationOptions, DefaultType>) => NotificationHandle;
	info: (message: string, title?: string, options?: Omit<NotificationOptions, DefaultType>) => NotificationHandle;
	warning: (message: string, title?: string, options?: Omit<NotificationOptions, DefaultType>) => NotificationHandle;
}

interface MessageBoxType {
	confirm: (
		message: string,
		title?: string,
		options?: Omit<ElMessageBoxOptions, "message" | "title">,
	) => Promise<MessageBoxData>;
}

const duration = DELAY_TIME;

/**
 * 创建消息提示方法集合
 *
 * @returns 包含 success、error、info、warning 四种消息提示的方法对象
 */
function useMessage(): MessageType {
	const success = (message: string, options?: Omit<MessageOptions, DefaultType>): MessageHandler =>
		ElMessage.success({
			message,
			duration,
			...options,
		});

	const error = (message: string, options?: Omit<MessageOptions, DefaultType>): MessageHandler =>
		ElMessage.error({
			message,
			duration,
			...options,
		});

	const info = (message: string, options?: Omit<MessageOptions, DefaultType>): MessageHandler =>
		ElMessage.info({
			message,
			duration,
			...options,
		});

	const warning = (message: string, options?: Omit<MessageOptions, DefaultType>): MessageHandler =>
		ElMessage.warning({
			message,
			duration,
			...options,
		});

	return { success, error, info, warning };
}

/**
 * 创建通知提示方法集合
 *
 * @returns 包含 success、error、info、warning 四种通知提示的方法对象
 */
function useNotification(): NotificationType {
	const success = (
		message: string,
		title?: string,
		options?: Omit<NotificationOptions, DefaultType>,
	): NotificationHandle =>
		ElNotification.success({
			title,
			message,
			duration,
			...options,
		});

	const error = (
		message: string,
		title?: string,
		options?: Omit<NotificationOptions, DefaultType>,
	): NotificationHandle =>
		ElNotification.error({
			title,
			message,
			duration,
			...options,
		});

	const info = (
		message: string,
		title?: string,
		options?: Omit<NotificationOptions, DefaultType>,
	): NotificationHandle =>
		ElNotification.info({
			title,
			message,
			duration,
			...options,
		});

	const warning = (
		message: string,
		title?: string,
		options?: Omit<NotificationOptions, DefaultType>,
	): NotificationHandle =>
		ElNotification.warning({
			title,
			message,
			duration,
			...options,
		});

	return { success, error, info, warning };
}

/**
 * 创建确认框方法，统一确认/取消按钮文案与警告类型
 *
 * @returns 包含 confirm 确认框方法的对象
 */
function useMessageBox(): MessageBoxType {
	const confirm = (
		message: string,
		title: string = REMINDER_TITLE,
		options?: Omit<ElMessageBoxOptions, "message" | "title">,
	): Promise<MessageBoxData> =>
		ElMessageBox.confirm(message, title, {
			confirmButtonText: BUTTON_MAP.CONFIRM.LABEL,
			cancelButtonText: BUTTON_MAP.CANCEL.LABEL,
			type: "warning",
			...options,
		});

	return { confirm };
}

export { useMessageBox, useMessage, useNotification };
