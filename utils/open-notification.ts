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
    Toast.fire({
        icon: type,
        title: message
    });
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
    cb: Function
): Promise<void> => {
    // Merge default config with user-provided config
    const finalConfig: SweetAlertOptions = {
        ...defaultConfigConfirm,
        ...config,
        preConfirm: async () => {
            try {
                await cb(); // Ejecuta el callback asíncrono
            } catch (error) {
                if (error instanceof Error) {
                    Swal.showValidationMessage(`Request failed: ${error}`);
                } else {
                    Swal.showValidationMessage(`Request failed: ${error}`);
                }
            }
        }
    };

    // Show confirmation dialog with merged config
    const result: SweetAlertResult = await Swal.fire(finalConfig);

    // If confirmed, execute the callback function
    if (result.isConfirmed) {
        console.log('Confirmed');
    }
};
