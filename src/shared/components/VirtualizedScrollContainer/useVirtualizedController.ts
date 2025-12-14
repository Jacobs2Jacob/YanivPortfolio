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
}

type ScrollDirection = 'backward' | 'forward';

export const useVirtualizedController = ({
    count,
    estimateSize,
    horizontal,
    onScrollEnd,
    onScrollStateChange = () => {},
    scrollByOffsetSize,
    overscan = horizontal ? 2 : 3,
}: UseVirtualizedControllerProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasReachedEnd = useRef(false);

    const virtualizer = useVirtualizer({
        count,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => estimateSize,
        horizontal,
        overscan,
    });

    // Trigger onScrollEnd when the end is reached
    const triggerOnReachEnd = useCallback(() => {
        const virtualItems = virtualizer.getVirtualItems();

        if (!virtualItems.length) {
            return;
        }

        const lastIndex = virtualItems[virtualItems.length - 1].index;
        const limit = count - 1;

        if (lastIndex >= limit && !hasReachedEnd.current) {
            hasReachedEnd.current = true;
            onScrollEnd();
        } else if (lastIndex < limit) {
            hasReachedEnd.current = false;
        }
    }, [virtualizer, count, onScrollEnd]);

    // Update scroll state (canScrollBack, canScrollForward)
    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;

        if (!el) {
            return;
        }

        const scrollPos = horizontal ? el.scrollLeft : el.scrollTop;
        const maxScroll = horizontal
            ? el.scrollWidth - el.clientWidth
            : el.scrollHeight - el.clientHeight;

        const canScrollBack = scrollPos > 1;
        const canScrollForward = scrollPos < maxScroll - 1;

        onScrollStateChange(canScrollBack, canScrollForward);
    }, [horizontal, onScrollStateChange]);
     
    const scrollByOffset = useCallback(
        (direction: ScrollDirection) => {
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
        },
        [horizontal, scrollByOffsetSize]
    );

    useEffect(() => {
        updateScrollState();
    }, [count, updateScrollState]);

    const handleScroll = useCallback(() => {
        triggerOnReachEnd();
        updateScrollState();
    }, [triggerOnReachEnd, updateScrollState]);

    return {
        scrollRef,
        virtualizer, 
        scrollByOffset,
        handleScroll,
    };
}

