import Swal, { SweetAlertIcon, SweetAlertOptions, SweetAlertResult } from "sweetalert2";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

export const openNotification = (type: SweetAlertIcon, message: string) => {
    if (type === "error") {
        Swal.fire({
            icon: type,
            title: "¡Ha ocurrido un error!",
            text: message,
            confirmButtonText: "OK",
            allowOutsideClick: false
        });
    } else {
        Toast.fire({
            icon: type,
            title: message
        });
    }
}

const defaultConfigConfirm = {
    icon: 'warning' as SweetAlertIcon,
    title: '¿Estas seguro?',
    text: "No podras revertir esta operación!",
    showCancelButton: true,
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar',
    padding: '2em',
    showLoaderOnConfirm: true,
    allowOutsideClick: () => !Swal.isLoading()
};

export const confirmDialog = async (
    config: SweetAlertOptions = {},
    onConfirm?: () => Promise<void> | void,
    onCancel?: () => void
): Promise<void> => {
    const finalConfig: SweetAlertOptions = {
        ...defaultConfigConfirm,
        ...config,
        showCancelButton: true, // Asegurar que siempre haya botón de cancelar
        preConfirm: async () => {
            if (onConfirm) {
                try {
                    await onConfirm(); // Ejecuta la acción de confirmación
                } catch (error) {
                    Swal.showValidationMessage(`Error: ${error instanceof Error ? error.message : error}`);
                }
            }
        }
    };

    const result: SweetAlertResult = await Swal.fire(finalConfig);

    // Si el usuario cancela, ejecuta onCancel si se proporcionó
    if (result.dismiss === Swal.DismissReason.cancel && onCancel) {
        onCancel();
    }
};

