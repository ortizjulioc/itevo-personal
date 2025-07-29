// components/pdf/invoice.tsx
import { formatCurrency, formatPhoneNumber } from '@/utils';
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
    padding: 20,
    fontFamily: 'Helvetica',
  },
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
    fontSize: 12,
    lineHeight: 1.5,
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
    width: 96,
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
    fontSize: 14,
    marginBottom: 6,
  },
  ruleItem: {
    marginBottom: 4,
    textAlign: 'justify',
    fontSize: 11,
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

type Schedule = {
  schedule: {
    startTime: string; // "08:00"
    endTime: string;   // "10:00"
    weekday: number;   // 0=Domingo, 1=Lunes, ..., 6=Sábado
  };
};

function formatScheduleList(schedules: Schedule[]): string {
  const weekdays = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ];

  const formatTime = (time24: string) => {
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
    return `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
  };

  return schedules.map(({ schedule }) => {
    const day = weekdays[schedule.weekday];
    const start = formatTime(schedule.startTime);
    const end = formatTime(schedule.endTime);
    return `${day} ${start} - ${end}`;
  }).join(', ');
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
};

const normas: string[] = [
  "No faltar a las clases.",
  "Traer dos fotos 2x2 y doscientos pesos (200) para el carnet estudiantil.",
  "Es carácter obligatorio el Taller de Servicio al cliente de los siguientes cursos: Auxiliar en Farmacia, Secretariado Ejecutivo y Cajera Comercial, Mercadeo y Ventas, Visitador a Médico, Especialista en Belleza.",
  "Debe de comprar un suéter que tiene un costo de quinientos pesos (500), este le servirá como uniforme de la institución.",
  "Los pagos deben realizarse semanal.",
  "Se debe pagar desde la primera semana de clases.",
  "Las semanas de ausencia se pagan, y se toman en consideración para el récord de asistencia.",
  "Si su curso es de 6 meses o menos, no debe acumular 3 ausencias, si es de 9 meses o más no debe acumular 5 ausencias, en tal caso, deberá reiniciar el curso.",
  "Es de carácter obligatorio asistir a la graduación (juramentación), este acto es parte integral del curso. El costo de la graduación es de tres mil quinientos pesos (RD$3,500); Incluye: diploma, investidura, 5 fotografías. NOTA: el acto se celebra en tarde de 2:00 a 6:00 p.m. Regularmente sábado o domingo. (solo debe realizar una graduación, en los demás cursos que realice solo paga el derecho a diploma en excepción de auxiliar de enfermería).",
  "Si desea, puede obtener su anillo de graduación, ya sea, en oro o plata.",
  "Es de carácter obligatorio asistir al seminario de relaciones humanas (incluido en el programa de clases como formación integral). Costo: ochocientos pesos (RD$800.00); dicha actividad se realiza sábado en la tarde o domingo. (el seminario sólo es obligatorio al hacer el primer curso en esta institución. En los demás cursos que realice es opcional en excepción de auxiliar de enfermería).",
  "No se entregará el diploma si no ha cumplido con el programa de clases o tiene asuntos pendientes tales como: (exámenes, pasantía, pagos, seminario, graduación, entre otros).",
  "Los niños deben esperar a que sus padres o tutores pasen a buscarlos en el plantel después de clases.",
  "No traer acompañantes a las clases.",
  "Asistir debidamente vestida/o a clases.",
  "Asistir a clases portando su carnet estudiantil.",
  "Si usted realiza dos cursos en una misma promoción el costo adicional del segundo diploma son RD$1,000 pesos (No aplica si es auxiliar de enfermería).",
  "Es su responsabilidad guardar los recibos de los pagos que realiza en la institución, ya que este le servirá para cualquier reclamación.",
  "Luego de haber terminado el curso, el estudiante, no debe dejar pasar un (1) año para retirar su diploma, de lo contrario perderá el derecho a ser certificado como técnico en esta institución. No se entrega diplomas a terceros."
];


export const EnrollmentPDF = ({ enrollment, companyInfo }: EnrollmentPDFProps) => {
  const schedules = formatScheduleList(enrollment.courseBranch.schedules || []);
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
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{companyInfo.companyName}</Text>
            <Text style={{ marginVertical: 8 }}>{companyInfo.address} - {companyInfo.phone}</Text>
          </View>

          <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Inscripción</Text>
          <View style={styles.studentInfoContainer}>
            <View style={{ width: '50%' }}>
              <InfoField title='Nombre: ' value={`${enrollment.student.firstName} ${enrollment.student.lastName}`} />
              <InfoField title='Curso: ' value={enrollment.courseBranch.course.name} />
              <InfoField title='Código:' value={enrollment.courseBranch.course.code} />
              <InfoField title='Pago semanal:' value={formatCurrency(enrollment.courseBranch.amount)} />
            </View>
            <View style={{ width: '50%' }}>
              <InfoField title='Horario: ' value={schedules} />
              <InfoField title='Teléfono:' value={formatPhoneList(enrollment.student.phone)} />
            </View>
          </View>

          <View style={styles.rulesSection}>
            <Text style={styles.rulesTitle}>USTED SE INSCRIBIÓ ACEPTANDO LAS SIGUIENTES NORMAS:</Text>
            {normas.map((norma, index) => (
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
