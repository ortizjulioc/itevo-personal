import SelectPromotion, { SelectPromotionType } from "@/components/common/selects/select-promotion";
import { FormItem, Input } from "@/components/ui";
import { Field, FormikErrors, FormikTouched } from "formik";
import SelectBranch, { SelectBranchType } from "@/components/common/selects/select-branch";
import SelectTeacher, { SelectTeacherType } from "@/components/common/selects/select-teacher";
import SelectCourse from "@/components/common/selects/select-course";
import { CreateCourseBranchFormType } from "../form.config";
import { useSession } from 'next-auth/react';
import { Branch, Role } from "@prisma/client";
import { ADMIN } from "@/constants/role.constant";
import ModalCreateCourse from "../update-form/modal-create-course";
import { useState } from "react";
import Tooltip from "@/components/ui/tooltip";
import { IoMdAddCircleOutline } from "react-icons/io";

interface GeneralInformationFieldsProps {
    values: CreateCourseBranchFormType;
    errors: FormikErrors<CreateCourseBranchFormType>;
    touched: FormikTouched<CreateCourseBranchFormType>;
    setFieldValue: any;
}

export default function GeneralInformationFields({ values, errors, touched, setFieldValue }: GeneralInformationFieldsProps) {
    const { data: session } = useSession();
    const [modal, setModal] = useState<boolean>(false)
    const user = session?.user as {
        id: string;
        name?: string | null;
        email?: string | null;
        username?: string;
        phone?: string;
        lastName?: string;
        roles?: Role[];
        mainBranch: Branch;
        branches?: any[];
    };



    return (
        <div className="mt-6">
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
            {user.roles?.some(role => role.normalizedName === ADMIN) && (
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
            )}


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

            <FormItem
                name="courseId"
                label={
                    <div className="flex items-center gap-2">
                        <span className="text-base leading-none">Curso</span>
                        <Tooltip title="Crear estudiante">
                            <button type="button" className="p-0.5 text-primary transition-colors duration-200 hover:text-primary/80" onClick={() => setModal(true)}>
                                <IoMdAddCircleOutline className="h-6 w-6 align-middle" />
                            </button>
                        </Tooltip>
                    </div>
                }
                invalid={Boolean(errors.courseId && touched.courseId)} errorMessage={errors.courseId}
            >
                <Field>
                    {({ form, field }: any) => (
                        <>
                            <SelectCourse
                                {...field}
                                value={values.courseId}
                                onChange={(option: SelectBranchType | null) => {
                                    console.log('Selected course:', option);
                                    form.setFieldValue('courseId', option?.value || '');
                                    if (option?.value) {
                                        form.setFieldValue('sessionCount', option?.duration || '');
                                    }
                                }}

                            />
                            <ModalCreateCourse
                                modal={modal}
                                setModal={setModal}
                                setFieldValue={setFieldValue}
                            />
                        </>


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

            <FormItem name="sessionCount" label="Cantidad de sesiones" invalid={Boolean(errors.sessionCount && touched.sessionCount)} errorMessage={errors.sessionCount}>
                <Field
                    type="number"
                    name="sessionCount"
                    component={Input}
                    placeholder="Ingrese la cantidad de sesiones para este curso"
                />
            </FormItem>
        </div>
    )
}
