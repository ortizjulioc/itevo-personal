import React from 'react';
import {
    Document,
    Image,
    Page,
    StyleSheet,
    Text,
    View,
} from '@react-pdf/renderer';
import { getFormattedDateTime } from '@/utils/date';
import { formatNumber } from '@/utils';
import { CashMovement } from '@/app/(defaults)/cash-registers/lib/use-fetch-cash-movement-by-id';

const styles = StyleSheet.create({
    page: {
        padding: 2,
        fontSize: 8,
        fontFamily: 'Courier',
    },
    container: {
        width: 192, // Menos de 72mm (72mm = ~204.094pt)
        maxWidth: 192,
        marginHorizontal: 4,
    },
    header: {
        textAlign: 'center',
        marginBottom: 4,
    },
    line: {
        height: .4,
        backgroundColor: '#000000',
        marginVertical: 3,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    footer: {
        textAlign: 'center',
        marginTop: 6,
    },
});

export const ExpensePDF = ({ cashMovement, companyInfo, logo }: { cashMovement: CashMovement, companyInfo: any, logo: Blob | null }) => {
    const { amount, description, createdAt, user, PayablePayment } = cashMovement;

    return (
        <Document>
            <Page size={'A4'} style={styles.page}>
                <View style={styles.container}>
                    <View>
                        {logo && (
                            // eslint-disable-next-line jsx-a11y/alt-text
                            <Image
                                src={logo}
                                style={{ height: 80, objectFit: 'contain', }}
                            />
                        )}
                    </View>

                    <View style={styles.header}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{companyInfo.companyName}</Text>
                        <Text>RNC: {companyInfo.rnc}</Text>
                        <Text>{companyInfo.address}</Text>
                        <Text>
                            {`${companyInfo.email ? `Correo: ${companyInfo.email}` : ''}`}
                        </Text>
                        <Text>{companyInfo.phone ? `Tel: ${companyInfo.phone}` : ''}</Text>
                    </View>

                    <View style={styles.line} />
                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>COMPROBANTE DE EGRESO</Text>
                    <View style={styles.line} />

                    <Text>Fecha: {getFormattedDateTime(new Date(createdAt), { hour12: true })}</Text>

                    {PayablePayment && PayablePayment.accountPayable && PayablePayment.accountPayable.teacher && (
                        <Text>Profesor: {PayablePayment.accountPayable.teacher.firstName} {PayablePayment.accountPayable.teacher.lastName}</Text>
                    )}

                    <View style={styles.line} />

                    <Text style={{ marginBottom: 4 }}>Descripción: {description}</Text>

                    <View style={styles.row}>
                        <Text style={{ fontWeight: 'bold' }}>Monto:</Text>
                        <Text style={{ fontWeight: 'bold' }}>{formatNumber(amount)}</Text>
                    </View>

                    <View style={styles.line} />

                    <Text style={{ marginTop: 4 }}>Realizado por: {user.name} {user.lastName}</Text>

                    <View style={styles.footer}>
                        <View style={styles.line} />
                        <Text>Firma Recibido</Text>
                        <View style={styles.line} />
                    </View>
                </View>
            </Page>
        </Document>
    );
};
