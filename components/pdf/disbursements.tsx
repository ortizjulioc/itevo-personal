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
import { Style } from '@react-pdf/types';

const styles = StyleSheet.create({
  page: {
    padding: 2,
    fontSize: 8,
    fontFamily: 'Helvetica',
    lineHeight: 1.2,
  },
  container: {
    width: 192, // Menos de 72mm (72mm = ~204.094pt)
    maxWidth: 192,
    marginHorizontal: 4,
  },
  header: {
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: .6,
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
  infoField: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  infoFieldTitle: {
    fontWeight: 'bold',
    width: 64, // Ajusta el ancho del título para que no ocupe toda la línea
  },
  infoFieldValue: {
    flex: 1,
    flexWrap: 'wrap',
    wordBreak: 'break-word',
  },
  footer: {
    textAlign: 'center',
    marginTop: 10,
  },
});

const InfoField = ({ title, value }: { title: string; value: string | null }) => {
  const valueStyle: Style = Boolean(value) ? styles.infoFieldValue : { ...styles.infoFieldValue, fontStyle: 'italic', color: '#6b7280' }  // gray-500
  return (
    <View style={styles.infoField}>
      <Text style={styles.infoFieldTitle}>{title}</Text>
      <Text style={valueStyle}>{value || 'No especificado'}</Text>
    </View>
  )
}

export const DisbursementPDF = ({ disbursement, companyInfo, logo }: { disbursement: any, companyInfo: any, logo: Blob | null }) => {
  const {
    id,
    amount,
    date,
    description,
    user: { name, lastName },
    accountPayable: { teacher: { name: teacherName, lastName: teacherLastName } },
  } = disbursement;


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

          <View style={{ marginBottom: 6 }}>
            <InfoField title="Número:" value={id.split('-').pop()} />
            <InfoField title="Fecha:" value={date} />
            <InfoField title="Profesor:" value={`${teacherName} ${teacherLastName}`} />
            <InfoField title="Monto:" value={`${amount}`} />
            <InfoField title="Usuario:" value={`${name} ${lastName}`} />
          </View>

          <View style={{ marginBottom: 6 }}>
            <Text>Concepto:</Text>
            <Text>{description}</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.line} />
            <Text style={{ textAlign: 'center' }}>Recibido por</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
