'use client';
import React, { useState, useCallback } from 'react';
import Tippy, { TippyProps } from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface PremiumTooltipProps extends Omit<TippyProps, 'children'> {
    children: React.ReactElement;
}

/**
 * A wrapper for Tippy that avoids React 19 "element.ref" warnings
 * by using the reference prop instead of cloning children.
 */
export default function PremiumTooltip({ children, ...props }: PremiumTooltipProps) {
    const [reference, setReference] = useState<HTMLElement | null>(null);

    const refCallback = useCallback((node: HTMLElement | null) => {
        setReference(node);
    }, []);

    return (
        <>
            {React.cloneElement(children, { ref: refCallback } as any)}
            {reference && <Tippy {...props} reference={reference} />}
        </>
    );
}
