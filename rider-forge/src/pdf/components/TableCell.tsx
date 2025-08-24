import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

type HorizontalAlign = 'left' | 'center' | 'right';

export interface TableCellProps {
  children?: React.ReactNode;
  widthPercent: number;
  align?: HorizontalAlign;
  isHeader?: boolean;
  showRightBorder?: boolean;
  padding?: number;
  truncateLines?: number; // when set, limit text to N lines
}

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
  },
  text: {
    fontSize: 10,
  },
  textBold: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export const TableCell: React.FC<TableCellProps> = ({
  children,
  widthPercent,
  align = 'left',
  isHeader = false,
  showRightBorder = true,
  padding = 6,
  truncateLines,
}) => {
  const containerStyle = {
    width: `${widthPercent}%`,
    padding,
    borderRightWidth: showRightBorder ? 1 : 0,
    borderRightColor: '#DDD',
  } as const;

  const textStyle = [isHeader ? styles.textBold : styles.text, { textAlign: align }];

  const content = typeof children === 'string' || typeof children === 'number'
    ? (
        <Text style={textStyle} maxLines={truncateLines} wrap={!isHeader}>
          {String(children)}
        </Text>
      )
    : (
        // If a custom node is provided, try to pass maxLines when it's a Text
        <View>
          {children}
        </View>
      );

  return (
    <View style={[styles.cell, containerStyle]}>
      {content}
    </View>
  );
};

export default TableCell;


