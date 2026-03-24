import AddItemsQuotation from "./add-items-quotation";
import QuotationProvider from "./quotation-provider";


export default async function QuotationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <QuotationProvider quotationId={id}>
            <div className="flex flex-col gap-6">
                <AddItemsQuotation />
            </div>
        </QuotationProvider>
    );
}
