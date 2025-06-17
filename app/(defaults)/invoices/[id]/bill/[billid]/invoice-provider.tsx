import { createContext, useContext } from "react";

const InvoiceContext = createContext<any>(null);
export const InvoiceProvider = InvoiceContext.Provider;

export const useInvoice = () => useContext(InvoiceContext);

export default InvoiceProvider;