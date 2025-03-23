'use client'

import { useRef, useState, useEffect, ReactNode } from 'react'
import classNames from 'classnames'

type StickyFooterProps = {
    children: ReactNode
    className?: string
    stickyClass?: string
}

const StickyFooter: React.FC<StickyFooterProps> = ({ children, className, stickyClass }) => {
    const [isSticky, setIsSticky] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const cachedRef = ref.current
        if (!cachedRef) return

        const observer = new IntersectionObserver(
            ([entry]) => setIsSticky(entry.intersectionRatio < 1),
            { threshold: [1] }
        )

        observer.observe(cachedRef)

        return () => observer.unobserve(cachedRef)
    }, [])

    return (
        <div
            ref={ref}
            className={classNames(
                'sticky -bottom-1',
                className,
                isSticky && stickyClass
            )}
        >
            {children}
        </div>
    )
}

export default StickyFooter
