import { useState, ReactNode, SyntheticEvent } from 'react';
import { useTheme } from '@mui/material/styles';
import { ResizableBox } from 'react-resizable';
import DragHandleIcon from '@mui/icons-material/DragHandle';

interface ResizeCallbackData {
    size: {
        width: number;
        height: number;
    };
}

interface ResizableTableProps {
    initialHeight: number;
    children: (height: number) => ReactNode;
}

const ResizableTable: React.FC<ResizableTableProps> = ({
    initialHeight,
    children,
}: ResizableTableProps) => {
    const [height, setHeight] = useState(initialHeight);
    const theme = useTheme();

    const handleResize = (
        event: SyntheticEvent,
        { size }: ResizeCallbackData
    ) => {
        setHeight(size.height);
    };

    return (
        <ResizableBox
            height={height}
            width={Infinity}
            onResize={handleResize}
            resizeHandles={['s']}
            minConstraints={[Infinity, 326]}
            maxConstraints={[Infinity, 3030]}
            draggableOpts={{ grid: [52, 52] }}
            className={`react-resizable react-resizable_${
                theme.palette.mode === 'dark' ? 'dark' : 'light'
            }`}
            // eslint-disable-next-line react/no-unstable-nested-components
            handle={(h, ref) => (
                <span
                    className={`react-resizable-handle react-resizable-handle-${h}`}
                    ref={ref}
                >
                    <DragHandleIcon sx={{ color: 'white' }} />
                </span>
            )}
        >
            {children(height)}
        </ResizableBox>
    );
};

export default ResizableTable;
