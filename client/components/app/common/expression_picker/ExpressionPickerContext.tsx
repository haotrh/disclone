import React, { ReactNode, useContext } from "react";
import { ExpressionTab } from "./ExpressionPicker";

interface IExpressionPickerContext {
  tab: ExpressionTab;
  setTab: (tab: ExpressionTab) => any;
}

export const ExpressionPickerContext = React.createContext<IExpressionPickerContext>(
  {} as IExpressionPickerContext
);

type ExpressionPickerProviderProps = { children: ReactNode } & IExpressionPickerContext;

const ExpressionPickerProvider = ({ children, ...props }: ExpressionPickerProviderProps) => {
  return (
    <ExpressionPickerContext.Provider value={props}>{children}</ExpressionPickerContext.Provider>
  );
};

const useExpressionPicker = (): IExpressionPickerContext => {
  const context = useContext(ExpressionPickerContext);

  if (context == undefined) {
    throw new Error("useExpressionPicker must be used within a ExpressionPickerProvider");
  }

  return context;
};

export { ExpressionPickerProvider, useExpressionPicker };
