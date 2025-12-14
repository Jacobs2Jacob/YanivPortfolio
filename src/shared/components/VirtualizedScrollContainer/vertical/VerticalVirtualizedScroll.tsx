import { useMemo } from 'react';
import styles from './VerticalVirtualizedScroll.module.css'; 
import { useContainerWidth } from '../../../hooks/useContainerWidth';
import { VirtualizedScrollProps } from '../types';
import { useVirtualizedController } from '../useVirtualizedController';

const DEFAULT_ITEM_HEIGHT = 250;
const MIN_ITEM_WIDTH = 180;

const VerticalVirtualizedScroll = <T,>({
    items,
    renderItem,
    onScrollEnd,
    onScrollStateChange,
    estimateSize = DEFAULT_ITEM_HEIGHT,
}: VirtualizedScrollProps<T>) => {

    const { containerRef, width: containerWidth } = useContainerWidth(); 
    const itemsPerRow = Math.max(1, Math.floor(containerWidth / MIN_ITEM_WIDTH));

    // Group items into rows based on itemsPerRow
    const rows = useMemo(() => {
        const grouped: T[][] = [];

        for (let i = 0; i < items.length; i += itemsPerRow) {
            grouped.push(items.slice(i, i + itemsPerRow));
        }

        return grouped;
    }, [items, itemsPerRow]);

    const {
        scrollRef,
        virtualizer,
        handleScroll,
    } = useVirtualizedController({
        count: rows.length,
        estimateSize,
        horizontal: false,
        onScrollEnd,
        onScrollStateChange,
        scrollByOffsetSize: (el) => el.offsetHeight,
    });

    return (
        <div ref={containerRef} className={styles.wrapper}>
            <div
                ref={scrollRef}
                className={styles.verticalContent}
                onScroll={handleScroll}
            >
                <div
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {virtualizer.getVirtualItems().map((virtualRow) => (
                        <div data-index={virtualRow.index}
                             key={virtualRow.key}
                             style={{
                                position: 'absolute',
                                top: virtualRow.start,
                                left: 0,
                                width: '100%',
                                height: virtualRow.size,
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '10px',
                                boxSizing: 'border-box',
                             }}>
                            {rows[virtualRow.index].map((item, idx) =>
                                renderItem(item, virtualRow.index * itemsPerRow + idx)
                            )}
                        </div> 
                    ))}
                </div>
            </div>
        </div>
    );
}; 

export default VerticalVirtualizedScroll;