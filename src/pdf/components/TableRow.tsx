import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';

export interface TableRowProps {
  children?: React.ReactNode;
  isHeader?: boolean;
  backgroundColor?: string;
  borderBottomColor?: string;
  borderBottomWidth?: number;
  minHeight?: number;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
});

export const TableRow: React.FC<TableRowProps> = ({
  children,
  backgroundColor,
  borderBottomColor = '#DDD',
  borderBottomWidth = 1,
  minHeight,
}) => {
  const containerStyle = {
    backgroundColor,
    borderBottomColor,
    borderBottomWidth,
    minHeight,
  } as const;

  return (
    <View style={[styles.row, containerStyle]}>{children}</View>
  );
};

export default TableRow;


