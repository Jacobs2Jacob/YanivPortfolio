import { useMemo, useState, WheelEvent } from 'react';
import styles from './HorizontalVirtualizedScroll.module.css';
import { VirtualizedScrollProps } from '../types';
import { useVirtualizedController } from '../useVirtualizedController';  

interface HorizontalProps<T> extends VirtualizedScrollProps<T> {
    totalRows?: number;
}

const DEFAULT_ITEM_WIDTH = 270; 

const HorizontalVirtualizedScroll = <T,>({
    items,
    renderItem,
    onScrollEnd,
    onScrollStateChange,
    estimateSize = DEFAULT_ITEM_WIDTH,
    isLoading,
    totalRows = 2,
}: HorizontalProps<T>) => {
    const [canScrollBack, setCanScrollBack] = useState(false);
    const [canScrollForward, setCanScrollForward] = useState(false);
     
    // Group items into columns based on totalRows
    const columns = useMemo(() => {
        const grouped: T[][] = [];

        for (let i = 0; i < items.length; i += totalRows) {
            grouped.push(items.slice(i, i + totalRows));
        }

        return grouped;
    }, [items, totalRows]);

    const {
        scrollRef,
        virtualizer,
        scrollByOffset,
        handleScroll,
    } = useVirtualizedController({
        isLoading,
        count: columns.length,
        estimateSize,
        horizontal: true,
        onScrollEnd,
        onScrollStateChange: (back, forward) => {
            setCanScrollBack(back);
            setCanScrollForward(forward);
            onScrollStateChange?.(back, forward);
        },
        scrollByOffsetSize: (el) => el.offsetWidth,
    });
     
    // Handle wheel event to scroll horizontally
    const onWheel = (e: WheelEvent<HTMLDivElement>) => {
        const el = scrollRef.current;
        
        if (!el) {
            return;
        }

        const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

        if (delta !== 0)
        { 
            el.scrollBy({ left: delta * 10, behavior: 'auto' });
        }
     };

    return (
        <div className={styles.wrapper}>
            <div style={{ width: '40px' }}>
                {canScrollBack && (
                    <button
                        className={styles.navButton}
                        onClick={() => scrollByOffset('backward')}
                    >
                        &lt;
                    </button>
                )}
            </div>
            
            <div
                ref={scrollRef}
                className={styles.horizontalContent}
                onScroll={handleScroll}
                onWheel={onWheel}
            >
                <div
                    style={{
                        width: `${virtualizer.getTotalSize()}px`,
                        height: '100%',
                        position: 'relative',
                        display: 'grid',
                        gridAutoFlow: 'column',
                        gridTemplateRows: 'repeat(2, 1fr)',
                        gap: '12px',
                    }}
                >
                    {virtualizer.getVirtualItems().map((virtualItem) => {
                        const columnItems = columns[virtualItem.index];

                        return <div key={virtualItem.key}
                                    ref={virtualizer.measureElement}
                                    data-index={virtualItem.index}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: virtualItem.start,
                                        width: virtualItem.size,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px',
                                        boxSizing: 'border-box',
                                    }}>
                                    {columnItems.map((item, columnIdx) =>
                                        renderItem(
                                            item,
                                            columnIdx
                                        )
                                    )}
                        </div>
                    })}
                </div>
            </div>
            
            <div style={{ width: '40px' }}>
                {canScrollForward && (
                    <button
                        className={styles.navButton}
                        onClick={() => scrollByOffset('forward')}
                    >
                        &gt;
                    </button>
                )}
            </div>
        </div>
    );
} 

export default HorizontalVirtualizedScroll;