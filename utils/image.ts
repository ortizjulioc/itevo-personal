export const imageToBase64 = async (
  imagen: File,
  callback: (base64: string | ArrayBuffer | null) => Promise<void>
): Promise<void> => {
  const reader = new FileReader();

  reader.readAsDataURL(imagen);

  reader.onload = async () => {
    await callback(reader.result);
  };

  reader.onerror = (error) => {
    console.error('Error al convertir imagen a base64:', error);
  };
};

export const fetchImageAsBase64 = async (imageUrl: string): Promise<Blob | null> => {
  try {
    if (!imageUrl || typeof imageUrl !== 'string') {
      console.error('La URL de la imagen es incorrecta:', imageUrl);
      return null;
    }

    const response = await fetch(imageUrl);

    if (!response.ok) {
      console.error('Error en la carga de imagen:', response.statusText);
      return null;
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error en la carga de imagen:', error);
    return null;
  }
};
