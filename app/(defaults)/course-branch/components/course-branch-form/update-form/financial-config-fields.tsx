import { Field, FieldProps, FormikErrors, FormikTouched } from "formik";
import { CourseBranchFormType } from "../form.config";
import { FormItem, Input } from "@/components/ui";
import Tooltip from "@/components/ui/tooltip";

interface FinancialConfigFieldsProps {
    values: CourseBranchFormType;
    errors: FormikErrors<CourseBranchFormType>;
    touched: FormikTouched<CourseBranchFormType>;
    className?: string;
}

export default function FinancialConfigFields({ values, errors, touched, className }: FinancialConfigFieldsProps) {

    return (
        <div className={className}>
            <FormItem
                extra={(<Tooltip title={"Este es el costo que tendrá cada cuota del curso.\nEste monto será cobrado en cada clase."}><span className='text-gray-600 bg-gray-200 rounded-full px-1 text-xs'>?</span></Tooltip>)}
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
                            <Input {...field} onWheel={(e) => (e.target as HTMLInputElement).blur()} type="number" placeholder="Ingrese el monto de cada cuota" className="form-input rounded-none" />
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
                    {({ field, form }: FieldProps<CourseBranchFormType>) => (
                        <div className="flex">
                            <Input
                                field={field}
                                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                value={values.commissionRate !== 0 ? values.commissionRate * 100 : ''}
                                onChange={(e) => {
                                    form.setFieldValue('commissionRate', e.target.value !== '' ? Number(e.target.value) / 100 : 0);
                                    form.setFieldValue('commissionAmount', values.amount ? (Number(values.amount) * (e.target.value !== '' ? Number(e.target.value) / 100 : 0)).toFixed(2) : '');
                                }}
                                step={1}
                                type="number"
                                placeholder="Porcentaje de comisión que recibirá el profesor"
                                className="form-input rounded-r-none"
                            />
                            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                %
                            </div>
                        </div>
                    )}
                </Field>
            </FormItem>
            <FormItem
                extra={(<Tooltip title="Este es el monto que recibirá el profesor por cada clase"><span className='text-gray-600 bg-gray-200 rounded-full px-1 text-xs'>?</span></Tooltip>)}
                name='commissionAmount'
                label='Monto comisión'
            >
                <Field name='commissionAmount'>
                    {({ form }: FieldProps<CourseBranchFormType>) => {
                        const rawAmount = Number(values.amount) || 0;
                        const calculatedAmount = rawAmount * values.commissionRate;

                        return (
                            <div className="flex">
                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                    RD$
                                </div>
                                <Input
                                    value={values.amount && values.commissionRate ? calculatedAmount : ''}
                                    onChange={(e) => {
                                        const input = Number(e.target.value);
                                        const newRate = rawAmount !== 0 ? input / rawAmount : 0;
                                        form.setFieldValue('commissionRate', newRate);
                                        form.setFieldValue('commissionAmount', input);
                                    }}
                                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                    type="number"
                                    placeholder="Monto que ganará el profesor"
                                    className="form-input rounded-none"
                                />
                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                    .00
                                </div>
                            </div>
                        );
                    }}
                </Field>
            </FormItem>


            {/* <FormItem name="capacity" label="Capacidad" invalid={Boolean(errors.capacity && touched.capacity)} errorMessage={errors.capacity}>
                <Field type="number" name="capacity" component={Input} />
            </FormItem> */}
        </div>
    )
}
