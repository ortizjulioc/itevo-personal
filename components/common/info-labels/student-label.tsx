import { Student } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import apiRequest from '@/utils/lib/api-request/request';
import { getInitials } from '@/utils';
import Avatar from '../Avatar';
import classNames from 'classnames';

interface StudentLabelProps {
    studentId?: string;
    student?: Student | null;
    clickable?: boolean;
}

export default function StudentLabel({ studentId, student: studentFromProps, clickable = false }: StudentLabelProps) {
    const [student, setStudent] = useState<Student | null>(null);
    console.log('Student from props:', studentFromProps);

    useEffect(() => {
        const fetchStudentById = async () => {
            console.log('Fetching student by ID:', studentId);
            try {
                const response = await apiRequest.get<Student>(`/students/${studentId}`);
                if (response.success && response.data) {
                    setStudent(response.data);
                }
            } catch (error) {
                console.error('Error fetching single Student:', error);
            }
        };
        if (!studentFromProps && studentId) {
            fetchStudentById();
        } else if (studentFromProps) {
            setStudent(studentFromProps);
        }
    }, [studentFromProps, studentId]);

    if (!student) return <span className="text-gray-500 dark:text-gray-600 italic">...</span>;

    return (
        <>
            <div
                className={classNames(
                    "ml-2 flex items-center gap-2 min-w-64",
                    { 'cursor-pointer p-2 hover:bg-gray-100 rounded-md': clickable }
                )}
            >
                <Avatar initials={getInitials(student.firstName, student.lastName)} size="sm" color="primary" />
                <div className="flex flex-col">
                    <span>{`${student.firstName} ${student.lastName}`}</span>
                    <span className="font-semibold">{student.code}</span>
                </div>
            </div>
        </>
    )
}
