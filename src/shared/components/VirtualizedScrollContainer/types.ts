

export interface VirtualizedScrollProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    onScrollEnd: () => void;
    onScrollStateChange?: (canScrollBack: boolean, canScrollForward: boolean) => void;
    estimateSize?: number;
    isLoading?: boolean;
}

