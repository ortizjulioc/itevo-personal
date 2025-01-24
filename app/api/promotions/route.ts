import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getPromotions, createPromotion } from "@/services/promotion-service";
import { formatErrorMessage } from "@/utils/error-to-string";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const top = parseInt(searchParams.get('top') || '10', 10);

        const { promotions, totalPromotions } = await getPromotions(search, page, top);

        return NextResponse.json({ promotions, totalPromotions }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { isValid, message } = validateObject(body, ['description', 'startDate', 'endDate']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }

        const promotion = await createPromotion(body);
        return NextResponse.json(promotion, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
