import { formatCurrency, formatPhoneNumber } from '@/utils';
import { formatScheduleList } from '@/utils/schedule';
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import { Style } from '@react-pdf/types';

Font.register({
  family: 'Lato',
  fonts: [
    {
      src: '/fonts/lato/Lato-Regular.ttf', // Regular 400
      fontWeight: 'normal',
      fontStyle: 'normal',
    },
    {
      src: '/fonts/lato/Lato-Bold.ttf', // Bold 700
      fontWeight: 'bold',
      fontStyle: 'normal',
    },
    {
      src: '/fonts/lato/Lato-Italic.ttf', // Italic 400
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
    {
      src: '/fonts/lato/Lato-BoldItalic.ttf', // Bold Italic 700
      fontWeight: 'bold',
      fontStyle: 'italic',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Lato',
    fontSize: 11,
  },
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
    // fontSize: 12,
    lineHeight: 1,
  },
  logo: {
    textAlign: 'center',
    marginBottom: 10,
  },
  header: {
    textAlign: 'center',
    marginBottom: 4,
  },
  studentInfoContainer: {
    width: '100%',
    display: 'flex',
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
    width: 68,
  },
  infoFieldValue: {
    flex: 1,
    flexWrap: 'wrap',
    fontWeight: 'bold',
    wordBreak: 'break-word',
  },
  rulesSection: {
    marginTop: 20,
  },
  rulesTitle: {
    fontWeight: 'bold',
    // fontSize: 14,
    marginBottom: 6,
  },
  ruleItem: {
    marginBottom: 4,
    textAlign: 'justify',
    fontSize: 10,
    lineHeight: 1.4,
  },
  signatureContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 30,
  },
  linea: {
    width: '40%',
    borderBottom: 1,
    borderBottomColor: '#6b7280',
    marginBottom: 10,
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

function formatPhoneList(phoneList: string): string {
  return phoneList
    .split(',')
    .map(phone => formatPhoneNumber(phone.trim()))
    .filter(Boolean) // elimina posibles strings vacíos
    .join(' / ');
}


type EnrollmentPDFProps = {
  enrollment: any;
  companyInfo: any;
  rules: string[];
};


export const EnrollmentPDF = ({ enrollment, companyInfo, rules }: EnrollmentPDFProps) => {
  const schedules = formatScheduleList(enrollment.courseBranch.schedules || []);
  return (
    <Document>
      <Page size={'LETTER'} style={styles.page}>
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
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{companyInfo.titleReport}</Text>
            <Text style={{ marginVertical: 8, fontWeight: 'bold' }}>{companyInfo.descriptionReport}</Text>
          </View>

          {/* <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Inscripción</Text> */}
          <View style={styles.studentInfoContainer}>
            <View style={{ width: '50%' }}>
              <InfoField title='Nombre: ' value={`${enrollment.student.firstName} ${enrollment.student.lastName}`} />
              <InfoField title='Curso: ' value={enrollment.courseBranch.course.name} />
              <InfoField title='Código:' value={enrollment.courseBranch.course.code} />
              <InfoField title='Cuota:' value={formatCurrency(enrollment.courseBranch.amount)} />
            </View>
            <View style={{ width: '50%' }}>
              <InfoField title='Inscripción:' value={formatCurrency(enrollment.courseBranch.enrollmentAmount || 0)} />
              <InfoField title='Horario: ' value={schedules} />
              <InfoField title='Teléfono:' value={formatPhoneList(enrollment.student.phone)} />
            </View>
          </View>

          <View style={styles.rulesSection}>
            <Text style={styles.rulesTitle}>USTED SE INSCRIBIÓ ACEPTANDO LAS SIGUIENTES NORMAS:</Text>
            {rules.length > 0 && rules.map((norma, index) => (
              <Text key={index} style={styles.ruleItem}>
                {index + 1}. {norma}
              </Text>
            ))}
          </View>

          <View style={styles.signatureContainer}>
            <View style={styles.linea} />
            <Text>Firma del estudiante o tutor</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
