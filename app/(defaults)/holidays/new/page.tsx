import { ViewTitle } from "@/components/common";
import CreateHolidayForm from "../components/holiday-form/create-form";




export default function NewHoliday() {
  return (
    <div>
            <ViewTitle className='mb-6' title="Crear dia feriado" showBackPage />
      <CreateHolidayForm />
    </div>
  )
}
