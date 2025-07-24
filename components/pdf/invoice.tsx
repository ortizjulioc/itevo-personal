// components/pdf/invoice.tsx
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

const styles = StyleSheet.create({
  page: {
    padding: 4,
    fontSize: 8,
    fontFamily: 'Courier',
  },
  container: {
    width: 192, // Menos de 72mm (72mm = ~204.094pt)
    maxWidth: 192,
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
  },
  columnText: {
    flexDirection: 'column',
    flex: 1,
    paddingHorizontal: 2,
  },
  rightText: {
    textAlign: 'right',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  tableItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  footer: {
    textAlign: 'center',
    marginTop: 6,
  },
});

export const InvoicePDF = ({ invoice, companyInfo, logo }: { invoice: any, companyInfo: any, logo: Blob | null }) => {
  const { invoiceNumber, student, date, paymentDetails, paymentMethod, subtotal, itbis, items, user } = invoice;

  const total = subtotal + itbis;
  const receivedAmount = parseFloat(paymentDetails?.receivedAmount || '0');
  const returned = receivedAmount - total;

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

          {/* <View style={styles.line} />
          <Text>{NCF_TYPES[type as NcfType].label}</Text>
          <Text>NCF: {ncf}</Text>
          <View style={styles.line} /> */}

          <Text>Factura No. {invoiceNumber}</Text>
          <Text>Fecha: {getFormattedDateTime(new Date(date), { hour12: true })}</Text>
          <Text>Cliente: {student ? `${student.firstName || ''} ${student.lastName || ''}` : ''} </Text>
          <View style={styles.line} />
          <Text style={{ textAlign: 'center' }}>FACTURA CONTADO</Text>
          <View style={styles.line} />

          <View style={styles.tableHeader}>
            <Text style={{ marginRight: 3}}>Cant.</Text>
            <Text style={{ flex: 1 }}>Descripción / Precio</Text>
            <Text>Subtotal</Text>
          </View>

          {items.map((item: any, index: number) => (
            <View style={styles.tableItem} key={index}>
              <Text>{item.quantity}</Text>
              <View style={styles.columnText}>
                <Text>{item.concept}</Text>
                <Text style={{}}>{item.unitPrice.toFixed(2)}</Text>
              </View>
              <Text>{(item.quantity * item.unitPrice).toFixed(2)}</Text>
            </View>
          ))}

          <View style={styles.line} />

          <View style={styles.row}>
            <Text>Subtotal:</Text>
            <Text>{subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text>ITBIS:</Text>
            <Text>{itbis.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text>Total:</Text>
            <Text style={{ fontWeight: 'bold' }}>{total.toFixed(2)}</Text>
          </View>

          <View style={styles.line} />

          <Text>{paymentMethod?.toUpperCase()}: {receivedAmount.toFixed(2)}</Text>
          <Text>Recibido: {receivedAmount.toFixed(2)}</Text>
          <Text>Devuelta: {returned.toFixed(2)}</Text>
          <Text style={{ marginTop: 4 }}>Le atendió: {user.name} {user.lastName}</Text>

          <View style={styles.footer}>
            <View style={styles.line} />
            <Text>¡Gracias por su compra!</Text>
            <Text style={{ fontSize: 6 }}>No se acepta devoluciones de dinero en efectivo</Text>
            <View style={styles.line} />
          </View>
        </View>
      </Page>
    </Document>
  );
};
