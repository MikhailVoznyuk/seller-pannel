type IconType = 'success' | 'edit' | 'hint' | 'warning' | 'error'

type IconProps = {
    type: IconType;
    size?: number;
}

function matchSrc(type: IconType) {
    switch (type) {
        case 'success':
            return '/icons/success.svg';
        case 'edit':
            return '/icons/edit.svg';
        case 'hint':
            return '/icons/hint.svg';
        case 'warning':
            return '/icons/warning.svg';
        case 'error':
            return '/icons/error.svg';
    }
}

export function Icon({type, size=16}: IconProps) {
    const src= matchSrc(type);
    return (
        <img src={src} style={{width: `${size}px`, height: `${size}px`}} alt='icon'/>
    )
}