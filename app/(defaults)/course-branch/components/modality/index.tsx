// ModalityTag.tsx
import Tag from "@/components/ui/tag";
import { Modality } from "@prisma/client";

interface ModalityTagProps {
  modality: Modality;
}

const ModalityTag: React.FC<ModalityTagProps> = ({ modality }) => {
  let color: string;
  let outline = true;

  switch (modality) {
    case Modality.PRESENTIAL:
      color = 'blue';
      outline = true;
      break;
    case Modality.VIRTUAL:
      color = 'green';
      outline = true;
      break;
    case Modality.HYBRID:
      color = 'yellow';
      outline = true;
      break;
    default:
      color = 'gray';
      outline = true;
  }

  return <Tag text={modality} color={color} outline={outline} />;
};

export default ModalityTag;
