import { Student } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import apiRequest from '@/utils/lib/api-request/request';
import { formatPhoneNumber } from '@/utils';

export default function StudentLabel({ StudentId }: { StudentId: string }) {
    const [student, setStudent] = useState<Student | null>(null);

    const fetchStudentById = async () => {
        try {
            const response = await apiRequest.get<Student>(`/students/${StudentId}`);

            if (response.success && response.data) {
                setStudent(response.data);
            }
        } catch (error) {
            console.error('Error fetching single Student:', error);
        }
    };

    useEffect(() => {
        fetchStudentById();
    }, []);

    return (
        <span>
            {student
                ? `${student.firstName} ${student.lastName} ${student.phone ? `     ${formatPhoneNumber(student.phone)}` : ''}`
                : '...'}
        </span>
    )
}
