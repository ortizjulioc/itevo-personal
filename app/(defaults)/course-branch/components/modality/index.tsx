import { Modality } from "@prisma/client";

interface ModalityTagProps {
  modality: Modality;
}

const ModalityTag: React.FC<ModalityTagProps> = ({ modality }) => {
  if (modality === Modality.PRESENTIAL) {
    return <span className="relative my-1 rounded border px-2 py-0.5 text-xs font-semibold border-blue-600 text-blue-600 hover:bg-blue-600-light hover:bg-blue-600 hover:text-white-light">Presencial</span>;
  }

  if (modality === Modality.VIRTUAL) {
    return <span className="relative my-1 rounded border px-2 py-0.5 text-xs font-semibold border-green-600 text-green-600 hover:bg-green-600-light hover:bg-green-600 hover:text-white-light">Virtual</span>;
  }

  if (modality === Modality.HYBRID) {
    return <span className="relative my-1 rounded border px-2 py-0.5 text-xs font-semibold border-yellow-600 text-yellow-600 hover:bg-yellow-600-light hover:bg-yellow-600 hover:text-white-light">Híbrido</span>;
  }

  return <span className="relative my-1 rounded border px-2 py-0.5 text-xs font-semibold border-gray-600 text-gray-600 hover:bg-gray-600-light hover:bg-gray-600 hover:text-white-light italic">Sin definir</span>;
};

export default ModalityTag;
