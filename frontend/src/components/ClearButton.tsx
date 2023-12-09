import { Button, ButtonProps, SxProps } from '@mui/material';
import { ReactNode } from 'react';

interface ClearButtonProps extends ButtonProps {
    children: ReactNode;
    // eslint-disable-next-line react/require-default-props
    sx?: SxProps;
}

const ClearButton: React.FC<ClearButtonProps> = ({
    children,
    sx = {},
    ...props
}: ClearButtonProps) => {
    const clearStyle: SxProps = {
        color: '#7096d6',
        fontSize: '0.8rem',
        p: 0,
        lineHeight: 'normal',
        minWidth: 'fit-content',
        '&.MuiButtonBase-root:hover': {
            bgcolor: 'transparent',
            textDecoration: 'underline',
            filter: 'brightness(85%)',
        },
        ...sx,
    };

    return (
        <Button
            disableElevation
            disableRipple
            variant="text"
            sx={clearStyle}
            {...props}
        >
            {children}
        </Button>
    );
};

export default ClearButton;
