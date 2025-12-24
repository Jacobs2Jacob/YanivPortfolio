import { useCallback, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
 
interface UseVirtualizedControllerProps {
    count: number;
    estimateSize: number;
    horizontal: boolean;
    onScrollEnd: () => void;
    onScrollStateChange?: (canScrollBack: boolean, canScrollForward: boolean) => void;
    scrollByOffsetSize: (el: HTMLDivElement) => number;
    overscan?: number;
    isLoading?: boolean;
}

type ScrollDirection = 'backward' | 'forward';

export const useVirtualizedController = ({
    count,
    estimateSize,
    horizontal,
    onScrollEnd,
    onScrollStateChange = () => { },
    scrollByOffsetSize,
    overscan = 8,
    isLoading,
}: UseVirtualizedControllerProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => estimateSize,
        horizontal,
        overscan,
    });

    // Effect to detect when we've scrolled to the end
    useEffect(() => {

        const limitIndex = count - 1 - overscan;

        if (virtualizer.range && virtualizer.range.endIndex >= limitIndex) {
            // Only trigger the load if we are not already fetching data
            if (!isLoading) {
                onScrollEnd();
            }
        }
    }, [virtualizer.range, count, isLoading, onScrollEnd]);
     
    // Update scroll state (canScrollBack, canScrollForward) for Horizontal Nav
    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;

        if (!el) {
            return;
        }

        const scrollPos = horizontal ? el.scrollLeft : el.scrollTop;

        // Check exact scroll boundaries
        const maxScroll = horizontal
            ? el.scrollWidth - el.clientWidth
            : el.scrollHeight - el.clientHeight;

        const canScrollBack = scrollPos > 1;
        const canScrollForward = scrollPos < maxScroll - 1;

        onScrollStateChange(canScrollBack, canScrollForward);
    }, [horizontal, onScrollStateChange]);

    // Manual Scrolling
    const scrollByOffset = useCallback((direction: ScrollDirection) => {
        const el = scrollRef.current;

        if (!el) {
            return;
        }

        const offset = direction === 'backward' ? -scrollByOffsetSize(el) : scrollByOffsetSize(el);
        const target = horizontal ? el.scrollLeft + offset : el.scrollTop + offset;

        el.scrollTo({
            [horizontal ? 'left' : 'top']: target,
            behavior: 'smooth',
        });
    }, [horizontal, scrollByOffsetSize]
    );

    // manual scroll callback to update scroll state
    const handleScroll = useCallback(() => { 
        updateScrollState();
    }, [updateScrollState]);

    return {
        scrollRef,
        virtualizer,
        scrollByOffset,
        handleScroll,
    };
}