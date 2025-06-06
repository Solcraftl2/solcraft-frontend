import React, {
    cloneElement,
    ReactElement,
    RefObject,
    useRef,
    useState,
} from 'react';
import {
    Placement,
    FloatingArrow,
    offset,
    flip,
    shift,
    autoUpdate,
    useFloating,
    useInteractions,
    useHover,
    useFocus,
    useDismiss,
    useRole,
    arrow,
    useTransitionStyles,
    FloatingPortal,
} from '@floating-ui/react';
import cn from '@/utils/cn';


const tooltipAnimation = {
    fadeIn: {
        initial: {
            opacity: 0,
        },
        close: {
            opacity: 0,
        },
    },
    zoomIn: {
        initial: {
            opacity: 0,
            transform: 'scale(0.96)',
        },
        close: {
            opacity: 0,
            transform: 'scale(0.96)',
        },
    },
    slideIn: {
        initial: {
            opacity: 0,
            transform: 'translateY(4px)',
        },
        close: {
            opacity: 0,
            transform: 'translateY(4px)',
        },
    },
};

export type TooltipProps = {
    /** Pass children which will have tooltip */
    children: ReactElement & { ref?: RefObject<any> };
    /** Content for tooltip */
    // content: ({ open, setOpen }: Content) => React.ReactNode;
    content: React.ReactNode;
    /** Supported Tooltip Placements are: */
    placement?: Placement;
    /** Set custom offset default is 8 */
    gap?: number;
    /** Supported Animations are: */
    animation?: keyof typeof tooltipAnimation;
    /** Add custom classes for Tooltip container or content */
    className?: string;
    /** Add custom classes for Tooltip arrow */
    arrowClassName?: string;
    /** Whether tooltip arrow should be shown or hidden */
    showArrow?: boolean;
    /** Whether the tooltip is used as a popover component or not */
    // isPopover?: boolean;
};

/**
 * Tooltip displays informative text when users hover, focus, or click an element.
 * Here is the API documentation of the Tooltip component.
 * You can use the following props to create a demo of tooltip.
 */
export default function Tooltip({
    children,
    content,
    gap = 8,
    animation = 'zoomIn',
    placement = 'top',
    className,
    arrowClassName,
    showArrow = true,
}: TooltipProps) {
    const [open, setOpen] = useState(false);
    const arrowRef = useRef(null);

    const { x, y, refs, strategy, context } = useFloating({
        placement,
        open: open,
        onOpenChange: setOpen,
        middleware: [
            arrow({ element: arrowRef }),
            offset(gap),
            flip(),
            shift({ padding: 8 }),
        ],
        whileElementsMounted: autoUpdate,
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        useHover(context),
        useFocus(context),
        useRole(context, { role: 'tooltip' }),
        useDismiss(context),
    ]);

    const { isMounted, styles } = useTransitionStyles(context, {
        duration: { open: 150, close: 150 },
        ...tooltipAnimation[animation],
    });

    return (
        <>
            {cloneElement(
                children,
                getReferenceProps({
                    ref: refs.setReference,
                    ...(typeof children.props === 'object' ? children.props : {}),
                })
            )}
            {(isMounted || open) && (
                <FloatingPortal>
                    <div
                        role="tooltip"
                        ref={refs.setFloating}
                        className={cn("text-center z-[9999] min-w-max bg-white dark:bg-dark shadow-lg rounded px-3 py-1.5 text-sm", className)}
                        style={{
                            position: strategy,
                            top: y ?? 0,
                            left: x ?? 0,
                            ...styles,
                        }}
                        {...getFloatingProps()}
                    >
                        {content}
                        {showArrow &&
                            <FloatingArrow
                                ref={arrowRef}
                                context={context}
                                data-testid="tooltip-arrow"
                                className={cn("fill-white dark:fill-dark", arrowClassName)}
                                style={{ strokeDasharray: '0,14, 5' }}
                            />
                        }
                    </div>
                </FloatingPortal>
            )}
        </>
    );
}
