import React, { useCallback } from 'react';
import styles from './Carousel.module.css';
import { CarouselItem } from './types';
import CarouselCard from './CarouselCard'; 
import Loader from '../Layout/Loader/Loader';
import { Direction } from '../../types';  
import HorizontalVirtualizedScroll from '../VirtualizedScrollContainer/horizontal/HorizontalVirtualizedScroll';
import VerticalVirtualizedScroll from '../VirtualizedScrollContainer/vertical/VerticalVirtualizedScroll';
import { EmptyState } from '../ErrorStates/EmptyState';

interface CarouselProps {
    items: CarouselItem[];
    onReachEnd: () => void;
    loading?: boolean;
    direction?: Direction;
}

const Carousel = ({
    items,
    onReachEnd,
    loading,
    direction = 'horizontal'
}: CarouselProps) => {

    const renderItem = useCallback((item: CarouselItem) => {
        return <CarouselCard key={item.id} item={item} />
    }, []);
      
    return (
        <div className={styles.carouselWrapper}>

            {!loading && items.length === 0 && (
                <EmptyState message={'No results found...'} />
            )}

            {loading && items.length === 0 && (
                <Loader />
            )}

            {items.length > 0 && <>
                {direction === 'horizontal' ? (
                    <HorizontalVirtualizedScroll
                        items={items}
                        renderItem={renderItem}
                        onScrollEnd={onReachEnd}
                        isLoading={loading}
                    />
                ) : (
                    <VerticalVirtualizedScroll
                        items={items}
                        renderItem={renderItem}
                        onScrollEnd={onReachEnd}
                        isLoading={loading}
                    />
                )}
            </>} 
        </div>
    );
};

export default React.memo(Carousel);