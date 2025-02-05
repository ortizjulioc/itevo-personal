import { Teacher } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import apiRequest from '@/utils/lib/api-request/request';

export default function TeacherLabel({ teacherId }: { teacherId: string }) {
    const [teacher, setteacher] = useState<Teacher | null>(null);

    const fetchteacherById = async () => {
        try {
            const response = await apiRequest.get<Teacher>(`/teachers/${teacherId}`);
            console.log('response:', response)
            if (response.success && response.data) {
                setteacher(response.data);
            }
        } catch (error) {
            console.error('Error fetching single teacher:', error);
        }
    };

    useEffect(() => {
        fetchteacherById();
    }, []);

    return (
        <span >{teacher ?  `${teacher.firstName} ${teacher.lastName}`  : '...'}</span>
    )
}
