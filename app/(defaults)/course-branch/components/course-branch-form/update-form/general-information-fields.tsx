import SelectPromotion, { SelectPromotionType } from "@/components/common/selects/select-promotion";
import { FormItem, Input } from "@/components/ui";
import { Field, FormikErrors, FormikTouched } from "formik";
import SelectBranch, { SelectBranchType } from "@/components/common/selects/select-branch";
import SelectTeacher, { SelectTeacherType } from "@/components/common/selects/select-teacher";
import SelectCourse from "@/components/common/selects/select-course";
import { CourseBranchFormType } from "../form.config";

interface GeneralInformationFieldsProps {
    values: CourseBranchFormType;
    errors: FormikErrors<CourseBranchFormType>;
    touched: FormikTouched<CourseBranchFormType>;
    className?: string;
}

export default function GeneralInformationFields({ values, errors, touched, className }: GeneralInformationFieldsProps) {
    return (
        <div className={className}>
            <FormItem name="promotionId" label="Promocion" invalid={Boolean(errors.promotionId && touched.promotionId)} errorMessage={errors.promotionId}>
                <Field>
                    {({ form, field }: any) => (
                        <SelectPromotion
                            {...field}
                            value={values.promotionId}
                            onChange={(option: SelectPromotionType | null) => {
                                form.setFieldValue('promotionId', option?.value || '');
                            }}
                        />
                    )}
                </Field>
            </FormItem>
            <FormItem name="branchId" label="Sucursal" invalid={Boolean(errors.branchId && touched.branchId)} errorMessage={errors.branchId}>
                <Field>
                    {({ form, field }: any) => (
                        <SelectBranch
                            {...field}
                            value={values.branchId}
                            onChange={(option: SelectBranchType | null) => {
                                form.setFieldValue('branchId', option?.value || '');
                            }}
                        />
                    )}
                </Field>
            </FormItem>

            <FormItem name="teacherId" label="Profesor" invalid={Boolean(errors.teacherId && touched.teacherId)} errorMessage={errors.teacherId}>
                <Field>
                    {({ form, field }: any) => (
                        <SelectTeacher
                            {...field}
                            value={values.teacherId}
                            onChange={(option: SelectTeacherType | null) => {
                                form.setFieldValue('teacherId', option?.value || '');
                            }}
                        />
                    )}
                </Field>
            </FormItem>

            <FormItem name="courseId" label="Curso" invalid={Boolean(errors.courseId && touched.courseId)} errorMessage={errors.courseId}>
                <Field>
                    {({ form, field }: any) => (
                        <SelectCourse
                            {...field}
                            value={values.courseId}
                            onChange={(option: SelectBranchType | null) => {
                                form.setFieldValue('courseId', option?.value || '');
                            }}
                        />
                    )}
                </Field>
            </FormItem>

            <FormItem name="capacity" label="Capacidad" invalid={Boolean(errors.capacity && touched.capacity)} errorMessage={errors.capacity}>
                <Field
                    type="number"
                    name="capacity"
                    component={Input}
                    placeholder="Ingrese la capacidad de estudiantes para este curso"
                />
            </FormItem>

            
            {/* TODO: Agregar select de estados */}

            {/* <FormItem name='modality' label='Modalidad' invalid={Boolean(errors.modality && touched.modality)} errorMessage={errors.modality}>
                <Field name='modality'>
                    {({ field, form }: any) => (
                        <Select
                            {...field}
                            options={MODALITIES_OPTIONS}
                            value={MODALITIES_OPTIONS.find((modality) => modality.value === values.modality)}
                            onChange={(option: { value: string, label: string } | null) => {
                                form.setFieldValue('modality', option?.value ?? null);
                            }}
                            isSearchable={false}
                            placeholder="Selecciona una modalidad"
                        />
                    )}
                </Field>
            </FormItem> */}
        </div>
    )
}
