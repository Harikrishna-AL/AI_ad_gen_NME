// import { Colors } from "./styled";
type Color = string;
interface Colors {
    // base
    primary: Color;
    secondary: Color;
  
    // backgrounds
    bgBody: Color;
    bgBorder : Color;

  
    // Buttons
    btnPrimary: Color;
    btnPrimaryHover: Color;

    btnActive: Color;
  
    // Gradients(-)
    primaryGradient: Color;
    textPrimaryGradient: Color;
  
    
  }

export function colors(): Colors {
  return {
    // base
    primary: "rgba(0, 0, 0, 1)",
    secondary: "rgba(249, 208, 13, 0.23)",
    bgBody: "background: #ffffff;  ",
    bgBorder: "rgba(238, 238, 238, 1)",
   
    // Buttons
    btnPrimary: "rgba(249, 208, 13, 1)",
    btnPrimaryHover: "#f9d20d73",

    btnActive:
      "radial-gradient(100% 100% at 50% 0%, rgba(22, 12, 39, 0) 0%, #3A2164 100%), #160C27;",

    // Gradients(-)
    primaryGradient: "#050505",
    textPrimaryGradient: "linear-gradient(90deg, #ACACAC 0%, #414141 100%)",
    //other colors
   
}
}