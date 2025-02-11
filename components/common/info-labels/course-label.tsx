import { Course } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import apiRequest from '@/utils/lib/api-request/request';

export default function CourseLabel({ courseId }: { courseId: string }) {
    const [course, setcourse] = useState<Course | null>(null);

    const fetchcourseById = async () => {
        try {
            const response = await apiRequest.get<Course>(`/courses/${courseId}`);
           
            if (response.success && response.data) {
                setcourse(response.data);
            }
        } catch (error) {
            console.error('Error fetching single course:', error);
        }
    };

    useEffect(() => {
        fetchcourseById();
    }, []);

    return (
        <span >{course ?  course?.name : '...'}</span>
    )
}
