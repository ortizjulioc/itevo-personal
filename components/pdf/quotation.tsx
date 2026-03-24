import React from 'react';
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import { getFormattedDateTime } from '@/utils/date';
import { formatNumber } from '@/utils';

Font.register({
    family: 'Roboto Mono',
    fonts: [
      {
        src: '/fonts/roboto-mono/RobotoMono-Regular.ttf',
        fontWeight: 'normal',
        fontStyle: 'normal',
      },
      {
        src: '/fonts/roboto-mono/RobotoMono-Bold.ttf',
        fontWeight: 'bold',
        fontStyle: 'normal',
      },
      {
        src: '/fonts/roboto-mono/RobotoMono-Italic.ttf',
        fontWeight: 'normal',
        fontStyle: 'italic',
      },
      {
        src: '/fonts/roboto-mono/RobotoMono-BoldItalic.ttf',
        fontWeight: 'bold',
        fontStyle: 'italic',
      },
    ],
  });

const styles = StyleSheet.create({
  page: { padding: 2, fontSize: 8, fontFamily: 'Roboto Mono' },
  container: { width: 192, maxWidth: 192, marginHorizontal: 4 },
  header: { textAlign: 'center', marginBottom: 4 },
  line: { height: .4, backgroundColor: '#000000', marginVertical: 3 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  columnText: { flexDirection: 'column', flex: 1, paddingHorizontal: 2 },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: 2 },
  tableItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  footer: { textAlign: 'center', marginTop: 6 },
});

export const QuotationPDF = ({ quotation, companyInfo, logo }: { quotation: any, companyInfo: any, logo: Blob | null }) => {
  const { quotationNumber, student, date, items, user, status } = quotation;

  const subtotal = (items || []).reduce((acc: number, val: any) => acc + ((val.unitPrice || 0) * (val.quantity || 1)), 0);
  const totalDiscount = (items || []).reduce((acc: number, val: any) => acc + (val.discount || 0), 0);
  const total = subtotal - totalDiscount;

  return (
    <Document>
      <Page size={'A4'} style={styles.page}>
        <View style={styles.container}>
          <View>
            {logo && (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={logo as any} style={{ height: 80, objectFit: 'contain' }} />
            )}
          </View>

          <View style={styles.header}>
            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{companyInfo.companyName}</Text>
            <Text>RNC: {companyInfo.rnc}</Text>
            <Text>{quotation.branch?.address || companyInfo.address}</Text>
            <Text>{(quotation.branch?.phone || companyInfo.phone) ? `Tel: ${quotation.branch?.phone || companyInfo.phone}` : ''}</Text>
          </View>

          <Text>Cotización No. {quotationNumber}</Text>
          <Text>Fecha: {getFormattedDateTime(new Date(date || Date.now()), { hour12: true })}</Text>

          {student && (<Text>Estudiante: {student.firstName || ''} {student.lastName || ''}</Text>)}

          <View style={styles.line} />
          <Text style={{ textAlign: 'center' }}>COTIZACIÓN (NO VÁLIDO COMO FACTURA)</Text>
          <View style={styles.line} />

          <View style={styles.tableHeader}>
            <Text style={{ marginRight: 3 }}>Cant.</Text>
            <Text style={{ flex: 1 }}>Descripción</Text>
            <Text>Subt.</Text>
          </View>

          {items?.map((item: any, index: number) => (
            <View style={styles.tableItem} key={index}>
              <Text>{item.quantity}</Text>
              <View style={styles.columnText}>
                <Text>{item.concept || item.product?.name || 'Item'}</Text>
                <Text>{formatNumber(item.unitPrice || 0)} {item.discount > 0 ? `(Desc: -${formatNumber(item.discount)})` : ''}</Text>
              </View>
              <Text>{formatNumber(item.subtotal)}</Text>
            </View>
          ))}

          <View style={styles.line} />
          <View style={styles.row}>
            <Text>Subtotal:</Text>
            <Text>{formatNumber(subtotal)}</Text>
          </View>
          {totalDiscount > 0 && (
            <View style={styles.row}>
                <Text>Descuento:</Text>
                <Text>-{formatNumber(totalDiscount)}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={{ fontWeight: 'bold' }}>Total Estimado:</Text>
            <Text style={{ fontWeight: 'bold' }}>{formatNumber(total)}</Text>
          </View>
          <View style={styles.line} />

          <Text style={{ marginTop: 4 }}>Cotizado por: {user?.name || '--'} {user?.lastName || ''}</Text>

          <View style={styles.footer}>
            <View style={styles.line} />
            <Text>Precios sujetos a variación</Text>
            <Text style={{ fontSize: 6 }}>Este documento es sólo informativo</Text>
            <View style={styles.line} />
          </View>
        </View>
      </Page>
    </Document>
  );
};
