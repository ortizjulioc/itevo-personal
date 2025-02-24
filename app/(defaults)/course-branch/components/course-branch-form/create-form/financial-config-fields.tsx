import { Field, FormikErrors, FormikTouched } from "formik";
import { CourseBranchFormType } from "../form.config";
import { FormItem, Input, Select } from "@/components/ui";
import Tooltip from "@/components/ui/tooltip";
import { MODALITIES } from "@/constants/modality.constant";
import DatePicker from "@/components/ui/date-picker";

interface FinancialConfigFieldsProps {
    values: CourseBranchFormType;
    errors: FormikErrors<CourseBranchFormType>;
    touched: FormikTouched<CourseBranchFormType>;
    setFieldValue: (field: string, value: any) => void;
}

const MODALITIES_OPTIONS = [
    { value: MODALITIES.PRESENTIAL, label: 'Presencial' },
    { value: MODALITIES.VIRTUAL, label: 'Virtual' },
    { value: MODALITIES.HYBRID, label: 'Híbrido' },
];

export default function FinancialConfigFields({ values, errors, touched, setFieldValue }: FinancialConfigFieldsProps) {
    return (
        <div className="mt-6">
            <FormItem name='modality' label='Modalidad' invalid={Boolean(errors.modality && touched.modality)} errorMessage={errors.modality}>
                <Field name='modality'>
                    {({ field }: any) => (
                        <Select
                            {...field}
                            options={MODALITIES_OPTIONS}
                            value={MODALITIES_OPTIONS.find((modality) => modality.value === values.modality)}
                            onChange={(option: { value: string, label: string } | null) => {
                                setFieldValue('modality', option?.value ?? null);
                            }}
                            isSearchable={false}
                            placeholder="Selecciona una modalidad"
                        />
                    )}
                </Field>
            </FormItem>

            <FormItem
                extra={(<Tooltip title="Este es el costo que tendrá cada cuota del curso."><span className='text-gray-600 bg-gray-200 rounded-full px-1 text-xs'>?</span></Tooltip>)}
                name='amount'
                label='Monto'
                invalid={Boolean(errors.amount && touched.amount)}
                errorMessage={errors.amount}
            >
                <Field name='amount'>
                    {({ field }: any) => (
                        <div className="flex">
                            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                RD$
                            </div>
                            <Input {...field} type="number" placeholder="Ingrese el monto de cada cuota" className="form-input rounded-none" />
                            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                .00
                            </div>
                        </div>
                    )}
                </Field>
            </FormItem>

            <FormItem
                extra={(<Tooltip title="El porcentaje que recibirá el profesor por este curso"><span className='text-gray-600 bg-gray-200 rounded-full px-1 text-xs'>?</span></Tooltip>)}
                name='commissionRate'
                label='Comision'
                invalid={Boolean(errors.commissionRate && touched.commissionRate)}
                errorMessage={errors.commissionRate}
            >
                <Field name='commissionRate'>
                    {({ field }: any) => (
                        <div className="flex">
                            <Input {...field} step={1} type="number" placeholder="" className="form-input rounded-r-none" />
                            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                %
                            </div>
                        </div>
                    )}
                </Field>
            </FormItem>

            {/* <FormItem name='startDate' label='Fecha de inicio' invalid={Boolean(errors.startDate && touched.startDate)} errorMessage={errors.startDate}>
                <DatePicker
                    placeholder='Selecciona una fecha'
                    value={values.startDate ? new Date(values.startDate) : undefined}
                    onChange={(date: Date | Date[]) => {
                        const selectedDate = Array.isArray(date) ? date[0] : date; // Garantizamos que sea un único Date
                        setFieldValue('startDate', selectedDate);
                    }}
                />
            </FormItem>

            <FormItem name='endDate' label='Fecha de fin' invalid={Boolean(errors.endDate && touched.endDate)} errorMessage={errors.endDate}>
                <DatePicker
                    placeholder='Selecciona una fecha'
                    value={values.endDate ? new Date(values.endDate) : undefined}
                    onChange={(date: Date | Date[]) => {
                        const selectedDate = Array.isArray(date) ? date[0] : date; // Garantizamos que sea un único Date
                        setFieldValue('endDate', selectedDate);
                    }}
                />
            </FormItem> */}

            <FormItem name="capacity" label="Capacidad" invalid={Boolean(errors.capacity && touched.capacity)} errorMessage={errors.capacity}>
                <Field type="number" name="capacity" component={Input} />
            </FormItem>
        </div>
    )
}
