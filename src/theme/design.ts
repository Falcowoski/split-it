export const shadows = {
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-md',
    xl: 'shadow-lg',
    xxl: 'shadow-xl',
};

// Estilos padronizados para componentes principais
export const button = {
    base: 'items-center justify-center rounded-md',
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    danger: 'bg-yellow-500',
    text: 'text-white font-medium',
    disabled: 'opacity-50',
    sizes: {
        sm: 'py-2 px-3',
        md: 'py-3 px-4',
        lg: 'py-4 px-5',
    },
};

export const input = {
    base: 'border rounded-md p-3 bg-white w-full',
    normal: 'border-neutral-300',
    error: 'border-danger-500',
    label: 'font-medium mb-1 text-neutral-700',
    errorText: 'text-danger-500 text-xs mt-1',
    disabled: 'bg-neutral-100 text-neutral-400',
};

export const card = {
    base: 'bg-white rounded-lg p-4',
    shadow: shadows.md,
};

export const text = {
    h1: 'text-3xl font-bold',
    h2: 'text-2xl font-bold',
    h3: 'text-xl font-bold',
    h4: 'text-lg font-bold',
    h5: 'text-base font-bold',
    h6: 'text-sm font-bold',
    p: 'text-base',
    label: 'text-sm font-medium',
    caption: 'text-xs',
};
