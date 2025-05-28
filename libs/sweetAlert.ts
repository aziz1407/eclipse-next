import { toast } from 'sonner';
import { Messages } from './config';

export const sweetErrorHandling = async (err: any) => {
	toast.error(err.message, {
		duration: Infinity,
		closeButton: false,
	});
};

export const sweetTopSuccessAlert = async (msg: string, duration: number = 2000) => {
	toast(msg.replace('Definer: ', ''), {
		duration: duration,
		position: 'bottom-right',
		style: {
			background: '#fef3c7',
			color: '#d97706',
			border: '1px solid #fbbf24'
		}
	});
};

export const sweetContactAlert = async (msg: string, duration: number = 10000) => {
	toast(msg, {
		duration: duration,
		position: 'bottom-right',
		className: 'animate__bounceIn',
		style: {
			background: '#fef3c7',
			color: '#d97706',
			border: '1px solid #fbbf24'
		}
	});
};

export const sweetConfirmAlert = (msg: string): Promise<boolean> => {
	return new Promise((resolve) => {
		const toastId = toast(msg, {
			duration: Infinity,
			position: 'top-center',
			action: {
				label: 'Confirm',
				onClick: () => {
					toast.dismiss(toastId);
					resolve(true);
				},
			},
			cancel: {
				label: 'Cancel',
				onClick: () => {
					toast.dismiss(toastId);
					resolve(false);
				},
			},
			closeButton: false,
		});
	});
};

export const sweetLoginConfirmAlert = (msg: string): Promise<boolean> => {
	return new Promise((resolve) => {
		const toastId = toast(msg, {
			duration: Infinity,
			position: 'top-center',
			action: {
				label: 'Login',
				onClick: () => {
					toast.dismiss(toastId);
					resolve(true);
				},
			},
			cancel: {
				label: 'Cancel',
				onClick: () => {
					toast.dismiss(toastId);
					resolve(false);
				},
			},
			closeButton: false,
		});
	});
};

export const sweetErrorAlert = async (msg: string, duration: number = 3000) => {
	toast.error(msg, {
		duration: duration,
		position: 'top-center',
	});
};

export const sweetMixinErrorAlert = async (msg: string, duration: number = 3000) => {
	toast.error(msg, {
		duration: duration,
		position: 'top-center',
	});
};

export const sweetMixinSuccessAlert = async (msg: string, duration: number = 2000) => {
	toast(msg, {
		duration: duration,
		position: 'bottom-right',
		style: {
			background: '#fef3c7',
			color: '#d97706',
			border: '1px solid #fbbf24'
		}
	});
};

export const sweetBasicAlert = async (text: string) => {
	toast(text, {
		duration: Infinity,
		position: 'top-center',
		closeButton: true,
	});
};

export const sweetErrorHandlingForAdmin = async (err: any) => {
	const errorMessage = err.message ?? Messages.error1;
	toast.error(errorMessage, {
		duration: Infinity,
		closeButton: false,
	});
};

export const sweetTopSmallSuccessAlert = async (
	msg: string,
	duration: number = 2000,
	enable_forward: boolean = false,
) => {
	toast(msg, {
		duration: duration,
		position: 'bottom-right',
		style: {
			background: '#fef3c7',
			color: '#d97706',
			border: '1px solid #fbbf24'
		},
		onDismiss: () => {
			if (enable_forward) {
				window.location.reload();
			}
		},
		onAutoClose: () => {
			if (enable_forward) {
				window.location.reload();
			}
		},
	});
};