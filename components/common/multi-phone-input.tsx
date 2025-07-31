import { useState } from "react";
import { FormatPatterInput } from ".";
import { HiOutlineTrash } from "react-icons/hi";
import { Button } from "../ui";
import { IconPlusCircle } from "../icon";

export default function MultiPhoneInput({
  phone,
  onChange,
}: {
  phone: string;
  onChange: (phones: string) => void;
}) {
  const [phones, setPhones] = useState<string[]>(phone.split(',').map(p => p.trim()));

  const handleOnPhoneChange = (index: number, value: string) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
    onChange(newPhones.join(','));
  };

    const handleAddPhone = () => {
        setPhones([...phones, '']);
    };
  return (
    <div>
      <div className="mb-2">
        {phones.map((phone, index) => (
          <div key={index} className="flex w-full mb-2">
            <FormatPatterInput
              format="(###) ###-####"
              placeholder="(___) ___-____"
              className="form-input rounded-r-none border-r-0"
              value={phone}
              onValueChange={(value: any) => handleOnPhoneChange(index, value.value)}
            />
            <Button
              variant="outline"
              color="danger"
              icon={<HiOutlineTrash size={18} />}
              className="rounded-l-none w-14"
              onClick={() => {
                const newPhones = phones.filter((_, i) => i !== index);
                setPhones(newPhones);
                onChange(newPhones.join(','));
              }}
            />
          </div>
        ))}
      </div>
      <Button icon={<IconPlusCircle />} variant="outline" color="secondary" className="mt-2" onClick={handleAddPhone}>
        Agregar nuevo teléfono
      </Button>

    </div>
  );
}
