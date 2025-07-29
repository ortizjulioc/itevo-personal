// components/pdf/invoice.tsx
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
  },
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  logo: {
    textAlign: 'center',
    marginBottom: 10,
  },
  header: {
    textAlign: 'center',
    marginBottom: 4,
  }
});

type EnrollmentPDFProps = {
  enrollment: any;
  companyInfo: any;
};

export const EnrollmentPDF = ({ enrollment, companyInfo }: EnrollmentPDFProps) => {

  return (
    <Document>
      <Page size={'A4'} style={styles.page}>
        <View style={styles.container}>
            <View style={styles.logo}>
              {companyInfo.logo && (
                // eslint-disable-next-line jsx-a11y/alt-text
                <Image
                  src={companyInfo.logo}
                  style={{ height: 80, objectFit: 'contain', }}
                />
              )}
            </View>

            <View style={styles.header}>
              <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{companyInfo.companyName}</Text>
              <Text style={{ fontSize: 8 }}>{companyInfo.address} - {companyInfo.phone}</Text>
            </View>

            <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>Inscripción</Text>
            <View>
                <View>
                    <Text style={{ fontSize: 10, marginBottom: 2 }}>Estudiante: {enrollment.student.name}</Text>
                    <Text style={{ fontSize: 10, marginBottom: 2 }}>Fecha de Inscripción: {new Date(enrollment.date).toLocaleDateString()}</Text>
                </View>
            </View>
        </View>
      </Page>
    </Document>
  );
};
