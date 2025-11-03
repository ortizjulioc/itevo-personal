import RichTextEditor from '@/components/common/rich-text-editor';
import { FormItem } from '@/components/ui';
import React from 'react'

export default function StandardsFields({ values, errors, touched, setFieldValue }: any) {


    return (
        <div>
            <FormItem label="Normas del curso">
                <RichTextEditor
                    value={values.rules || ''}
                    onChange={(value) => {
                        setFieldValue('rules', value);
                    }}
                    placeholder="Escribe el las normas aquí..."
                />
            </FormItem>
        </div>
    )
}
