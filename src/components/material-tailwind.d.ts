import "react";
import "@material-tailwind/react";

// Fix for Material Tailwind Typography props mismatch with newer React types
// This resolves errors like "Property 'placeholder' is missing..." caused by
// strict type inference on the 'as' polymorphic prop.
declare module "@material-tailwind/react" {
  export interface TypographyProps {
    placeholder?: string;
    onResize?: React.ReactEventHandler;
    onResizeCapture?: React.ReactEventHandler;
    onPointerEnterCapture?: React.PointerEventHandler;
    onPointerLeaveCapture?: React.PointerEventHandler;
  }
}