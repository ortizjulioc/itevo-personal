import React from 'react';
import { Text, View, StyleSheet, Link } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  paragraph: {
    marginBottom: 4,
    fontSize: 10,
    lineHeight: 1.4,
    textAlign: 'justify',
  },
  heading1: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },
  heading2: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 6,
  },
  heading3: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 4,
  },
  bulletList: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 4,
    paddingLeft: 10,
  },
  orderedList: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 4,
    paddingLeft: 10,
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 2,
  },
  bulletItemBullet: {
    width: 15,
    fontSize: 10,
  },
  orderedItemNumber: {
    width: 20,
    fontSize: 10,
  },
  listItemContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableCell: {
    flex: 1,
    padding: 4,
    borderRightStyle: 'solid',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  tableHeader: {
    flex: 1,
    padding: 4,
    borderRightStyle: 'solid',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    fontWeight: 'bold',
  },
});

const renderMarks = (text: string, marks?: any[]) => {
  let isBold = false;
  let isItalic = false;
  let isUnderline = false;
  let color = undefined;

  if (marks) {
    marks.forEach(mark => {
      if (mark.type === 'bold') isBold = true;
      if (mark.type === 'italic') isItalic = true;
      if (mark.type === 'underline') isUnderline = true;
      if (mark.type === 'textStyle' && mark.attrs?.color) color = mark.attrs.color;
    });
  }

  const textStyles: any = {};
  if (isBold) textStyles.fontWeight = 'bold';
  if (isItalic) textStyles.fontStyle = 'italic';
  if (isUnderline) textStyles.textDecoration = 'underline';
  if (color) textStyles.color = color;

  return <Text style={textStyles}>{text}</Text>;
};

const renderNode = (node: any, index: number, context: any = {}) => {
  if (node.type === 'text') {
    return <React.Fragment key={index}>{renderMarks(node.text, node.marks)}</React.Fragment>;
  }

  // Handle alignment
  const alignStyle = node.attrs?.textAlign ? { textAlign: node.attrs.textAlign as any } : {};

  switch (node.type) {
    case 'doc':
      return (
        <View key={index} style={styles.container}>
          {node.content?.map((child: any, i: number) => renderNode(child, i, context))}
        </View>
      );

    case 'paragraph':
      return (
        <Text key={index} style={{ ...styles.paragraph, ...alignStyle }}>
          {node.content?.map((child: any, i: number) => renderNode(child, i, context))}
        </Text>
      );

    case 'heading':
      const level = node.attrs?.level || 1;
      const headingStyle = level === 1 ? styles.heading1 : level === 2 ? styles.heading2 : styles.heading3;
      return (
        <Text key={index} style={{ ...headingStyle, ...alignStyle }}>
          {node.content?.map((child: any, i: number) => renderNode(child, i, context))}
        </Text>
      );

    case 'bulletList':
      return (
        <View key={index} style={styles.bulletList}>
          {node.content?.map((child: any, i: number) => renderNode(child, i, { ...context, listType: 'bullet' }))}
        </View>
      );

    case 'orderedList':
      return (
        <View key={index} style={styles.orderedList}>
          {node.content?.map((child: any, i: number) => renderNode(child, i, { ...context, listType: 'ordered', listIndex: i + 1 }))}
        </View>
      );

    case 'listItem':
      return (
        <View key={index} style={styles.listItem}>
          {context.listType === 'ordered' ? (
            <Text style={styles.orderedItemNumber}>{context.listIndex}.</Text>
          ) : (
            <Text style={styles.bulletItemBullet}>•</Text>
          )}
          <View style={styles.listItemContent}>
            {node.content?.map((child: any, i: number) => renderNode(child, i, context))}
          </View>
        </View>
      );

    case 'table':
      return (
        <View key={index} style={styles.table}>
          {node.content?.map((child: any, i: number) => renderNode(child, i, context))}
        </View>
      );

    case 'tableRow':
      return (
        <View key={index} style={styles.tableRow}>
          {node.content?.map((child: any, i: number) => renderNode(child, i, context))}
        </View>
      );

    case 'tableCell':
      return (
        <View key={index} style={styles.tableCell}>
          {node.content?.map((child: any, i: number) => renderNode(child, i, context))}
        </View>
      );

    case 'tableHeader':
      return (
        <View key={index} style={styles.tableHeader}>
          {node.content?.map((child: any, i: number) => renderNode(child, i, context))}
        </View>
      );

    default:
      if (node.content) {
        return (
          <View key={index}>
            {node.content?.map((child: any, i: number) => renderNode(child, i, context))}
          </View>
        );
      }
      return null;
  }
};

interface TipTapPDFRendererProps {
  content: any; // TipTap JSONContent
}

export const TipTapPDFRenderer: React.FC<TipTapPDFRendererProps> = ({ content }) => {
  if (!content) return null;
  
  // If it's a legacy format (array of strings), map it to paragraphs
  if (Array.isArray(content)) {
    return (
      <View style={styles.container}>
        {content.map((str, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bulletItemBullet}>•</Text>
            <Text style={styles.paragraph}>{str}</Text>
          </View>
        ))}
      </View>
    );
  }

  // If it's a proper TipTap object
  if (content.type === 'doc') {
    return renderNode(content, 0);
  }

  return null;
};
